import multer from "multer";
import path from "path";
import fs from "fs";
import { ResponseError } from "../errors/responseError.js";

const uploadDir = "uploads/profile";

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if not exists
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Add Filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "user-" + uniqueSuffix + ext);
  },
});

// Filter the received files so that only jpg and png are allowed.
function fileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new ResponseError(400, "Format Image tidak sesuai"), false);
  }
  cb(null, true);
}

export const upload = multer({ storage, fileFilter });
