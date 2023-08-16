import { useState } from 'react';
import { toByteString, hash160, bsv, TestWallet, DefaultProvider, ScryptProvider, SensiletSigner, findSig, MethodCallOptions, PubKey, StatefulNext } from 'scrypt-ts';
import { EnergyTradingEscrow } from '../contracts/energy';

function Trade() {

    const [contract, setContract] = useState<EnergyTradingEscrow | null>(null);
    const [buyerPubKey, setBuyerPubKey] = useState<bsv.PublicKey| null>(null);
    const [energyAmount, setEnergyAmount] = useState<bigint>(0n);
    const [sellerPubKey, setSellerPubKey] = useState<bsv.PublicKey| null>(null);
    const [availableEnergyList, setAvailableEnergyList] = useState<Array<{price: bigint, energy: bigint}>>([]);
    const [unitPrice, setUnitPrice] = useState<bigint>(0n);


    const deployContract = async () => {
        const provider = new ScryptProvider();
        const signer = new SensiletSigner(provider);
        
        const seller = await signer.getDefaultPubKey()
        const buyer = await signer.getDefaultPubKey()

        setSellerPubKey(seller)
        setBuyerPubKey(buyer)

        const instance = new EnergyTradingEscrow(hash160(seller.toHex()), hash160(buyer.toHex()), 1n);
        await instance.connect(signer);

        const deployTx = await instance.deploy();
        console.log(`EnergyTradingEscrow contract deployed: ${deployTx.id}`);

        setContract(instance);
    };
    const depositEnergy = async () => {
        try {
            if (!contract || !sellerPubKey) {
                console.error('Contract instance or seller public key is not available.');

                setAvailableEnergyList(prevList => [...prevList, { price: unitPrice, energy: energyAmount }]);
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
        } catch (error) {
            console.error('Error depositing energy:', error);
        }
    };

    const buyEnergy = async () => {
        try {
            if (!contract || !buyerPubKey) {
                console.error('Contract instance or buyer public key is not available.');
                return;
            }

            const next = contract.next();
            next.energy -= energyAmount;

            const result = await contract.methods.buyEnergy(
                PubKey(buyerPubKey.toHex()),
                (sigResps) => findSig(sigResps, buyerPubKey),
                {
                    pubKeyOrAddrToSign: buyerPubKey,
                    next: {
                        instance: next,
                        balance: contract.balance
                    }
                } as MethodCallOptions<EnergyTradingEscrow>
            );

            console.log('Buy energy result:', result.tx.id);
        } catch (error) {
            console.error('Error buying energy:', error);
        }
    };

    

    return (
        <div>
            <button onClick={deployContract}>Deploy Contract</button>
            <div>
                <input 
                    type="number" 
                    placeholder="Energy Amount" 
                    value={energyAmount.toString()} 
                    onChange={(e) => setEnergyAmount(BigInt(e.target.value))} 
                />
                <button onClick={depositEnergy}>Deposit Energy</button>
            </div>
            <div>
                <button onClick={buyEnergy}>Buy Energy</button>
            </div>
            {/* Add other UI elements for other contract interactions if needed */}
        </div>
    )
}

export default Trade;
