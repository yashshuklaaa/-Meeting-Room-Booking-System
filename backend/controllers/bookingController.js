import Booking from "../models/Booking.js";
import dayjs from "dayjs";

const isConflict = async (roomId, startTime, endTime) => {
    const conflict = await Booking.findOne({
        room: roomId,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } } // overlap check
        ]
    });
    return conflict;
};

export const createBooking = async (req, res) => {
    const { room, startTime, endTime, recurrence } = req.body;

    try {
        // Conflict check
        const conflict = await isConflict(room, startTime, endTime);
        if (conflict) return res.status(400).json({ message: "Room already booked" });

        const booking = await Booking.create({
            room,
            user: req.user._id,
            startTime,
            endTime,
            recurrence
        });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("room user", "name email");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        await booking.remove();
        res.json({ message: "Booking cancelled" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
