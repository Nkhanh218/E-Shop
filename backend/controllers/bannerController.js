import Slider from "../models/bannerModel.js";
import { v2 as cloudinary } from "cloudinary";

// Get all banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Slider.find();
    res.json(banners);
  } catch (error) {
    console.error("Lỗi khi lấy banners:", error);
    res.status(500).json({ message: "Lỗi server khi lấy banners" });
  }
};

// Create a new banner
export const createBanner = async (req, res) => {
  const { mainBanner, smallSlider, smallBanner } = req.body;

  try {
    const newBanner = new Slider({
      mainBanner: {
        public_id: mainBanner.public_id,
        url: mainBanner.url,
      },
      smallSlider: smallSlider.map((item) => ({
        public_id: item.public_id,
        url: item.url,
      })),
      smallBanner: {
        public_id: smallBanner.public_id,
        url: smallBanner.url,
      },
    });

    const savedBanner = await newBanner.save();
    console.log("Banner đã được lưu:", savedBanner);
    res.status(201).json(savedBanner);
  } catch (error) {
    console.error("Lỗi khi tạo banner:", error);
    res
      .status(400)
      .json({ message: "Lỗi khi tạo banner", error: error.message });
  }
};

// Update a banner
// controllers/bannerController.js

export const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { mainBanner, smallSlider, smallBanner, visible } = req.body;

  try {
    if (visible) {
      // Set all other banners to not visible
      await Slider.updateMany({ _id: { $ne: id } }, { visible: false });
    }

    const updatedBanner = await Slider.findByIdAndUpdate(
      id,
      {
        visible: visible !== undefined ? visible : false,
      },
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: "Không tìm thấy banner" });
    }

    console.log("Banner đã được cập nhật:", updatedBanner);
    res.json(updatedBanner);
  } catch (error) {
    console.error("Lỗi khi cập nhật banner:", error);
    res
      .status(400)
      .json({ message: "Lỗi khi cập nhật banner", error: error.message });
  }
};
// Delete a banner
export const deleteBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await Slider.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Không tìm thấy banner để xóa" });
    }

    // Xóa ảnh từ Cloudinary
    const deleteImage = async (public_id) => {
      try {
        await cloudinary.uploader.destroy(public_id);
      } catch (error) {
        console.error("Lỗi khi xóa ảnh từ Cloudinary:", error);
      }
    };

    // Xóa ảnh chính
    await deleteImage(banner.mainBanner.public_id);

    // Xóa ảnh trong slider nhỏ
    for (const slider of banner.smallSlider) {
      await deleteImage(slider.public_id);
    }

    // Xóa ảnh banner nhỏ
    await deleteImage(banner.smallBanner.public_id);

    // Xóa banner từ database
    await Slider.findByIdAndDelete(id);

    console.log("Banner đã được xóa:", banner);
    res.json({ message: "Banner đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa banner:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi xóa banner", error: error.message });
  }
};
