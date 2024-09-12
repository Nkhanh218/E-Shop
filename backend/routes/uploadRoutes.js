import express from "express";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.use(fileUpload({ useTempFiles: true }));

router.post("/", async (req, res) => {
  const { folder } = req.body;

  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }

    const imageFiles = Array.isArray(req.files.image)
      ? req.files.image
      : [req.files.image];

    const uploadPromises = imageFiles.map((imageFile) =>
      cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: folder,
      })
    );

    const results = await Promise.all(uploadPromises);

    const images = results.map((result) => {
      const public_id_full = extractPublicId(result.secure_url);
      const public_id = public_id_full.split("/");
      return {
        public_id: public_id,
        url: result.secure_url,
      };
    });

    res.status(200).json({
      message: "Images uploaded successfully",
      images: images,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    res
      .status(500)
      .json({ message: "Image upload failed", error: error.message });
  }
});
router.post("/delete_imgcloud", async (req, res) => {
  const { current_url } = req.body;
  console.log({ current_url });

  const public_id = extractPublicId(current_url);

  console.log(public_id);
  try {
    if (public_id) {
      const result = await cloudinary.uploader.destroy(public_id);
      console.log(result);
      if (result.result === "ok") {
        res.status(200).json({ message: "Image deleted successfully" });
      } else {
        res
          .status(500)
          .json({ message: "Failed to delete image", error: result });
      }
    } else {
      res.status(400).json({ message: "Invalid image URL" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res
      .status(500)
      .json({ message: "Failed to delete image", error: error.message });
  }
});
export default router;
