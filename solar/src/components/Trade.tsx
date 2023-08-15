import React, { useState } from 'react';
import { EnergyTradingEscrow } from '../contracts/energy';
import { toByteString, hash160, bsv, ScryptProvider, SensiletSigner, PubKey, Sig, findSig, MethodCallOptions, Signer} from 'scrypt-ts';

function Trade() {
    const [contract, setContract] = useState<EnergyTradingEscrow | null>(null);
    const [energyAmount, setEnergyAmount] = useState<bigint>(0n);
    const [energyPrice, setEnergyPrice] = useState<bigint>(0n);
    const [availableEnergies, setAvailableEnergies] = useState<{ amount: bigint, price: bigint }[]>([]);
    const [sellerPubKey, setSellerPubKey] = useState<bsv.PublicKey | null>(null);
    const [buyerPubKey, setBuyerPubKey] = useState<bsv.PublicKey| null>(null);

    const handleAddAndDeploy = async () => {
        const provider = new ScryptProvider();
        const signer = new SensiletSigner(provider);

        const seller = await signer.getDefaultPubKey();
        setSellerPubKey(seller);

        const buyer = await signer.getDefaultPubKey();  // Simulating buyer public key here

        const instance = new EnergyTradingEscrow(hash160(seller.toHex()), hash160(buyer.toHex()), energyPrice);
        await instance.connect(signer);

        const deployTx = await instance.deploy();
        console.log(`EnergyTradingEscrow contract deployed: ${deployTx.id}`);

        setContract(instance);
        setAvailableEnergies([...availableEnergies, { amount: energyAmount, price: energyPrice }]);
        setEnergyAmount(0n);
        setEnergyPrice(0n);
    };

    const handleBuyEnergy = async (energy) => {
        try {
            if (!contract) {
                console.error('Contract instance is not available.');
                return;
            }
    
            if (!buyerPubKey) {
                console.error('Buyer pub key is not yet available.');
                return;
            }
    
            const provider = new ScryptProvider();
            const signer = new SensiletSigner(provider);
            const buyerSig = await signTx(buyerPubKey);
    
            const next = contract.next();
            next.energy -= energy.amount;
    
            const result = await contract.methods.buyEnergy(
                PubKey(buyerPubKey.toHex()),
                buyerSig,
                {
                    pubKeyOrAddrToSign: buyerPubKey,
                    next: {
                        instance: next,
                        balance: contract.balance
                    }
                } as MethodCallOptions<EnergyTradingEscrow>
            );
    
            console.log('Buy energy call txid:', result.tx.id);
    
            const newAvailableEnergies = availableEnergies.filter(e => e.amount !== energy.amount && e.price !== energy.price);
            setAvailableEnergies(newAvailableEnergies);
    
        } catch (error) {
            console.error('Error buying energy:', error);
        }
    };
    
    

    return (
        <div>
            <div>
                <h3>Add Energy</h3>
                <div>
                    <input type="number" placeholder="Energy Amount" value={energyAmount.toString()} onChange={(e) => setEnergyAmount(BigInt(e.target.value))} />
                    Energy Amount in kW
                </div>
                <div>
                    <input type="number" placeholder="Energy Price" value={energyPrice.toString()} onChange={(e) => setEnergyPrice(BigInt(e.target.value))} />
                    Energy Price in BSV
                </div>
                <button onClick={handleAddAndDeploy}>Sell Energy</button>
            </div>
            <div>
                <h3>Available List of Energy</h3>
                {availableEnergies.map((energy, index) => (
                    <div key={index} style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
                        <strong>{index + 1}.</strong>
                        <p>Energy: {energy.amount.toString()} kW</p>
                        <p>Price: BSV{energy.price.toString()}</p>
                        <button onClick={() => handleBuyEnergy(energy)}>Buy Energy</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Trade;