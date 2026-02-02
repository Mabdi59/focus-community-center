import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/services';
import './StaffPortal.css';

const StaffPortal = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAllBookings();
  }, []);

  const loadAllBookings = async () => {
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      loadAllBookings();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="staff-portal">
      <div className="container">
        <h1>Staff Portal</h1>
        {error && <div className="alert alert-error">{error}</div>}
        
        <div className="bookings-section">
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Facility</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.user.username}</td>
                      <td>{booking.facility.name}</td>
                      <td>{formatDateTime(booking.startTime)}</td>
                      <td>{formatDateTime(booking.endTime)}</td>
                      <td>
                        <span className={`status status-${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>${booking.totalPrice}</td>
                      <td>
                        <div className="action-buttons">
                          {booking.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                className="btn btn-sm btn-success"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                className="btn btn-sm btn-danger"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                              className="btn btn-sm btn-primary"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPortal;
