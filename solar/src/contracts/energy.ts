import {
    assert,
    hash160,
    hash256,
    method,
    prop,
    PubKey,
    PubKeyHash,
    Sig,
    SmartContract,
    Utils,
    bsv
} from 'scrypt-ts';

export class EnergyTradingEscrow extends SmartContract {

    @prop()
    seller: PubKeyHash;

    @prop()
    buyer: PubKeyHash;

    @prop(true)
    energy: bigint;

    @prop()
    unitPrice: bigint;

    constructor(
        seller: PubKeyHash,
        buyer: PubKeyHash,
        unitPrice: bigint
    ) {
        super(...arguments);
        this.seller = seller;
        this.buyer = buyer;
        this.energy = 0n;
        this.unitPrice = unitPrice;
    }

    @method()
    public buyEnergy(
        buyerPubKey: PubKey,
        buyerSig: Sig,
    ) {
        assert(hash160(buyerPubKey) == this.buyer);
        assert(this.checkSig(buyerSig, buyerPubKey));

        let outputs = Utils.buildPublicKeyHashOutput(this.seller, this.energy * this.unitPrice);
        if (this.changeAmount > 0n) {
            outputs += this.buildChangeOutput();
        }
        assert(hash256(outputs) == this.ctx.hashOutputs);
    }

    @method()
    public depositEnergy(
        sellerSig: Sig,
        sellerPubKey: PubKey,
        energy: bigint
    ) {
        assert(hash160(sellerPubKey) == this.seller);
        assert(this.checkSig(sellerSig, sellerPubKey));

        this.energy += energy;

        let outputs = this.buildStateOutput(this.ctx.utxo.value);
        if (this.changeAmount > 0n) {
            outputs += this.buildChangeOutput();
        }
        assert(hash256(outputs) == this.ctx.hashOutputs);
    }

    // Added static buyTxBuilder function
    static buyTxBuilder(
        current: EnergyTradingEscrow,
        options: any
    ): Promise<any> {
        const energyCost = current.energy * current.unitPrice;

        const unsignedTx: bsv.Transaction = new bsv.Transaction()
            // Add contract input.
            .addInput(current.buildContractInput())
            // Pay the seller for the energy.
            .addOutput(
                new bsv.Transaction.Output({
                    script: bsv.Script.fromHex(Utils.buildPublicKeyHashOutput(current.seller, energyCost)),
                    satoshis: Number(energyCost),
                })
            );

        
        if (options.changeAddress) {
            unsignedTx.change(options.changeAddress);
        }

        return Promise.resolve({
            tx: unsignedTx,
        });
    }
}
