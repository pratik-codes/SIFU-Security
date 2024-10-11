// const { Keypair, Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } = require('@solana/web3.js');
// const { Program, AnchorProvider, Wallet } = require('@coral-xyz/anchor');

// const fs = require('fs');
// const path = require('path');
// const crypto = require('crypto');
// const bs58 = require('bs58');
// const nacl = require('tweetnacl');
// const secp256k1 = require('secp256k1');



// // Load the IDL file (make sure to replace with your actual IDL path)
// const idl = JSON.parse(fs.readFileSync(path.resolve(__dirname, '/Users/rishiambwani/Downloads/idl (3).json'), 'utf8'));

// // Configuration
// const RPC_URL = 'https://api.devnet.solana.com'; // Use mainnet for production
// const PROGRAM_ID = new PublicKey('FGJ6NJRGpw8MXjsQjC9g7CsxLBK4DTFDjqvpU7wjYwK7'); // Replace with your actual program ID

// try {
//     console.log('Program ID:', PROGRAM_ID.toString());
// } catch (error) {
//     console.error('Invalid Program ID:', error);
//     process.exit(1); // Exit early if the PROGRAM_ID is not valid
// }

// console.log('IDL:', idl);


// const ED25519_PROGRAM_ID = new PublicKey('Ed25519SigVerify111111111111111111111111111');

// // Load wallet keypair from keypair.json
// function loadWalletKey(keypairFile) {
//     const loaded = JSON.parse(fs.readFileSync(keypairFile, 'utf8'));
//     if (Array.isArray(loaded)) {
//         return Keypair.fromSecretKey(new Uint8Array(loaded));
//     } else if (loaded.secretKey) {
//         return Keypair.fromSecretKey(new Uint8Array(loaded.secretKey));
//     } else {
//         throw new Error('Invalid keypair file format');
//     }
// }

// const walletKeypair = loadWalletKey(path.resolve(__dirname, '/Users/rishiambwani/Downloads/wallet-keypair\ \(3\).json'));

// // Fixed private key for signature generation (replace with your actual private key)
// const fixedPrivateKey = new Uint8Array(32).fill(1); // Example: all 1's, replace with your actual key
// const signingKeypair = Keypair.fromSecretKey(fixedPrivateKey);

// Fixed private key (replace with your actual base58 encoded private key)

// const walletKeypairData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '/Users/rishiambwani/Downloads/wallet-keypair\ \(3\).json'), 'utf8'));
// const walletKeypair = Keypair.fromSecretKey(new Uint8Array(walletKeypairData));

// const fixedPrivateKeyBase58 = '5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG';

// // Convert base58 private key to Uint8Array
// const fixedPrivateKey = bs58.default.decode(fixedPrivateKeyBase58);
// // const keypair = Keypair.fromSecretKey(fixedPrivateKey);
// const signingKeypair = Keypair.fromSecretKey(fixedPrivateKey);


// // Generate a new Secp256k1 keypair
// function generateSecp256k1Keypair() {
//     let privateKey;
//     do {
//         privateKey = crypto.randomBytes(32);
//     } while (!secp256k1.privateKeyVerify(privateKey));
//     const publicKey = secp256k1.publicKeyCreate(privateKey);
//     return { privateKey, publicKey };
// }

// async function main() {
//     const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
//     const wallet = new Wallet(Keypair.generate());
//     const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
//     const program = new Program(idl, PROGRAM_ID, provider);

//     const { privateKey, publicKey } = generateSecp256k1Keypair();

//     console.log('Wallet Public Key:', wallet.publicKey.toBase58());
//     console.log('Secp256k1 Public Key:', Buffer.from(publicKey).toString('hex'));

//     const message = Buffer.from("Hello, Solana!");
//     const messageHash = crypto.createHash('sha256').update(message).digest();
//     const sigObj = secp256k1.ecdsaSign(messageHash, privateKey);

//     console.log('Message:', message.toString());
//     console.log('Signature:', Buffer.from(sigObj.signature).toString('hex'));
//     console.log('Recovery ID:', sigObj.recid);

//     const [verifierStatePDA] = PublicKey.findProgramAddressSync(
//         [Buffer.from("verifier_state"), wallet.publicKey.toBuffer()],
//         PROGRAM_ID
//     );
//     console.log('Verifier State PDA:', verifierStatePDA.toBase58());

//     try {
//         const accountInfo = await connection.getAccountInfo(verifierStatePDA);
        
//         if (!accountInfo) {
//             console.log('Initializing verifier...');
//             const initTx = await program.methods.initialize(Array.from(publicKey))
//                 .accounts({
//                     verifierState: verifierStatePDA,
//                     authority: wallet.publicKey,
//                     systemProgram: SystemProgram.programId,
//                 })
//                 .rpc();
//             console.log('Initialization transaction signature:', initTx);
//         } else {
//             console.log('Verifier state account already exists. Skipping initialization.');
//         }

//         console.log('Verifying signature...');
//         const verifyTx = await program.methods.verifySignature(
//             Array.from(sigObj.signature),
//             sigObj.recid,
//             Array.from(message)
//         )
//         .accounts({
//             verifierState: verifierStatePDA,
//         })
//         .rpc();
//         console.log('Verification transaction signature:', verifyTx);
//         console.log('Signature verified successfully!');
//     } catch (error) {
//         console.error('Error:', error);
//         if (error.logs) {
//             console.error('Transaction logs:', error.logs);
//         }
//     }
// }

// main().then(
//     () => process.exit(),
//     err => {
//         console.error(err);
//         process.exit(-1);
//     },
// );


const anchor = require('@project-serum/anchor');
const { Keypair, PublicKey, SystemProgram } = require('@solana/web3.js');
const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const bs58 = require('bs58');
const fs = require('fs');
const path = require('path');

// Load wallet keypair from file
function loadWalletKey(filePath) {
    const keyData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return Keypair.fromSecretKey(Uint8Array.from(keyData));
}

// Load the IDL file (replace with your actual IDL file path)
const idl = JSON.parse(fs.readFileSync(path.resolve(__dirname, '/Users/rishiambwani/Downloads/idl (4).json'), 'utf8'));
const PROGRAM_ID = new PublicKey('EiT4um2QKpN1Q7RNu3YYJLpBKv9bhq5P3zFGCmPFLkRX'); // Your actual program ID

const walletKeypair = loadWalletKey(path.resolve(__dirname, '/Users/rishiambwani/Downloads/wallet-keypair\ \(3\).json'));  // Adjust the path
const fixedPrivateKeyBase58 = '5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG';
const fixedPrivateKey = bs58.default.decode(fixedPrivateKeyBase58);

async function main() {
    // Establish a connection to the Solana devnet
    const connection = new anchor.web3.Connection('https://api.devnet.solana.com', 'confirmed');
    const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(walletKeypair), { commitment: 'confirmed' });

    // Create an anchor program instance
    const program = new anchor.Program(idl, PROGRAM_ID, provider);

    // Helper function to generate a Secp256k1 keypair
    function generateSecp256k1Keypair() {
        let privateKey;
        do {
            privateKey = crypto.randomBytes(32);
        } while (!secp256k1.privateKeyVerify(privateKey));
        const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1); // 64-byte uncompressed public key
        return { privateKey, publicKey };
    }

    const { privateKey, publicKey } = generateSecp256k1Keypair();

    // Create message and signature
    const message = Buffer.from("Hello, Solana!");
    const messageHash = crypto.createHash('sha256').update(message).digest();
    const sigObj = secp256k1.ecdsaSign(messageHash, privateKey);
    const signature = Buffer.from(sigObj.signature);  // 64-byte signature
    const recoveryId = sigObj.recid;  // Recovery ID for signature verification

    console.log('Message:', message.toString());
    console.log('Signature:', signature.toString('hex'));
    console.log('Recovery ID:', recoveryId);

    // Derive PDA for verifier state
    const [verifierStatePDA] = await PublicKey.findProgramAddress(
        [Buffer.from("verifier_state"), walletKeypair.publicKey.toBuffer()],
        PROGRAM_ID
    );
    console.log('Verifier State PDA:', verifierStatePDA.toBase58());

    // Check if the verifier account already exists
    const accountInfo = await connection.getAccountInfo(verifierStatePDA);
    if (!accountInfo) {
        console.log('Initializing verifier state...');

        // Initialize the verifier state (public key is passed here)
        const tx = await program.methods.initialize(Array.from(publicKey))
            .accounts({
                verifierState: verifierStatePDA,
                authority: walletKeypair.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([walletKeypair])  // Ensure that only walletKeypair signs
            .rpc();

        console.log('Initialization successful. Transaction signature:', tx);
    } else {
        console.log('Verifier state already initialized. Skipping initialization.');
    }

    // Verify the signature
    console.log('Verifying signature...');
    const verifyTx = await program.methods.verifySignature(
        Array.from(signature),
        recoveryId,
        Array.from(message)
    )
    .accounts({
        verifierState: verifierStatePDA,
    })
    .rpc();

    console.log('Verification successful. Transaction signature:', verifyTx);
}

// Execute the main function
main().catch(err => {
    console.error('Error in main execution:', err);
});

