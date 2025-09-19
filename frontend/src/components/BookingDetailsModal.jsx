import React, { useState } from 'react';
import { format } from 'date-fns';

const BookingDetailsModal = ({ isOpen, onClose, event, onCancel }) => {
    const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);

    if (!isOpen) return null;

    const handleDeleteClick = () => {
        if (event.isRecurring) {
            setShowRecurrenceOptions(true);
        } else {
            // For non-recurring events, just confirm and delete.
            if (window.confirm('Are you sure you want to cancel this booking?')) {
                onCancel(event.id, 'all', null);
            }
        }
    };

    const handleRecurrenceCancel = (scope) => {
        onCancel(event.id, scope, event.instanceDate);
        setShowRecurrenceOptions(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                {!showRecurrenceOptions ? (
                    // --- Main Details View ---
                    <>
                        <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                        <div className="mb-4 bg-gray-100 p-3 rounded-md space-y-2">
                            <p><strong>Title:</strong> {event.title}</p>
                            <p><strong>From:</strong> {format(new Date(event.start), 'MMM d, yyyy h:mm a')}</p>
                            <p><strong>To:</strong> {format(new Date(event.end), 'MMM d, yyyy h:mm a')}</p>
                            {event.isRecurring && <p className="text-sm text-blue-600 font-semibold">This is a recurring event.</p>}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
                            {/* <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update</button> */}
                            <button type="button" onClick={handleDeleteClick} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Cancel Booking</button>
                        </div>
                    </>
                ) : (
                    // --- Recurrence Cancellation Options View ---
                    <>
                        <h2 className="text-xl font-bold mb-4">Cancel Recurring Booking</h2>
                        <p className="mb-4">Which instances would you like to cancel?</p>
                        <div className="space-y-3">
                            <button onClick={() => handleRecurrenceCancel('instance')} className="w-full text-left px-4 py-3 bg-gray-100 rounded-md hover:bg-gray-200">
                                <strong>Only this instance</strong><br />
                                <span className="text-sm text-gray-600">{format(new Date(event.start), 'MMM d, yyyy')}</span>
                            </button>
                            <button onClick={() => handleRecurrenceCancel('future')} className="w-full text-left px-4 py-3 bg-gray-100 rounded-md hover:bg-gray-200">
                                <strong>This and all future instances</strong><br />
                                <span className="text-sm text-gray-600">Starting from {format(new Date(event.start), 'MMM d, yyyy')}</span>
                            </button>
                            <button onClick={() => handleRecurrenceCancel('all')} className="w-full text-left px-4 py-3 bg-gray-100 rounded-md hover:bg-gray-200">
                                <strong>All instances in the series</strong><br />
                                <span className="text-sm text-gray-600">The entire recurring booking</span>
                            </button>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="button" onClick={() => setShowRecurrenceOptions(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Back</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingDetailsModal;