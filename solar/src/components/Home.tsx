import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css'; 
import economicalImage from './economical.jpg';
import efficientImage from './efficient.jpg';
import sustainableImage from './sustainable.jpg';

function HomePage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.companyName}>
          <h1>SolarBitTrade</h1>
        </div>
        <nav>
          <ul className={styles.nav}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/solution">Solution</Link></li>
            <li><Link to="/trade">Trade</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <div className={styles["sign-in"]}>
          <Link to="/signin">Sign In</Link>
        </div>
      </header>
      <main>
        <section id={styles.hero}>
          <h1>Join us into a greener future</h1>
          <p>Rrevolutionizing the way you trade solar energy, and providing an efficient, economical, and sustainable solution.</p>
          <Link to="/about"><button>Learn More</button></Link>
        </section>
        <section id={styles.features}>
          <div className={styles["feature-item"]}>
            <img src={economicalImage} alt="Economical feature"/>
            <h2>Economical</h2>
            <p>Our platform is designed to help you profit from your excess solar energy. With SolarBitTrade, you can sell your surplus power at competitive market rates.</p>
          </div>
          <div className={styles["feature-item"]}>
            <img src={efficientImage} alt="Efficient feature"/>
            <h2>Efficient</h2>
            <p>Through advanced analytics and intelligent energy distribution, we optimize your energy trading to help you achieve maximum returns.</p>
          </div>
          <div className={styles["feature-item"]}>
            <img src={sustainableImage} alt="Sustainable feature"/>
            <h2>Sustainable</h2>
            <p>Trade solar power with us and make a positive impact on the environment. Every kilowatt traded on our platform contributes to reducing carbon emissions and promoting a sustainable energy future.</p>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2023 SolarBitTrade: Championing the future of sustainable energy trading</p>
      </footer>
    </>
  );
}

export default HomePage;