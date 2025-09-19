import React from "react";
export default function RoomList({ rooms }) {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Rooms</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room._id} className="border-b py-2">
                        {room.name} (Capacity: {room.capacity})
                    </li>
                ))}
            </ul>
        </div>
    );
}
