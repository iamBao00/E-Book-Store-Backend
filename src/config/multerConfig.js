import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudiaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "book-covers",
    allowedFormats: ["jpg", "png"],
  },
});

const upload = multer({ storage: storage });

export default upload;
