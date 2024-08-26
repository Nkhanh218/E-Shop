import express from "express";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Middleware to handle file uploads
router.use(fileUpload({ useTempFiles: true }));

// Route to upload multiple images to Cloudinary
router.post("/", async (req, res) => {
  const { folder } = req.body;

  try {
    // Check if files are provided
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }

    // Access the uploaded files
    const imageFiles = Array.isArray(req.files.image)
      ? req.files.image
      : [req.files.image];

    // Upload each image to Cloudinary and store the results
    const uploadPromises = imageFiles.map((imageFile) =>
      cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: folder, // Optional folder name
      })
    );

    // Await all uploads
    const results = await Promise.all(uploadPromises);

    // Extract image details
    const images = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));

    // Respond with the Cloudinary URLs and image details
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

export default router;
