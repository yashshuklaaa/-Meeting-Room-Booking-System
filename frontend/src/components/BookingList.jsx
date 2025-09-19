import React from "react";
export default function BookingList({ bookings }) {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Bookings</h2>
            <ul>
                {bookings.map((b) => (
                    <li key={b._id} className="border-b py-2">
                        {b.room.name} - {new Date(b.startTime).toLocaleString()} →{" "}
                        {new Date(b.endTime).toLocaleString()} (by {b.user.name})
                    </li>
                ))}
            </ul>
        </div>
    );
}
