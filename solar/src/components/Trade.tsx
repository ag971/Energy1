import React, { useState } from 'react';
import { EnergyTradingEscrow } from '../contracts/energy'; // Assuming you import your contract here
import { hash160, ScryptProvider, SensiletSigner, PubKey } from 'scrypt-ts';
import bsv from 'bsv';
import './Trade.css';

function Trade() {
    const [contract, setContract] = useState<EnergyTradingEscrow | null>(null);
    const [energyAmount, setEnergyAmount] = useState<bigint>(0n);
    const [energyPrice, setEnergyPrice] = useState<bigint>(0n);
    const [availableEnergies, setAvailableEnergies] = useState<{ amount: bigint, price: bigint }[]>([]);
    const [sellerPubKey, setSellerPubKey] = useState<bsv.PublicKey | null>(null);
    const [energyAmountError, setEnergyAmountError] = useState<string | null>(null);
    const [energyPriceError, setEnergyPriceError] = useState<string | null>(null);
    const [energyUnit, setEnergyUnit] = useState("kW");
    const [showAddConfirmation, setShowAddConfirmation] = useState(false);
    const [showBuySuccess, setShowBuySuccess] = useState(false);
    const [selectedEnergy, setSelectedEnergy] = useState<{ amount: bigint, price: bigint } | null>(null);
    const [currentEnergyPrice, setCurrentEnergyPrice] = useState<number>(0);
    const [usageHours, setUsageHours] = useState<number>(0);
    const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

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

    const handleBuyEnergy = async (energy: { amount: bigint, price: bigint }) => {
        try {
            const provider = new ScryptProvider();
            const signer = new SensiletSigner(provider);

            const buyerPubKey = await signer.getDefaultPubKey();
            const buyerSig = await signer.signMessage(buyerPubKey.toHex());

            // Simulate a successful energy purchase
            const updatedEnergies = availableEnergies.filter(e => e !== energy);
            setAvailableEnergies(updatedEnergies);

                        // Store selected energy values
                        setSelectedEnergy(energy);

            // Set showBuySuccess to true only after successful energy purchase
            setShowBuySuccess(true);
        } catch (error) {
            console.error("Error simulating Sensilet signing:", error);
        }
    };

    const handleCalculateCost = () => {
        // Assuming energy price is in pence per kW-hour
        const energyPricePence = currentEnergyPrice * 100;
        const costPence = (usageHours * energyPricePence) / 100;
        setEstimatedCost(costPence);
    };
    
    return (
        <div>
            <div>
                <h3>Add Energy</h3>
                <div>
                    <input
                        type="number"
                        placeholder="Energy Amount"
                        value={energyAmount.toString()}
                        onChange={(e) => {
                            setEnergyAmount(BigInt(e.target.value));
                            setEnergyAmountError(null);
                        }}
                    />
                    {energyAmountError && <div className="error">{energyAmountError}</div>}
                    <select value={energyUnit} onChange={(e) => setEnergyUnit(e.target.value)}>
                        <option value="kW">kW</option>
                        <option value="MW">MW</option>
                        <option value="GW">GW</option>
                    </select>
                </div>
                <div>
            {/* ... Other JSX ... */}
            <div>
                <h3>Energy Consumption Calculator</h3>
                <div>
                    <label>Current Energy Price (£/kWh): </label>
                    <input
                        type="number"
                        value={currentEnergyPrice}
                        onChange={(e) => setCurrentEnergyPrice(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>Hours of Usage: </label>
                    <input
                        type="number"
                        value={usageHours}
                        onChange={(e) => setUsageHours(Number(e.target.value))}
                    />
                </div>
                <div>
                    <button onClick={handleCalculateCost}>Calculate Cost</button>
                </div>
                {estimatedCost !== null && (
                    <p>Estimated Cost: £{estimatedCost / 100}</p>
                )}
            </div>
        </div>
                <div>
                    <input
                        type="number"
                        placeholder="Energy Price"
                        value={energyPrice.toString()}
                        onChange={(e) => {
                            setEnergyPrice(BigInt(e.target.value));
                            setEnergyPriceError(null);
                        }}
                    />
                    {energyPriceError && <div className="error">{energyPriceError}</div>}
                    £
                    <button onClick={() => setShowAddConfirmation(true)}>Add Energy</button>
                </div>
            </div>
            <div>
                <h3>Available List of Energy</h3>
                {availableEnergies.map((energy, index) => (
                    <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        <div>
                            Energy: {energy.amount.toString()} kW - Price: £{energy.price.toString()}
                        </div>
                        <div>
                            <button onClick={() => handleBuyEnergy(energy)}>Buy Energy</button>
                        </div>
                    </div>
                ))}
            </div>

            {showAddConfirmation && (
                <div className="modal">
                    <p>Are you sure you want to add into the marketplace?</p>
                    <button onClick={() => {
                        handleAddAndDeploy();
                        setShowAddConfirmation(false);
                    }}>Yes</button>
                    <button onClick={() => setShowAddConfirmation(false)}>Cancel</button>
                </div>
            )}

                {showBuySuccess && (
                <div className="modal">
                    <p>Congratulations! You have successfully bought {selectedEnergy?.amount.toString()} kW of energy at £{selectedEnergy?.price.toString()}.</p>
                    <button onClick={() => {
                        setSelectedEnergy(null); // Clear selected energy values
                        setShowBuySuccess(false);
                    }}>OK</button>
                </div>
            )}
        </div>

        
    );
}
export default Trade;
