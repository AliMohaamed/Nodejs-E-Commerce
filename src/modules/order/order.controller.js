import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import Stripe from "stripe";
import { Cart } from "../../../DB/models/cart.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";
import { createInvoice } from "../../utils/invoice.js";
import cloudinary from "../../utils/cloud.js";
import { sendEmail } from "../../utils/sendMail.js";
import { clearStock, updateStock } from "./order.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createOrder = asyncHandler(async (req, res, next) => {
  const { payment, coupon, address, phone } = req.body;

  // Check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expireAt: { $gt: Date.now() },
    });
    if (!checkCoupon) return next(new ApiError(404, "Invalid coupon"));
  }

  // Check cart
  const cart = await Cart.findOne({ user: req.user._id });
  const products = cart?.products || [];
  if (products.length < 1) return next(new ApiError(400, "Empty Cart!"));

  let orderProducts = [];
  let orderPrice = 0;

  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return next(new ApiError(404, `Product ${item.productId} not found!`));
    }
    if (!product.inStock(item.quantity)) {
      return next(
        new ApiError(
          400,
          `${product.name} out of stock, only ${product.availableItems} left`
        )
      );
    }

    orderProducts.push({
      productId: product._id,
      quantity: item.quantity,
      name: product.name,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * item.quantity,
    });

    orderPrice += product.finalPrice * item.quantity;
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

  // Invoice info
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

  // Create invoice directory
  const invoiceDir = path.join(__dirname, "../../utils/invoiceTemp");
  await fs.mkdir(invoiceDir, { recursive: true });

  // Generate invoice PDF
  const pdfPath = path.join(invoiceDir, `${order._id}.pdf`);
  await createInvoice(invoice, pdfPath);

  // Upload to Cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.FOLDER_CLOUD_NAME}/order/invoice/${user._id}`,
  });

  // Remove local PDF
  await fs.unlink(pdfPath);

  // Save invoice link
  order.invoice = { id: public_id, url: secure_url };
  await order.save();

  // Stripe payment if visa
  if (payment === "visa") {
    const stripe = new Stripe(process.env.STRIPE_KEY);

    let existCoupon;
    if (order.coupon.name) {
      existCoupon = await stripe.coupons.create({
        percent_off: order.coupon.discount,
        duration: "once",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      line_items: order.products.map((p) => ({
        price_data: {
          currency: "egp",
          product_data: { name: p.name },
          unit_amount: p.itemPrice * 100,
        },
        quantity: p.quantity,
      })),
      ...(existCoupon && { discounts: [{ coupon: existCoupon.id }] }),
    });

    return res.status(201).json({
      success: true,
      data: session.url,
    });
  }

  // Send invoice by email
  const isSent = await sendEmail({
    to: user.email,
    subject: "Order Invoice",
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
    message: "Order placed successfully, check your email",
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
