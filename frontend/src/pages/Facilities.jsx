import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { facilityService } from '../services/services';
import './Facilities.css';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const data = await facilityService.getPublicFacilities();
      setFacilities(data);
    } catch (err) {
      setError('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading facilities...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="facilities-page">
      <div className="container">
        <h1>Our Facilities</h1>
        <div className="facilities-grid">
          {facilities.map((facility) => (
            <div key={facility.id} className="facility-card">
              {facility.imageUrl && (
                <img src={facility.imageUrl} alt={facility.name} />
              )}
              <div className="facility-card-content">
                <h3>{facility.name}</h3>
                <p className="facility-type">{facility.type}</p>
                <p className="facility-description">{facility.description}</p>
                <div className="facility-info">
                  <span>Capacity: {facility.capacity}</span>
                  <span className="facility-rate">${facility.hourlyRate}/hour</span>
                </div>
                <Link to={`/facilities/${facility.id}`} className="btn btn-primary">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Facilities;
