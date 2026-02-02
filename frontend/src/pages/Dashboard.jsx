import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/services';
import './Dashboard.css';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.deleteBooking(id);
      loadBookings();
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>My Dashboard</h1>
        {error && <div className="alert alert-error">{error}</div>}
        
        <div className="dashboard-section">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet. Start by booking a facility!</p>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.facility.name}</h3>
                    <span className={`status status-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <div>
                      <strong>Start:</strong> {formatDateTime(booking.startTime)}
                    </div>
                    <div>
                      <strong>End:</strong> {formatDateTime(booking.endTime)}
                    </div>
                    <div>
                      <strong>Total Price:</strong> ${booking.totalPrice}
                    </div>
                    {booking.notes && (
                      <div>
                        <strong>Notes:</strong> {booking.notes}
                      </div>
                    )}
                  </div>
                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="btn btn-danger"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
