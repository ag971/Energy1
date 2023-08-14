import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home';
import AboutPage from './components/About';
import SolutionPage from './components/Solution';
import ContactPage from './components/Contact';
import SigninPage from './components/signin';
import WelcomePage from './components/WelcomePage';
import { EnergyTradingEscrow } from './contracts/energy';
import SellerPage from './components/SellerPage';
import Trade from './components/Trade';


function App() {

  const handleLogin = (username: string, password: string): void => {
  };

  const handleSignUp = (username: string, password: string): void => {
    // Handle sign-up logic, is this correct?
  };

  const handlePublish = (energyAmount: number, price: number): void => {
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/solution" element={<SolutionPage />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/signin"
            element={<SigninPage onLogin={handleLogin} onSignUp={handleSignUp} />}
          />
          {/* Corrected Route for WelcomePage */}
          <Route path="/welcome/:username" element={<WelcomePage />} />
          <Route path="/sellerpage" element={<SellerPage onPublish={handlePublish} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;