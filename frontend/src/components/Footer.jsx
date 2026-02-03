import React from 'react';
import siteInfo from '../config/siteInfo';
import './Footer.css';

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-content">
      <div>
        <h2>{siteInfo.name}</h2>
        <p>Serving Columbus with flexible community spaces and programs.</p>
      </div>
      <div>
        <h3>Visit Us</h3>
        <p>{siteInfo.address}</p>
      </div>
    </div>
  </footer>
);

export default Footer;
