import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import apiClient from '../api/api';

const BookingCalendar = ({ roomId, onDateSelect, onEventClick }) => {

    const [events, setEvents] = useState([]);

    const fetchEvents = async (fetchInfo) => {
        if (!roomId) return [];
        try {
            const { startStr, endStr } = fetchInfo;
            const response = await apiClient.get('/bookings', {
                params: { start: startStr, end: endStr },
            });
            // Filter events by the currently selected room on the client-side
            const filteredEvents = response.data.filter(event => event.roomId === roomId);
            return filteredEvents.map(event => ({
                id: event._id,
                title: event.title,
                start: event.start,
                end: event.end,
            }));
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
            return [];
        }
    };

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            initialView="timeGridWeek"
            editable={false} // True if you want drag-and-drop
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={fetchEvents}
            select={onDateSelect} // Callback when a date/time is selected
            eventClick={onEventClick}
            key={roomId} // Re-render the calendar when the room ID changes
        />
    );
};

export default BookingCalendar;