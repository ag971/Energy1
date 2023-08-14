
import { useState } from 'react';
import { toByteString, hash160, bsv, TestWallet, DefaultProvider, ScryptProvider, SensiletSigner, findSig, MethodCallOptions, PubKey, StatefulNext } from 'scrypt-ts';
import { EnergyTradingEscrow } from '../contracts/energy';


function Trade() {

    // TODO: Make these collections, since you can deploy multiple escrows within the app?
    const [contract, setContract] = useState<EnergyTradingEscrow | null>(null);
    const [buyerPubKey, setBuyerPubKey] = useState<bsv.PublicKey| null>(null);
    const [energyAmount, setEnergyAmount] = useState<bigint>(0n);
    const [sellerPubKey, setSellerPubKey] = useState<bsv.PublicKey| null>(null);
    
    const deployContract = async () => {
        const provider = new ScryptProvider();
        const signer = new SensiletSigner(provider);
        
        // Just use same sensilet key for now while testing.
        const seller = await signer.getDefaultPubKey()
        const buyer = await signer.getDefaultPubKey()
        
        setSellerPubKey(seller)
        setBuyerPubKey(buyer)

        const sellerPubKeyHash = hash160(seller.toHex());
        const buyerPubKeyHash = hash160(buyer.toHex());
        const unitPrice = 1n;

        const instance = new EnergyTradingEscrow(sellerPubKeyHash, buyerPubKeyHash, unitPrice);
        await instance.connect(signer);

        const deployTx = await instance.deploy();
        console.log(`EnergyTradingEscrow contract deployed: ${deployTx.id}`);

        setContract(instance);
    };

    const buyEnergy = async () => {
        try {
            //// Check if the contract instance exists
            //if (!contract) {
            //    console.error('Contract instance is not available.');
            //    return;
            //}

            //// Ensure buyerPubKey and buyerSig are not empty
            //if (!buyerPubKey || !buyerSig) {
            //    console.error('Buyer public key and signature are required.');
            //    return;
            //}

            //// Perform the buyEnergy method call
            //const result = await contract.methods.buyEnergy(
            //  toByteString(buyerPubKey || '', true),
            //  toByteString(buyerSig || '', true),
            //  { //what can be additional options? }
            //);

            //console.log('Buy energy result:', result);
        } catch (error) {
            console.error('Error buying energy:', error);
        }
    };

    const depositEnergy = async () => {
        try {
            // Check if the contract instance exists
            if (!contract) {
                console.error('Contract instance is not available.');
                return;
            }
            
            if (!sellerPubKey) {
                console.error('Seller pub key is not yet available.');
                return;
            }
            
            console.log(energyAmount)
            
            // Construct next instance of the smart contract.
            const next = contract.next()
            next.energy += energyAmount
            
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
            ) 

            console.log('Deposit energy call txid:', result.tx.id);
        } catch (error) {
            console.error('Error depositing energy:', error);
        }
    };
    // Similar functions for other interactions with the contract (refund, etc.)

    // TODO: Display data of deployed escrow(s)?
    return (
        <div>
            <button onClick={deployContract}>Deploy Contract</button>
            <div>
                <button onClick={buyEnergy}>Buy Energy</button>
            </div>
            <div>
                <input type="number" placeholder="Energy Amount" value={energyAmount.toString()} onChange={(e) => setEnergyAmount(BigInt(e.target.value))} />
                <button onClick={depositEnergy}>Deposit Energy</button>
            </div>
            {/* Other UI elements for refund and other interactions */}
        </div>
    )
}




export default Trade;