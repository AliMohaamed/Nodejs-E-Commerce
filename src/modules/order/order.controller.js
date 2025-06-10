import { fileURLToPath } from "url";
import { Cart } from "../../../DB/models/cart.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";
import path from "path";
import fs from "fs/promises";
import { createInvoice } from "../../utils/invoice.js";
import cloudinary from "../../utils/cloud.js";
import { sendEmail } from "../../utils/sendMail.js";
import { clearStock, updateStock } from "./order.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createOrder = asyncHandler(async (req, res, next) => {
  // data
  const { payment, coupon, address, phone } = req.body;
  // Coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expireAt: { $gt: Date.now() },
    });
    if (!checkCoupon) return next(new ApiError(404, "Invalid coupon"));
  }

  // check cart
  const cart = await Cart.findOne({ user: req.user._id });
  const products = cart.products;
  if (products.length < 1) return next(new ApiError(400, "Empty Cart!"));

  let orderProducts = [];
  let orderPrice = 0;
  for (let i = 0; i < products.length; i++) {
    // check product existence
    const product = await Product.findById(products[i].productId);
    if (!product)
      return next(
        new ApiError(404, `Product ${products[i].productId} not found!`)
      );
    // check stock
    if (!product.inStock(products[i].quantity))
      return next(
        new ApiError(
          400,
          `${product.name} out of stock, only ${product.availableItems} items are left`
        )
      );
    // Order product
    orderProducts.push({
      productId: product._id,
      quantity: products[i].quantity,
      name: product.name,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
    });
    orderPrice += product.finalPrice * products[i].quantity;
  }

  // Create Order
  const order = await Order.create({
    user: req.user._id,
    products: orderProducts,
    address,
    phone,
    price: orderPrice,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
    payment,
  });
  const user = req.user;
  // invoice
  const invoice = {
    shipping: {
      name: user.name,
      address: "Giza",
      city: "6th October",
      country: "Egypt",
    },
    items: order.products,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id,
  };

  const pdfPath = path.join(
    __dirname,
    `./../../utils/invoiceTemp/${order._id}.pdf`
  );
  createInvoice(invoice, pdfPath);
  // upload cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.FOLDER_CLOUD_NAME}/order/invoice/${user._id}`,
  });

  // TODO delete from file system
  await fs.unlink(pdfPath);
  order.invoice = { id: public_id, url: secure_url };
  await order.save();

  const isSent = await sendEmail({
    to: user.email,
    subject: "order invoice",
    attachments: [
      {
        path: secure_url,
        contentType: "application/pdf",
      },
    ],
  });

  if (isSent) {
    updateStock(order.products, true);
    clearStock(user._id);
  }
  return res.status(201).json({
    success: true,
    data: "Order placed successfully, check your email",
  });
});

export const cancelOrder = asyncHandler(async (req, res, next) => {
  // check order
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) return next(ApiError(404, "Order not found!"));

  if (order.status === "shipped" || order.status === "delivered")
    return next(ApiError(400, `Order is ${order.status}, can not canceled`));

  order.status = "canceled";
  await order.save();

  await updateStock(order.products, false);

  res.status(200).json({
    success: true,
    message: "order canceled successfully!",
  });
});
