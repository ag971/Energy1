# SolarBitTrade

# Table of Content






# Overview
The EnergyTrading is a smart contract designed to handle the trading of energy between a buyer and a seller. It provides a way for the seller to deposit energy into the contract and for the buyer to buy the deposited energy. The trading mechanism ensures that the buyer pays the correct amount for the energy they wish to purchase. The contract leverages the power of the scrypt-ts library, which is a TypeScript binding for the sCrypt language, providing efficient ways to handle Bitcoin SV smart contract operations.

# Contract Features
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

# Quick Start

## 1. Clone the repository: 
`git clone https://github.com/yourusername/project-name.git` 

## 2.Redirect to the correct directory:
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


## Build

```sh
npm run build
```

## Testing Locally

```sh
npm run test
```

## Run Bitcoin Testnet Tests

```sh
npm run testnet
```
