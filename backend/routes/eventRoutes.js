import express from "express";
const router = express.Router();
import {
  createEvent,
  updateEvent,
  getEvent,
  getEventById,
  deleteEvent,
} from "../controllers/eventController.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/authMiddlewares.js";
router.route("/").post(authenticate, authorizeAdmin, createEvent);
router.route("/:id").put(authenticate, authorizeAdmin, updateEvent);
router.route("/:id").delete(authenticate, authorizeAdmin, deleteEvent);
router.route("/").get(getEvent);
router.route("/:id").get(getEventById);
export default router;
