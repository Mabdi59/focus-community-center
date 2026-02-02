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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadFacility();
  }, [id]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              <button type="submit" className="btn btn-primary">
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
