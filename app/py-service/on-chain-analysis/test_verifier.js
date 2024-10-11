const solanaWeb3 = require('@solana/web3.js');

// Replace this with your actual program ID
const programId = new solanaWeb3.PublicKey('33m1f8VjS11wSnBuDiWqvkRjkL6myYdVp8qK8SouWu8Q');

// Replace this with your wallet public key (authority)
const authorityPublicKey = new solanaWeb3.PublicKey('BYq5RpPNPa4WEHJgNtapdP2Re5wtyzNSTLbcNwtdguM8');

async function findVerifierStatePDA() {
  const [verifierStatePDA, bump] = await solanaWeb3.PublicKey.findProgramAddress(
    [Buffer.from("verifier_state"), authorityPublicKey.toBuffer()],
    programId
  );
  console.log("Verifier State PDA:", verifierStatePDA.toString());
  console.log("Bump:", bump);
}

findVerifierStatePDA();
