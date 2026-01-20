import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folderName = "file-uploader-app";

    if (req.body.folderName) {
      folderName += `/${req.body.folderName}`;
    }

    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg", "pdf", "docx"],
    };
  },
});

export { cloudinary, storage };
