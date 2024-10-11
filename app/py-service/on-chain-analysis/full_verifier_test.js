const fs = require('fs');
const { PublicKey, Keypair, SystemProgram, Transaction, TransactionInstruction, Connection, Ed25519Program } = require('@solana/web3.js');
const { AnchorProvider } = require('@project-serum/anchor');
const crypto = require('crypto');

// Constants
const PROGRAM_ID = new PublicKey('33m1f8VjS11wSnBuDiWqvkRjkL6myYdVp8qK8SouWu8Q'); // Your deployed program ID
const CLUSTER = 'https://api.devnet.solana.com'; // Solana Devnet

// Step 1: Load keypair from `keypair.json`
const loadKeypair = () => {
  const secretKeyString = fs.readFileSync('/Users/rishiambwani/Downloads/wallet-keypair\ \(3\).json', 'utf8');  // Read the keypair.json file
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));   // Convert the JSON array to Uint8Array
  return Keypair.fromSecretKey(secretKey);                          // Create Keypair from secret key
};

// Load the keypair
const keypair = loadKeypair();
const publicKey = keypair.publicKey;

// Pool and user public keys (for the message to sign)
const poolAddress = new PublicKey('DE8mBCGgZi8aFHfXvdsjWUFWb8MJnZv8SFxvA8xzUVpt');  // Pool address
const userAddress = new PublicKey('BYq5RpPNPa4WEHJgNtapdP2Re5wtyzNSTLbcNwtdguM8');  // User address
const amount = 1000000;  // 1 SOL in lamports

async function main() {
    // Create connection
    const connection = new Connection(CLUSTER, 'confirmed');

    // Create Anchor Provider with Keypair
    const provider = new AnchorProvider(
        connection,
        { publicKey: keypair.publicKey, signTransaction: async (tx) => { tx.partialSign(keypair); return tx; }, signAllTransactions: async (txs) => { txs.forEach(tx => tx.partialSign(keypair)); return txs; } },  // Custom wallet implementation using keypair
        { preflightCommitment: 'confirmed' }
    );

    // Initialize Verifier Contract
    console.log(`\nInitializing the Verifier contract with Public Key: ${publicKey.toBase58()}`);

    // Derive the verifier state PDA
    const [verifierStatePDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("verifier_state"), publicKey.toBuffer()],
        PROGRAM_ID
    );

    console.log(`Verifier State PDA: ${verifierStatePDA.toBase58()}`);

    // Initialize the verifier by creating the account (Initialize function)
    let initializeTx = new Transaction().add(
        new TransactionInstruction({
            programId: PROGRAM_ID,
            keys: [
                { pubkey: verifierStatePDA, isSigner: false, isWritable: true },
                { pubkey: publicKey, isSigner: true, isWritable: true },  // Authority is the signer
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },  // System program for initialization
            ],
            data: Buffer.from([]),  // This assumes your contract doesn't need extra data to initialize
        })
    );

    // Send the transaction to initialize the verifier state
    let signature = await provider.sendAndConfirm(initializeTx, [keypair]);
    console.log(`Verifier initialized with transaction signature: ${signature}`);

    // ======================
    // Create and sign a message (message = pool address + user address + amount)
    // ======================
    const message = crypto.createHash('sha256');
    message.update(poolAddress.toBuffer());
    message.update(userAddress.toBuffer());
    message.update(Buffer.from(amount.toString(16).padStart(16, '0'), 'hex'));  // Convert amount to 8-byte little-endian

    const messageBytes = message.digest();
    const signedMessage = keypair.sign(messageBytes);

    // ======================
    // Log the generated data
    // ======================
    console.log(`\nGenerated message (SHA256 hash): ${Array.from(messageBytes)}`);
    console.log(`Signature (64 bytes): ${Array.from(signedMessage.signature)}`);
    console.log(`Public Key in array format: ${Array.from(publicKey.toBytes())}`);

    // ======================
    // Verify the signature by calling the contract
    // ======================
    const verifyTx = new Transaction().add(
        new TransactionInstruction({
            programId: PROGRAM_ID,
            keys: [
                { pubkey: verifierStatePDA, isSigner: false, isWritable: true },
                { pubkey: publicKey, isSigner: true, isWritable: false },  // Authority as the signer
                { pubkey: Ed25519Program.programId, isSigner: false, isWritable: false },  // Ed25519 Program for signature verification
            ],
            data: Buffer.concat([
                Buffer.from([1]),  // Ed25519 prefix byte (for Ed25519 signature verification)
                Buffer.from(signedMessage.signature),  // The signature (64 bytes)
                Buffer.from([messageBytes.length]),  // Message length
                Buffer.from(messageBytes),  // The message (SHA-256 hash)
            ]),
        })
    );

    // Send the transaction to verify the signature
    let verifySignature = await provider.sendAndConfirm(verifyTx, [keypair]);
    console.log(`Signature verified with transaction signature: ${verifySignature}`);
}

main().catch(err => {
    console.error(err);
});

