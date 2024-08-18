import express from "express";
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";
const router = express.Router();
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/authMiddlewares.js";
router.route("/").post(authenticate, authorizeAdmin, createCategory);
router.route("/:categoryId").put(authenticate, authorizeAdmin, updateCategory);
router
  .route("/:categoryId")
  .delete(authenticate, authorizeAdmin, removeCategory);
router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);
export default router;
