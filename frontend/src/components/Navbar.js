import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/" className={styles.brand}>Bon Voyage</Link>
      </div>
      <ul className={styles.navLinks}>
        <li className={location.pathname === '/login' ? styles.active : ''}>
          <Link to="/login">Login</Link>
        </li>
        <li className={location.pathname === '/about' ? styles.active : ''}>
          <Link to="/about">About</Link>
        </li>
        <li className={location.pathname === '/help' ? styles.active : ''}>
          <Link to="/help">Help</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
