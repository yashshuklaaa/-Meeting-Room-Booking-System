// import Room from "../models/Room.js";

// export const createRoom = async (req, res) => {
//     try {
//         const room = await Room.create(req.body);
//         res.json(room);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const getRooms = async (req, res) => {
//     try {
//         let rooms = await Room.find();

//         // Create default rooms if empty
//         if (rooms.length === 0) {
//             const defaultRooms = [
//                 { name: "Conference Room A" },
//                 { name: "Conference Room B" },
//                 { name: "Meeting Room 1" },
//                 { name: "Meeting Room 2" },
//                 { name: "Board Room" },
//             ];
//             rooms = await Room.insertMany(defaultRooms);
//             console.log("Default rooms created");
//         }

//         res.json(rooms);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

import Room from '../models/Room.js';

// Seed some rooms if they don't exist
const seedRooms = async () => {
    try {
        const count = await Room.countDocuments();
        if (count === 0) {
            const rooms = [
                { name: 'Conference Room A', capacity: 10 },
                { name: 'Focus Room B', capacity: 4 },
                { name: 'Boardroom', capacity: 20 },
            ];
            await Room.insertMany(rooms);
            console.log('Rooms seeded successfully!');
        }
    } catch (error) {
        console.error('Error seeding rooms:', error);
    }
};
seedRooms();


export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
