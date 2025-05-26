import multer, { diskStorage } from "multer";
import ApiError from "./error/ApiError.js";

export const filterObject = {
  image: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  pdf: ["image/pdf"],
  video: ["image/mp4"],
};

export const fileUpload = (fileArray) => {
  const fileFilter = (req, file, cb) => {
    if (!fileArray.includes(file.mimetype)) {
      return cb(new ApiError(400, "Invalid file format!"));
    }
    cb(null, true);
  };
  return multer({ storage: diskStorage({}), fileFilter });
};
