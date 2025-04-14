import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../components/Navbar.module.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>TrackImmo</div>

      
      <div className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>

      
      <ul className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
        <li><Link to="/" className={styles.link}>Home</Link></li>
        <li><Link to="/listings" className={styles.link}>Listings</Link></li>
        <li><a href="#dashboard" className={styles.link}>Dashboard</a></li>
        <li><a href="#about" className={styles.link}>About</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;


