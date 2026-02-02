import React, { useState, useEffect } from 'react';
import { facilityService } from '../services/services';
import './AdminPanel.css';

const AdminPanel = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: '',
    hourlyRate: '',
    type: '',
    isAvailable: true,
    imageUrl: '',
  });

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const data = await facilityService.getAllFacilities();
      setFacilities(data);
    } catch (err) {
      setError('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await facilityService.updateFacility(editingId, {
          ...formData,
          capacity: parseInt(formData.capacity),
          hourlyRate: parseFloat(formData.hourlyRate),
        });
      } else {
        await facilityService.createFacility({
          ...formData,
          capacity: parseInt(formData.capacity),
          hourlyRate: parseFloat(formData.hourlyRate),
        });
      }
      resetForm();
      loadFacilities();
    } catch (err) {
      alert('Failed to save facility');
    }
  };

  const handleEdit = (facility) => {
    setFormData({
      name: facility.name,
      description: facility.description,
      capacity: facility.capacity,
      hourlyRate: facility.hourlyRate,
      type: facility.type,
      isAvailable: facility.isAvailable,
      imageUrl: facility.imageUrl || '',
    });
    setEditingId(facility.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this facility?')) return;
    try {
      await facilityService.deleteFacility(id);
      loadFacilities();
    } catch (err) {
      alert('Failed to delete facility');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      capacity: '',
      hourlyRate: '',
      type: '',
      isAvailable: true,
      imageUrl: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>Admin Panel</h1>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="admin-actions">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : 'Add New Facility'}
          </button>
        </div>

        {showForm && (
          <div className="facility-form card">
            <h2>{editingId ? 'Edit Facility' : 'Add New Facility'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hourly Rate ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />
                  {' '}Available
                </label>
              </div>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        )}

        <div className="facilities-section">
          <h2>Manage Facilities</h2>
          <div className="facilities-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
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
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(facility)}
                          className="btn btn-sm btn-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(facility.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
