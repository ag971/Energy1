import { writeFileSync } from 'fs'
import { EnergyTradingEscrow } from '../src/contracts/energy'
import { privateKey } from './privateKey'
import { bsv, TestWallet, DefaultProvider, sha256, hash160 } from 'scrypt-ts'

function getScriptHash(scriptPubKeyHex: string) {
    const res = sha256(scriptPubKeyHex).match(/.{2}/g)
    if (!res) {
        throw new Error('scriptPubKeyHex is not of even length')
    }
    return res.reverse().join('')
}

async function main() {
    await EnergyTradingEscrow.compile()

    // Prepare signer. 
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const signer = new TestWallet(privateKey, new DefaultProvider({
        network: bsv.Networks.testnet
    }))
    
    //const buyer = bsv.PrivateKey.fromRandom(bsv.Networks.testnet)
    //const seller = bsv.PrivateKey.fromRandom(bsv.Networks.testnet)
    const buyer = bsv.PrivateKey.fromWIF('cQvxAra22esyX41WSWAwE7u4P2LTHgrrDCTnFUfcvYDaeN1yEqfg')
    const seller = bsv.PrivateKey.fromWIF('cRq3Apr6LFJ4JpXUhSVY4zQP2pvi3UGZVuCRgs946xhM3mAmqRAP')
    const unitPrice = 5n

    
    const amount = 10

    const instance = new EnergyTradingEscrow(
        // Pass constructor parameter values.
        hash160(buyer.publicKey.toHex()),
        hash160(seller.publicKey.toHex()),
        unitPrice
    )

    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)

    // Save deployed contracts script hash.
    const scriptHash = getScriptHash(instance.lockingScript.toHex())
    const shFile = `.scriptHash`;
    writeFileSync(shFile, scriptHash);

    console.log('Energy contract was successfully deployed!')
    console.log(`TXID: ${deployTx.id}`)
    console.log(`scriptHash: ${scriptHash}`)
}

main()
