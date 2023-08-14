import React, { useState } from 'react';
import styles from './SellerPage.module.css'
interface SellerPageProps {
  onPublish: (energyAmount: number, price: number) => void;
}

const SellerPage: React.FC<SellerPageProps> = ({ onPublish }) => {
  const [energyAmount, setEnergyAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const handleEnergyAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnergyAmount(parseFloat(event.target.value));
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(event.target.value));
  };

  const handlePublish = () => {
    if (energyAmount > 0 && price > 0) {
      onPublish(energyAmount, price);
      setEnergyAmount(0);
      setPrice(0);
      alert('Request published successfully!');
    } else {
      alert('Please enter valid energy amount and price.');
    }
  };
   return (
        <div className="feature-item">
          <h2>Sell Excess Energy</h2>
          <div>
            <label>Energy Amount (kWh): </label>
            <input type="number" value={energyAmount} onChange={handleEnergyAmountChange} />
          </div>
          <div>
            <label>Price per kWh: </label>
            <input type="number" value={price} onChange={handlePriceChange} />
          </div>
          <button id="hero button" onClick={handlePublish}>Publish Request</button>
          <div className={styles['feature-item']}>
          </div>
        </div>
      );
}
      
   

export default SellerPage;
