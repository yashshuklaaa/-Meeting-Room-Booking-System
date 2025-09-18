import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
