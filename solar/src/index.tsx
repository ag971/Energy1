import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Scrypt, bsv } from 'scrypt-ts';

import { EnergyTradingEscrow } from './contracts/energy';
import  artifacts from '../artifacts/energy.json'

EnergyTradingEscrow.loadArtifact(artifacts)

Scrypt.init({
  apiKey: 'testnet_OZK77ndQFxr1rvogVZzCccNr9LpDPUGcjzejp3HE27SFJTcY',
  network: bsv.Networks.testnet
})
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


reportWebVitals();