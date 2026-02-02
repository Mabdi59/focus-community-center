import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Welcome to Focus Community Center</h1>
          <p>Book facilities and rooms for your events, meetings, and activities</p>
          <div className="hero-buttons">
            <Link to="/facilities" className="btn btn-primary">
              Browse Facilities
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Our Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🏢 Meeting Rooms</h3>
              <p>Professional meeting spaces for your business needs</p>
            </div>
            <div className="feature-card">
              <h3>🎉 Event Halls</h3>
              <p>Spacious halls perfect for celebrations and gatherings</p>
            </div>
            <div className="feature-card">
              <h3>🏃 Sports Facilities</h3>
              <p>Modern sports and fitness facilities for active living</p>
            </div>
            <div className="feature-card">
              <h3>📅 Easy Booking</h3>
              <p>Simple online booking system with instant confirmation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
