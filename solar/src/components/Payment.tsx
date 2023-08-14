import React, { useState } from 'react';
import axios from 'axios';

const PaymentPage: React.FC = () => {
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('');

  const handlePayment = async () => {
    setStatus('Processing...');

    try {
      const response = await axios.post('/api/payment', {
        amount,
        // Add any other required fields here
      });

      if (response.data.success) {
        setStatus('Payment Successful');
      } else {
        setStatus('Payment Failed');
      }
    } catch (error) {
      setStatus('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Energy Trading Payment</h1>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
      </label>
      <button onClick={handlePayment}>Pay Now</button>
      <p>{status}</p>
    </div>
  );
};

export default PaymentPage;
