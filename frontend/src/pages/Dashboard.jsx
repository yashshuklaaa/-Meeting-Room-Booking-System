import React, { useState, useEffect } from 'react';
import BookingCalendar from '../components/BookingCalendar';
import BookingForm from '../components/BookingForm';
import BookingDetailsModal from '../components/BookingDetailsModal';
import apiClient from '../api/api';

const DashboardPage = () => {
    // State for rooms and creating bookings
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedDateInfo, setSelectedDateInfo] = useState(null);

    // State for viewing/cancelling existing bookings
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // State to force the calendar to refresh its events
    const [calendarKey, setCalendarKey] = useState(1);

    // Fetch rooms on initial component load
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await apiClient.get('/rooms');
                setRooms(response.data);
                if (response.data.length > 0) {
                    setSelectedRoomId(response.data[0]._id);
                }
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            }
        };
        fetchRooms();
    }, []);

    // --- HANDLER FUNCTIONS ---

    // Opens the form to create a new booking
    const handleDateSelect = (selectInfo) => {
        setSelectedDateInfo(selectInfo);
        setIsFormModalOpen(true);
    };

    // Opens the modal with details of an existing booking
    const handleEventClick = (clickInfo) => {
        setSelectedEvent({
            id: clickInfo.event.extendedProps.bookingId || clickInfo.event.id,
            title: clickInfo.event.title,
            start: clickInfo.event.start,
            end: clickInfo.event.end,
            isRecurring: clickInfo.event.extendedProps.isRecurring,
            // The specific date of the instance that was clicked
            instanceDate: clickInfo.event.startStr,
        });
        setIsDetailsModalOpen(true);
    };

    // Refreshes the calendar by changing its key, forcing a re-render and event refetch
    const refreshCalendar = () => {
        setCalendarKey(prevKey => prevKey + 1);
    };

    // --- API CALL FUNCTIONS ---

    // Submits data to create a new booking
    const handleBookingSubmit = async (bookingData) => {
        try {
            await apiClient.post('/bookings', bookingData);
            setIsFormModalOpen(false);
            refreshCalendar(); // Refresh after creating
            alert("Booking created successfully!");
        } catch (error) {
            console.error("Failed to create booking", error);
            alert(error.response?.data?.message || 'Failed to create booking.');
        }
    };

    // Sends a request to cancel/delete a booking
    const handleCancelBooking = async (bookingId, scope, instanceDate) => {
        try {
            await apiClient.delete(`/bookings/${bookingId}`, {
                params: { scope, instanceDate }
            });
            setIsDetailsModalOpen(false);
            refreshCalendar(); // Refresh after cancelling
            alert('Booking cancelled successfully!');
        } catch (error) {
            console.error('Failed to cancel booking:', error);
            alert('Failed to cancel booking.');
        }
    };


    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="mb-4">
                    <label htmlFor="room-select" className="block text-sm font-medium text-gray-700">
                        Select a Room
                    </label>
                    <select
                        id="room-select"
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {rooms.map((room) => (
                            <option key={room._id} value={room._id}>
                                {room.name} (Capacity: {room.capacity})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    {selectedRoomId && (
                        <BookingCalendar
                            roomId={selectedRoomId}
                            onDateSelect={handleDateSelect}
                            onEventClick={handleEventClick}
                            // This key combination forces a full component refresh when either value changes
                            key={`${selectedRoomId}-${calendarKey}`}
                        />
                    )}
                </div>

                {/* Modal for CREATING a new booking */}
                {isFormModalOpen && (
                    <BookingForm
                        isOpen={isFormModalOpen}
                        onClose={() => setIsFormModalOpen(false)}
                        onSubmit={handleBookingSubmit}
                        dateInfo={selectedDateInfo}
                        roomId={selectedRoomId}
                    />
                )}

                {/* Modal for VIEWING and CANCELLING an existing booking */}
                {isDetailsModalOpen && (
                    <BookingDetailsModal
                        isOpen={isDetailsModalOpen}
                        onClose={() => setIsDetailsModalOpen(false)}
                        event={selectedEvent}
                        onCancel={handleCancelBooking}
                    />
                )}
            </div>
        </div>
    );
};

export default DashboardPage;