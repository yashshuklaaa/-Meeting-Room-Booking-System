import express from "express";
import { createRoom, getRooms } from "../controllers/roomController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRoom);
router.get("/", protect, getRooms);

export default router;
