// WelcomePage.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';
import logo from './logo.png'; 

const WelcomePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  return (
    
    <div className={styles['welcome-container']}>
        
        <img
            src={logo}
            alt="SolarBitTrade Logo"
            style={{ width: '50%', height: 'auto' }} // Set the size to half
          />

          
      <h2 className={styles['welcome-message']}>Welcome, {username}!</h2>
      <div className={styles['link-container']}>
        <Link to="/">
          Start Trading!
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;