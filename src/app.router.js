import ApiError from "./utils/error/ApiError.js";
import authRouter from "./modules/auth/auth.router.js";
import categoryRouter from "./modules/category/category.router.js";
import brandRouter from "./modules/brand/brand.router.js";
import productRouter from "./modules/product/product.router.js";
import subcategoryRouter from "./modules/subcategory/subcategory.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";

export const appRouter = (app, express) => {
  // Global Middleware
  app.use(express.json()); // Parse JSON bodies (Parse "req.body" as JSON )

  //Routes

  // Auth
  app.use("/auth", authRouter);

  // Category
  app.use("/category", categoryRouter);

  // Subcategory
  app.use("/subcategory", subcategoryRouter);

  // Brand
  app.use("/brand", brandRouter);

  // Product
  app.use("/product", productRouter);

  // Product
  app.use("/coupon", couponRouter);

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
