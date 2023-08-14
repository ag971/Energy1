import React, { useState } from 'react';
import './buyer.css'; // Make sure to adjust the path to the actual CSS file

function EnergyRequestPage() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [liveMarketPrice, setLiveMarketPrice] = useState(0);
  const [energyAmount, setEnergyAmount] = useState(0);

  const requestEnergy = () => {
    const pricePerUnit = 0.12; // GBP per unit of energy
    const totalPrice = energyAmount * pricePerUnit;
    setTotalPrice(totalPrice);

    // Simulating a live market price update
    const randomLiveMarketPrice = Math.random() * 0.5 + 0.8; // Random value between 0.8 and 1.3
    setLiveMarketPrice(randomLiveMarketPrice);
  };

  return (
    <div>
      <div className="header">
        <div className="sign-in">
          <a href="#">Sign In</a>
        </div>
      </div>
      <div id="hero">
        <h1>Energy Request</h1>
        <h2 id="energyAmount">Enter energy amount: </h2>
        <input
          type="number"
          id="energyAmount"
          step="0.01"
          placeholder="Enter energy amount"
          required
          value={energyAmount}
          onChange={(e) => setEnergyAmount(parseFloat(e.target.value))}
        />
        <p id="priceDisplay">Price: {totalPrice.toFixed(2)} GBP</p>

        <h2 id="liveMarketPrice">Live Market Price Per KW: {liveMarketPrice.toFixed(2)}</h2>
        <button onClick={requestEnergy}>Request</button>
      </div>
      <div className="features">
        {/* Feature items here */}
      </div>
    </div>
  );
}

export default EnergyRequestPage;
