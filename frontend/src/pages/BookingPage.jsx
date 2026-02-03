import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { facilityService, bookingService } from '../services/services';
import { useAuth } from '../context/AuthContext';
import './BookingPage.css';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [facility, setFacility] = useState(null);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    notes: '',
  });
  const [availabilityDate, setAvailabilityDate] = useState(() => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  });
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadFacility();
  }, [id]);

  useEffect(() => {
    if (!availabilityDate || !id) {
      return;
    }
    loadAvailability(availabilityDate);
  }, [availabilityDate, id]);

  const loadFacility = async () => {
    try {
      const data = await facilityService.getFacilityById(id);
      setFacility(data);
    } catch (err) {
      setError('Failed to load facility');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async (dateValue) => {
    setAvailabilityLoading(true);
    setAvailabilityError('');
    try {
      const start = `${dateValue}T00:00:00`;
      const end = `${dateValue}T23:59:59`;
      const data = await bookingService.getBookingsByFacilityRange(id, start, end);
      setAvailability(data);
    } catch (err) {
      setAvailabilityError('Failed to load availability.');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if ((name === 'startTime' || name === 'endTime') && value) {
      const newDate = value.split('T')[0];
      if (newDate) {
        setAvailabilityDate(newDate);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setSuccess('');

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError('End time must be after start time.');
      return;
    }

    if (hasOverlap()) {
      setError('Selected time overlaps an existing booking.');
      return;
    }

    try {
      await bookingService.createBooking({
        facilityId: parseInt(id),
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes,
      });
      setSuccess('Booking created successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!facility) return <div className="alert alert-error">Facility not found</div>;

  const getSlotsForDate = (dateValue) => {
    if (!dateValue) {
      return [];
    }
    const slots = [];
    for (let hour = 8; hour < 20; hour += 1) {
      const start = `${dateValue}T${String(hour).padStart(2, '0')}:00`;
      const end = `${dateValue}T${String(hour + 1).padStart(2, '0')}:00`;
      slots.push({ start, end });
    }
    return slots;
  };

  const hasOverlap = () => {
    if (!formData.startTime || !formData.endTime) {
      return false;
    }
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return false;
    }
    return availability.some((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      return bookingStart < end && bookingEnd > start;
    });
  };

  const slots = getSlotsForDate(availabilityDate);
  const overlapSelected = hasOverlap();

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-layout">
          <div className="facility-details">
            <h2>{facility.name}</h2>
            <p className="facility-type">{facility.type}</p>
            <p>{facility.description}</p>
            <div className="facility-info">
              <div>
                <strong>Capacity:</strong> {facility.capacity} people
              </div>
              <div>
                <strong>Rate:</strong> ${facility.hourlyRate}/hour
              </div>
            </div>
          </div>
          <div className="booking-form">
            <h3>Make a Booking</h3>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {overlapSelected && !error && (
              <div className="alert alert-warning">
                Selected time overlaps an existing booking. Please choose another slot.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="availability-section">
                <div className="availability-header">
                  <h4>Availability</h4>
                  <p>Times shown in your local time zone.</p>
                </div>
                <div className="form-group">
                  <label htmlFor="availability-date">Select Date</label>
                  <input
                    id="availability-date"
                    type="date"
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                  />
                </div>
                {availabilityLoading && <div className="availability-status">Loading availability...</div>}
                {availabilityError && <div className="alert alert-error">{availabilityError}</div>}
                <div className="time-slots">
                  {slots.map((slot) => {
                    const slotStart = new Date(slot.start);
                    const slotEnd = new Date(slot.end);
                    const isBooked = availability.some((booking) => {
                      const bookingStart = new Date(booking.startTime);
                      const bookingEnd = new Date(booking.endTime);
                      return bookingStart < slotEnd && bookingEnd > slotStart;
                    });
                    return (
                      <button
                        type="button"
                        key={slot.start}
                        className={`time-slot ${isBooked ? 'time-slot--booked' : ''}`}
                        disabled={isBooked}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            startTime: slot.start,
                            endTime: slot.end,
                          }));
                        }}
                      >
                        {slot.start.split('T')[1]} - {slot.end.split('T')[1]}
                      </button>
                    );
                  })}
                </div>
                <div className="availability-legend">
                  <span className="legend-item legend-item--available">Available</span>
                  <span className="legend-item legend-item--booked">Booked</span>
                </div>
              </div>
              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any special requirements or notes..."
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={overlapSelected}>
                Submit Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
