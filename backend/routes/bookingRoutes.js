import express from "express";
import { createBooking, getBookings, cancelBooking } from "../controllers/bookingController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/", protect, getBookings);
router.delete("/:id", protect, cancelBooking);

export default router;
