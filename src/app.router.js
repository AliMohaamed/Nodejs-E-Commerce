import ApiError from "./utils/error/ApiError.js";
import authRouter from "./modules/auth/auth.router.js";
export const appRouter = (app, express) => {
  // Global Middleware
  app.use(express.json());

  //Routes

  // Auth
  app.use("/auth", authRouter);

  // Global error handler
  app.use((error, req, res, next) => {
    const errorResponse = {
      success: false,
      message: error.message,
      ...(process.env.ENV === "dev" && { stack: error.stack }),
    };
    return res.status(error.statusCode || 500).json(errorResponse);
  });

  // not found page router
  app.all("*", (req, res, next) => {
    return next(new ApiError(404, "Page not found"));
  });
};
