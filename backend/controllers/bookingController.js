import Booking from '../models/Booking.js';
import rrule from 'rrule';
const { RRule, RRuleSet, rrulestr } = rrule;
import mongoose from 'mongoose';

// --- GET BOOKINGS (Needs updating to handle exceptions) ---
export const getBookings = async (req, res) => {
    try {
        const { start, end } = req.query;
        const bookings = await Booking.find();
        const events = [];

        bookings.forEach(booking => {
            if (booking.isRecurring && booking.recurrenceRule) {
                const ruleSet = new RRuleSet();
                const rule = rrulestr(`DTSTART:${booking.startTime.toISOString().replace(/-|:|\.\d{3}/g, '')}\n${booking.recurrenceRule}`);
                ruleSet.rrule(rule);

                // Exclude cancelled dates
                booking.exceptionDates.forEach(exdate => {
                    ruleSet.exdate(new Date(exdate));
                });

                const dates = ruleSet.between(new Date(start), new Date(end));
                const duration = booking.endTime.getTime() - booking.startTime.getTime();

                dates.forEach(date => {
                    events.push({
                        // Use a composite ID for recurring instances to distinguish them
                        id: `${booking._id}_${date.toISOString()}`,
                        bookingId: booking._id, // Keep track of the original booking
                        title: booking.title,
                        start: date,
                        end: new Date(date.getTime() + duration),
                        roomId: booking.roomId,
                        isRecurring: true,
                    });
                });

            } else {
                if (booking.startTime >= new Date(start) && booking.endTime <= new Date(end)) {
                    events.push({
                        id: booking._id,
                        bookingId: booking._id,
                        title: booking.title,
                        start: booking.startTime,
                        end: booking.endTime,
                        roomId: booking.roomId,
                        isRecurring: false,
                    });
                }
            }
        });

        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- CREATE BOOKING (No changes needed) ---
export const createBooking = async (req, res) => {
    try {
        const { title, roomId, startTime, endTime } = req.body;

        // --- Core Conflict Detection Logic ---
        const conflictingBooking = await Booking.findOne({
            roomId: roomId,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
                { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
            ],
        });

        if (conflictingBooking) {
            return res.status(409).json({ message: 'Double booking detected. This time slot is already taken.' });
        }
        // --- End of Conflict Detection ---

        const newBooking = new Booking({
            title,
            roomId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            // Recurrence fields can be added here from req.body if needed
        });

        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- 👇 ADD UPDATE BOOKING FUNCTION ---
export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, startTime, endTime } = req.body;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Add conflict detection here if you allow time changes

        booking.title = title || booking.title;
        booking.startTime = startTime || booking.startTime;
        booking.endTime = endTime || booking.endTime;

        const updatedBooking = await booking.save();
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};


// --- 👇 ADD DELETE BOOKING FUNCTION (with recurring logic) ---
export const deleteBooking = async (req, res) => {
    const { id } = req.params;
    const { scope, instanceDate } = req.query; // scope can be 'all', 'future', 'instance'

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No booking with that id');
    }

    try {
        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (!booking.isRecurring || scope === 'all') {
            // --- Case 1: Delete a single booking or ALL instances of a recurring one ---
            await Booking.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Booking deleted successfully' });
        }

        if (scope === 'instance') {
            // --- Case 2: Delete only ONE instance of a recurring booking ---
            booking.exceptionDates.push(new Date(instanceDate));
            await booking.save();
            return res.status(200).json({ message: 'Booking instance cancelled' });
        }

        if (scope === 'future') {
            // --- Case 3: Delete this and ALL FUTURE instances ---
            const rule = rrulestr(booking.recurrenceRule);
            const untilDate = new Date(instanceDate);
            untilDate.setDate(untilDate.getDate() - 1); // End the rule the day before this instance

            const newRuleOptions = rule.options;
            newRuleOptions.until = untilDate;

            const newRule = new RRule(newRuleOptions);
            booking.recurrenceRule = newRule.toString();

            await booking.save();
            return res.status(200).json({ message: 'Future bookings cancelled' });
        }

        res.status(400).json({ message: 'Invalid scope for deletion' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
