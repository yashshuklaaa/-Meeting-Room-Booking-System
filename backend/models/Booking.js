import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recurrence: {
        type: {
            type: String,
            enum: ["none", "daily", "weekly", "monthly"],
            default: "none"
        },
        until: { type: Date } // End date for recurrence
    },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" } // For recurring instances
});

export default mongoose.model("Booking", bookingSchema);
