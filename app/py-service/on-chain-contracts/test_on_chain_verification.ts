const { Keypair, Connection, PublicKey, SystemProgram } = require('@solana/web3.js');
const { Program, AnchorProvider, Wallet, utils } = require('@coral-xyz/anchor');
const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const fs = require('fs');
const path = require('path');

// Replace with your program ID
const PROGRAM_ID = new PublicKey('FGJ6NJRGpw8MXjsQjC9g7CsxLBK4DTFDjqvpU7wjYwK7');

// Load the IDL file
const idl = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'path/to/your/idl.json'), 'utf8'));

// Generate a new Secp256k1 keypair
function generateSecp256k1Keypair() {
    let privateKey;
    do {
        privateKey = crypto.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey));
    const publicKey = secp256k1.publicKeyCreate(privateKey);
    return { privateKey, publicKey };
}

async function main() {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const wallet = new Wallet(Keypair.generate());
    const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
    const program = new Program(idl, PROGRAM_ID, provider);

    const { privateKey, publicKey } = generateSecp256k1Keypair();

    console.log('Wallet Public Key:', wallet.publicKey.toBase58());
    console.log('Secp256k1 Public Key:', Buffer.from(publicKey).toString('hex'));

    const message = Buffer.from("Hello, Solana!");
    const messageHash = crypto.createHash('sha256').update(message).digest();
    const sigObj = secp256k1.ecdsaSign(messageHash, privateKey);

    console.log('Message:', message.toString());
    console.log('Signature:', Buffer.from(sigObj.signature).toString('hex'));
    console.log('Recovery ID:', sigObj.recid);

    const [verifierStatePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("verifier_state"), wallet.publicKey.toBuffer()],
        PROGRAM_ID
    );
    console.log('Verifier State PDA:', verifierStatePDA.toBase58());

    try {
        const accountInfo = await connection.getAccountInfo(verifierStatePDA);
        
        if (!accountInfo) {
            console.log('Initializing verifier...');
            const initTx = await program.methods.initialize(Array.from(publicKey))
                .accounts({
                    verifierState: verifierStatePDA,
                    authority: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
            console.log('Initialization transaction signature:', initTx);
        } else {
            console.log('Verifier state account already exists. Skipping initialization.');
        }

        console.log('Verifying signature...');
        const verifyTx = await program.methods.verifySignature(
            Array.from(sigObj.signature),
            sigObj.recid,
            Array.from(message)
        )
        .accounts({
            verifierState: verifierStatePDA,
        })
        .rpc();
        console.log('Verification transaction signature:', verifyTx);
        console.log('Signature verified successfully!');
    } catch (error) {
        console.error('Error:', error);
        if (error.logs) {
            console.error('Transaction logs:', error.logs);
        }
    }
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },