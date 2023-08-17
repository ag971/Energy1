import React, { useState, useEffect, useRef } from 'react';
import { toByteString, hash160, bsv, ScryptProvider, SensiletSigner, findSig, MethodCallOptions, PubKey,Sig,ContractTransaction,Utils } from 'scrypt-ts';
import { EnergyTradingEscrow } from '../contracts/energy';

function Trade() {
    const [contract, setContract] = useState<EnergyTradingEscrow | null>(null);
    const [buyerPubKey, setBuyerPubKey] = useState<bsv.PublicKey | null>(null);
    const [energyAmount, setEnergyAmount] = useState<bigint>(0n);
    const [sellerPubKey, setSellerPubKey] = useState<bsv.PublicKey | null>(null);
    
    // Create a reference for SensiletSigner
    const signerRef = useRef<SensiletSigner | null>(null);

    // Initialize SensiletSigner on component mount
    useEffect(() => {
        const provider = new ScryptProvider();
        const signer = new SensiletSigner(provider);
        
        // Assign the SensiletSigner instance to the ref
        signerRef.current = signer;
    }, []);

    const deployContract = async () => {
        if (!signerRef.current) return;

        const seller = await signerRef.current.getDefaultPubKey();
        const buyer = await signerRef.current.getDefaultPubKey();
        
        setSellerPubKey(seller);
        setBuyerPubKey(buyer);

        const sellerPubKeyHash = hash160(seller.toHex());
        const buyerPubKeyHash = hash160(buyer.toHex());
        const unitPrice = 1n;

        const instance = new EnergyTradingEscrow(sellerPubKeyHash, buyerPubKeyHash, unitPrice);
        await instance.connect(signerRef.current);

        const deployTx = await instance.deploy();
        console.log(`EnergyTradingEscrow contract deployed: ${deployTx.id}`);

        setContract(instance);
    };

    const depositEnergy = async () => {
        if (!contract || !sellerPubKey || !signerRef.current) {
            console.error('Contract instance or seller public key is not available.');
            return;
        }

        const next = contract.next();
        next.energy += energyAmount;

        const result = await contract.methods.depositEnergy(
            (sigResps) => findSig(sigResps, sellerPubKey),
            PubKey(sellerPubKey.toHex()),
            energyAmount,
            {
                pubKeyOrAddrToSign: sellerPubKey,
                next: {
                    instance: next,
                    balance: contract.balance
                }
            } as MethodCallOptions<EnergyTradingEscrow>
        ); 

        console.log('Deposit energy call txid:', result.tx.id);
    };

    const buyEnergy = async () => {
        if (!contract || !buyerPubKey || !signerRef.current) {
            console.error('Contract instance or buyer public key is not available.');
            return;
        }

        contract.bindTxBuilder('buyEnergy', EnergyTradingEscrow.buyTxBuilder);

        const next = contract.next();
        next.energy -= energyAmount;

        const result = await contract.methods.buyEnergy(
            PubKey(buyerPubKey.toHex()),
            (sigResps) => findSig(sigResps, buyerPubKey),
            {
                changeAddress: await signerRef.current.getDefaultAddress(),
                pubKeyOrAddrToSign: buyerPubKey,
                next: {
                    instance: next,
                    balance: contract.balance
                }
            } as MethodCallOptions<EnergyTradingEscrow>
        );

        console.log('Buy energy result:', result.tx.id);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Energy Trading</h2>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={deployContract}>Start</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <span>Enter Energy Amount: </span>
                    <input 
                        type="number" 
                        placeholder="Energy Amount" 
                        value={energyAmount.toString()} 
                        onChange={(e) => setEnergyAmount(BigInt(e.target.value))} 
                    />
                </label>
                <button style={{ marginLeft: '10px' }} onClick={depositEnergy}>Deposit Energy</button>
            </div>
            <div>
                <button onClick={buyEnergy}>Buy Energy</button>
            </div>
        </div>
    );
}

export default Trade;
