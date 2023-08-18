# SolarBitTrade

## Table of Contents

1. [Overview](#overview)
2. [Contract Features](#contract-features)
3. [Frontend Interaction](#frontend-interaction)
4. [Quick Start](#quick-start)
   - [Clone the Repository](#1-clone-the-repository)
   - [Redirect to the Correct Directory](#2-redirect-to-the-correct-directory)
   - [Install Dependencies](#3-install-dependencies)
   - [Compile Contract](#4-compile-contract)
   - [Load Artifact](#5-load-artifact)
   - [Deploy Contract](#6-deploy-contract)
   - [Run the Frontend App](#7-run-the-frontend-app)


## Overview

The EnergyTrading is a smart contract designed to handle the trading of energy between a buyer and a seller. It provides a way for the seller to deposit energy into the contract and for the buyer to buy the deposited energy. The trading mechanism ensures that the buyer pays the correct amount for the energy they wish to purchase. The contract leverages the power of the scrypt-ts library, which is a TypeScript binding for the sCrypt language, providing efficient ways to handle Bitcoin SV smart contract operations.

## Contract Features

1.Seller and Buyer Identification:
The contract tracks the Bitcoin SV public key hashes of both the seller and buyer to ensure that only authorized parties can interact with it.

2.Energy Management:
The contract maintains the amount of energy deposited by the seller. The buyer can purchase this energy at a fixed unit price.

3.Security Measures:
Transactions are secured by checking signatures against public key hashes and ensuring the correct calculation of outputs.

4.Energy Buying Transaction Builder:
The contract provides a static transaction builder function (buyTxBuilder) which builds the transaction for buying energy.


# Frontend Interaction
The frontend component, named Trade, allows users to:

->Deploy the contract and start trading.

->Deposit energy.

->Buy energy.

The frontend leverages the scrypt-ts library for interaction with the contract. Specifically, it utilizes the SensiletSigner to handle signature-related operations, enabling seamless integration with wallets that support this signer.

## Quick Start

## 1. Clone the repository: 
`git clone https://github.com/yourusername/project-name.git` 

## 2. Redirect to the correct directory:
Before running the project, redirect to the right directory of the project by running
 ```sh  
cd solar
```

## 3. Install Dependencies:

To ensure you have installed all necessary packages you should run:

```sh
 npm install
```
## 4. Compile Contract
Run following command to compile the `EnergyTrading` contract:

```sh
npx scrypt-cli compile
```
this command will generate a contract artifact file at `artifacts\energy.json`

Or call the `compile()` function in the code:

```sh
await EnergyTradingEscrow.compile()
```
## 5. Load Artifact

```sh
import { EnergyTradingEscrow } from './contracts/energy';
import  artifacts from '../artifacts/energy.json'
EnergyTradingEscrow.loadArtifact(artifacts)
```

## 6. Deploy Contract
After compiling, deploy the contract by running: 

```sh
npx scrypt-cli deploy
```

## 7. Run the Frontend App

Runs the app in the development mode. Open http://localhost:3000 to view it in the browser. Use this command:

```sh
npm start
```
## Note
Ensure you have set up a proper wallet backend and connected to a Bitcoin SV node when deploying and interacting with the contract on the mainnet or testnet.

## Future Enhancements
Implement a feature to allow changing the unit price.

Incorporate a refund mechanism for the buyer and seller.

Improve UI/UX for better user experience and clarity.

## Contribute
Feel free to contribute to this project by opening issues or submitting pull requests. All contributions are welcomed!
