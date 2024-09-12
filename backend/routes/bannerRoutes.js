import express from "express";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/authMiddlewares.js";
const router = express.Router();

router
  .route("/")
  .get(getBanners)
  .post(authenticate, authorizeAdmin, createBanner);

router
  .route("/:id")
  .put(authenticate, authorizeAdmin, updateBanner)
  .delete(authenticate, authorizeAdmin, deleteBanner);

export default router;
