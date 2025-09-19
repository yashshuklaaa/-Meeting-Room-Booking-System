// import React, { useState, useEffect } from "react";
// import API from "../api/api";

// export default function BookingForm() {
//     const [rooms, setRooms] = useState([]);
//     const [room, setRoom] = useState("");
//     const [startTime, setStartTime] = useState("");
//     const [endTime, setEndTime] = useState("");

//     // Fetch rooms from backend
//     useEffect(() => {
//         const fetchRooms = async () => {
//             try {
//                 const res = await API.get("/getRooms");
//                 setRooms(res.data);
//             } catch (err) {
//                 console.error("Error fetching rooms:", err);
//             }
//         };

//         fetchRooms();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!room || !startTime || !endTime) {
//             alert("Please fill all fields");
//             return;
//         }

//         try {
//             await API.post("/bookings", { room, startTime, endTime });
//             alert("Booking created!");
//             // Clear form
//             setRoom("");
//             setStartTime("");
//             setEndTime("");
//         } catch (err) {
//             alert("Error: " + err.response?.data?.message || err.message);
//         }
//     };

//     return (
//         <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
//             <h2 className="font-bold mb-4 text-xl">Create Booking</h2>
//             <form onSubmit={handleSubmit} className="space-y-3">
//                 <select
//                     value={room}
//                     onChange={(e) => setRoom(e.target.value)}
//                     className="w-full border p-2 rounded"
//                 >
//                     <option value="">Select Room</option>
//                     {rooms.map((r) => (
//                         <option key={r._id} value={r._id}>
//                             {r.name}
//                         </option>
//                     ))}
//                 </select>
//                 <input
//                     type="datetime-local"
//                     value={startTime}
//                     onChange={(e) => setStartTime(e.target.value)}
//                     className="w-full border p-2 rounded"
//                 />
//                 <input
//                     type="datetime-local"
//                     value={endTime}
//                     onChange={(e) => setEndTime(e.target.value)}
//                     className="w-full border p-2 rounded"
//                 />
//                 <button
//                     type="submit"
//                     className="bg-green-600 text-white px-4 py-2 rounded w-full"
//                 >
//                     Book
//                 </button>
//             </form>
//         </div>
//     );
// }


import React, { useState } from 'react';
import { format } from 'date-fns';

const BookingForm = ({ isOpen, onClose, onSubmit, dateInfo, roomId }) => {
    const [title, setTitle] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) {
            alert("Please enter a title for the meeting.");
            return;
        }
        onSubmit({
            title,
            roomId,
            startTime: dateInfo.startStr,
            endTime: dateInfo.endStr
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Book a Time Slot</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Meeting Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4 bg-gray-100 p-3 rounded-md">
                        <p><strong>Room:</strong> Selected Room</p>
                        <p><strong>From:</strong> {format(new Date(dateInfo.startStr), 'MMM d, yyyy h:mm a')}</p>
                        <p><strong>To:</strong> {format(new Date(dateInfo.endStr), 'MMM d, yyyy h:mm a')}</p>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;