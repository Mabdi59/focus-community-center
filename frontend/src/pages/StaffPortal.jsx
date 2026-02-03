import React, { useState, useEffect, useMemo } from 'react';
import { bookingService, facilityService } from '../services/services';
import { useAuth } from '../context/AuthContext';
import './StaffPortal.css';

const StaffPortal = () => {
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blockError, setBlockError] = useState('');
  const [blockLoading, setBlockLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'ALL',
    facilityId: 'ALL',
    search: '',
    startDate: '',
    endDate: '',
  });
  const [blockForm, setBlockForm] = useState({
    facilityId: '',
    startTime: '',
    endTime: '',
    reason: '',
  });
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    loadPortalData();
  }, []);

  const loadPortalData = async () => {
    try {
      const [bookingData, facilityData] = await Promise.all([
        bookingService.getAllBookings(),
        facilityService.getAllFacilities(),
      ]);
      setBookings(bookingData);
      setFacilities(facilityData);
    } catch (err) {
      setError('Failed to load staff dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      loadPortalData();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await handleUpdateStatus(id, 'CANCELLED');
  };

  const handleToggleAvailability = async (facility) => {
    if (!isAdmin()) {
      return;
    }
    setAvailabilityLoading(true);
    try {
      const payload = {
        name: facility.name,
        description: facility.description,
        capacity: facility.capacity,
        hourlyRate: facility.hourlyRate,
        type: facility.type,
        isAvailable: !facility.isAvailable,
        imageUrl: facility.imageUrl || '',
        address: facility.address || '',
      };
      await facilityService.updateFacility(facility.id, payload);
      loadPortalData();
    } catch (err) {
      alert('Failed to update facility availability');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'ALL',
      facilityId: 'ALL',
      search: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleBlockChange = (e) => {
    const { name, value } = e.target;
    setBlockForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlockSlot = async (e) => {
    e.preventDefault();
    setBlockError('');
    if (!blockForm.facilityId) {
      setBlockError('Select a facility to block.');
      return;
    }
    if (new Date(blockForm.endTime) <= new Date(blockForm.startTime)) {
      setBlockError('End time must be after start time.');
      return;
    }
    setBlockLoading(true);
    try {
      const notes = blockForm.reason
        ? `Blocked slot: ${blockForm.reason}`
        : 'Blocked slot';
      const booking = await bookingService.createBooking({
        facilityId: parseInt(blockForm.facilityId, 10),
        startTime: blockForm.startTime,
        endTime: blockForm.endTime,
        notes,
      });
      await bookingService.updateBookingStatus(booking.id, 'CONFIRMED');
      setBlockForm({
        facilityId: '',
        startTime: '',
        endTime: '',
        reason: '',
      });
      loadPortalData();
    } catch (err) {
      setBlockError(err.response?.data?.message || 'Failed to block time slot');
    } finally {
      setBlockLoading(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = filters.status === 'ALL' || booking.status === filters.status;
      const matchesFacility =
        filters.facilityId === 'ALL' ||
        booking.facility?.id === parseInt(filters.facilityId, 10);
      const searchValue = filters.search.trim().toLowerCase();
      const matchesSearch =
        !searchValue ||
        String(booking.id).includes(searchValue) ||
        booking.user?.username?.toLowerCase().includes(searchValue) ||
        booking.facility?.name?.toLowerCase().includes(searchValue);
      const startDate = filters.startDate ? new Date(`${filters.startDate}T00:00:00`) : null;
      const endDate = filters.endDate ? new Date(`${filters.endDate}T23:59:59`) : null;
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      const matchesStart = !startDate || bookingStart >= startDate;
      const matchesEnd = !endDate || bookingEnd <= endDate;
      return matchesStatus && matchesFacility && matchesSearch && matchesStart && matchesEnd;
    });
  }, [bookings, filters]);

  const bookingStats = useMemo(() => {
    const stats = {
      total: bookings.length,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    };
    bookings.forEach((booking) => {
      const key = booking.status?.toLowerCase();
      if (key && stats[key] !== undefined) {
        stats[key] += 1;
      }
    });
    return stats;
  }, [bookings]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="staff-portal">
      <div className="container">
        <h1>Staff &amp; Admin Dashboard</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <p className="staff-portal__subtitle">
          Signed in as {user?.username} ({isAdmin() ? 'Admin' : 'Staff'}).
        </p>

        <div className="staff-summary card">
          <div>
            <span className="summary-label">Total bookings</span>
            <strong>{bookingStats.total}</strong>
          </div>
          <div>
            <span className="summary-label">Pending</span>
            <strong>{bookingStats.pending}</strong>
          </div>
          <div>
            <span className="summary-label">Confirmed</span>
            <strong>{bookingStats.confirmed}</strong>
          </div>
          <div>
            <span className="summary-label">Completed</span>
            <strong>{bookingStats.completed}</strong>
          </div>
          <div>
            <span className="summary-label">Cancelled</span>
            <strong>{bookingStats.cancelled}</strong>
          </div>
        </div>

        <div className="block-slot card">
          <div className="block-slot__header">
            <h2>Block Time Slot</h2>
            <p>
              Use this to reserve time for maintenance or internal events. Blocked slots are
              marked as confirmed bookings.
            </p>
          </div>
          {blockError && <div className="alert alert-error">{blockError}</div>}
          <form onSubmit={handleBlockSlot} className="block-slot__form">
            <div className="form-group">
              <label>Facility</label>
              <select
                name="facilityId"
                value={blockForm.facilityId}
                onChange={handleBlockChange}
                required
              >
                <option value="">Select a facility</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={blockForm.startTime}
                onChange={handleBlockChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={blockForm.endTime}
                onChange={handleBlockChange}
                required
              />
            </div>
            <div className="form-group block-slot__notes">
              <label>Reason (optional)</label>
              <textarea
                name="reason"
                value={blockForm.reason}
                onChange={handleBlockChange}
                rows="2"
                placeholder="Maintenance, private event, etc."
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={blockLoading}>
              {blockLoading ? 'Blocking...' : 'Block Slot'}
            </button>
          </form>
        </div>

        <div className="facilities-section card">
          <div className="facilities-section__header">
            <h2>Facility Overview</h2>
            <p>Track availability and manage facilities from the admin panel.</p>
          </div>
          <div className="facilities-table">
            <table>
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Rate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((facility) => (
                  <tr key={facility.id}>
                    <td>{facility.name}</td>
                    <td>{facility.type}</td>
                    <td>{facility.capacity}</td>
                    <td>${facility.hourlyRate}/hr</td>
                    <td>
                      <span className={`status ${facility.isAvailable ? 'status-available' : 'status-unavailable'}`}>
                        {facility.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      {isAdmin() ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleToggleAvailability(facility)}
                          disabled={availabilityLoading}
                        >
                          {facility.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                        </button>
                      ) : (
                        <span className="text-muted">Admin only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bookings-section card">
          <div className="bookings-section__header">
            <h2>All Bookings</h2>
            <button type="button" className="btn btn-sm btn-secondary" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
          <div className="booking-filters">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="ALL">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="form-group">
              <label>Facility</label>
              <select name="facilityId" value={filters.facilityId} onChange={handleFilterChange}>
                <option value="ALL">All facilities</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Start date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group">
              <label>End date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group booking-filters__search">
              <label>Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Booking ID, user, or facility"
              />
            </div>
          </div>
          {filteredBookings.length === 0 ? (
            <p>No bookings match the selected filters.</p>
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
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const isBlocked = booking.notes?.toLowerCase().startsWith('blocked');
                    return (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.user?.username || 'Unknown'}</td>
                        <td>{booking.facility?.name || 'Unknown'}</td>
                        <td>{formatDateTime(booking.startTime)}</td>
                        <td>{formatDateTime(booking.endTime)}</td>
                        <td>
                          <span className={`status status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                          {isBlocked && <span className="status status-blocked">Blocked</span>}
                        </td>
                        <td>${booking.totalPrice}</td>
                        <td>{booking.notes || '-'}</td>
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
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="btn btn-sm btn-danger"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                                  className="btn btn-sm btn-primary"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="btn btn-sm btn-danger"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
