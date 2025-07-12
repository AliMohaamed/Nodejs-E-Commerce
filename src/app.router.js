import ApiError from "./utils/error/ApiError.js";
import authRouter from "./modules/auth/auth.router.js";
import categoryRouter from "./modules/category/category.router.js";
import brandRouter from "./modules/brand/brand.router.js";
import productRouter from "./modules/product/product.router.js";
import subcategoryRouter from "./modules/subcategory/subcategory.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import orderRouter from "./modules/order/order.router.js";
import reviewRouter from "./modules/review/review.router.js";
import roleRouter from "./modules/role/role.router.js";
import userRouter from "./modules/user/user.router.js";
import morgan from "morgan";

export const appRouter = (app, express) => {
  // Middleware
  // Skip JSON parsing for webhook routes that need raw body
  app.use((req, res, next) => {
    if (req.originalUrl.includes('/order/webhook')) {
      return next();
    }
    return express.json()(req, res, next);
  });

  if (process.env.NODE_ENV === "dev") {
    app.use(morgan("combined"));
  }

  // CORS
  const whitelist = [
    "http://localhost:3000",
    "localhost:3000",
    process.env.BACKEND_URL,
    process.env.DOMAIN_URL,
  ];
  app.use((req, res, next) => {
    // From Browser (Activate account api)
    if (req.originalUrl.includes("/auth/confirmEmail")) {
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET");
      return next();
    }
    const origin = req.headers.origin || req.headers.host;
    if (!whitelist.includes(origin)) {
      return next(new ApiError(403, "Blocked By CROS!"));
    }
    res.setHeader("Access-Control-Allow-Origin", "*");

    // res.setHeader("Access-Control-Allow-Headers","*"); // what send in headers (here: all *)
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Private-Network", true); // for local
    return next();
  });

  // ROUTES
  app.get("/", (req, res) => {
    res.json({ success: true, message: "Welcome to E-Commerce App" });
  });

  // Auth
  app.use("/auth", authRouter);

  // Role
  app.use("/role", roleRouter);

  // User
  app.use("/user", userRouter);

  // Category
  app.use("/category", categoryRouter);

  // Subcategory
  app.use("/subcategory", subcategoryRouter);

  // Brand
  app.use("/brand", brandRouter);

  // Product
  app.use("/product", productRouter);

  // Coupon
  app.use("/coupon", couponRouter);

  // Cart
  app.use("/cart", cartRouter);

  // Order
  app.use("/order", orderRouter);

  // Review
app.use("/review", reviewRouter); 

  // not found page router
  app.all("*", (req, res, next) => {
    return next(new ApiError(404, "Page not found"));
  });

  // Global error handler
  app.use((error, req, res, next) => {
    const errorResponse = {
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "dev" && { stack: error.stack }),
    };
    return res.status(error.statusCode || 500).json(errorResponse);
  });
};
