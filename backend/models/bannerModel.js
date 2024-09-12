import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  mainBanner: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  smallSlider: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  smallBanner: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  visible: { type: Boolean, default: false },
});

const Slider = mongoose.model("Slider", bannerSchema);
export default Slider;
