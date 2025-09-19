// import mongoose from "mongoose";

// const roomSchema = new mongoose.Schema({
//     name: { type: String, required: true, unique: true },
//     capacity: { type: Number, required: true }
// });

// export default mongoose.model("Room", roomSchema);

import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
});

const Room = mongoose.model('Room', roomSchema);
export default Room;