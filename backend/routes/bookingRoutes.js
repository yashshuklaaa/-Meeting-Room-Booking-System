import express from 'express';
// 👇 ADD updateBooking and deleteBooking
import { getBookings, createBooking, updateBooking, deleteBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.route('/')
    .get(getBookings)
    .post(createBooking);

// 👇 ADD THIS ROUTE
router.route('/:id')
    .put(updateBooking)   // For updating a booking
    .delete(deleteBooking); // For deleting a booking

export default router;