import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { 
  PublicKey, 
  Keypair, 
  SystemProgram, 
  Connection, 
  LAMPORTS_PER_SOL, 
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstruction,
  SimulatedTransactionResponse
} from '@solana/web3.js';
import * as fs from 'fs';
import * as borsh from 'borsh';
import { sha256 } from 'js-sha256'; // Make sure to install this package


const IDL = {
  "version": "0.1.0",
  "name": "vulnerable_pool",
  "instructions": [
    {
      "name": "deposit",
      "accounts": [
        { "name": "pool", "isMut": true, "isSigner": false },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    },
    {
      "name": "withdraw",
      "accounts": [
        { "name": "pool", "isMut": true, "isSigner": false },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    }
  ],
  "accounts": [
    {
      "name": "Pool",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "authority", "type": "publicKey" },
          { "name": "totalBalance", "type": "u64" }
        ]
      }
    }
  ]
};


class PoolState {
  authority: Uint8Array;
  totalBalance: anchor.BN;

  constructor(fields: { authority: Uint8Array; totalBalance: anchor.BN }) {
    if (fields.authority.length !== 32) {
      throw new Error("Authority must be 32 bytes");
    }
    this.authority = fields.authority;
    this.totalBalance = fields.totalBalance;
  }

  static serialize(state: PoolState): Buffer {
    const buffer = Buffer.alloc(40); // 32 bytes for authority + 8 bytes for totalBalance
    buffer.set(state.authority, 0);
    buffer.writeBigUInt64LE(BigInt(state.totalBalance.toString()), 32);
    return buffer;
  }

  static deserialize(data: Buffer): PoolState {
    if (data.length !== 40) {
      throw new Error("Invalid data length for PoolState");
    }
    const authority = new Uint8Array(data.slice(0, 32));
    const totalBalance = new anchor.BN(data.readBigUInt64LE(32).toString());
    return new PoolState({ authority, totalBalance });
  }
}

function decodePoolState(data: Buffer): PoolState {
  return PoolState.deserialize(data);
}

function encodePoolState(state: PoolState): Buffer {
  return PoolState.serialize(state);
}

function decodeInstructionData(data: Buffer): any {
  const discriminator = data.slice(0, 8);
  const args = data.slice(8);

  if (discriminator.toString('hex') === 'f223c68952e1f2b6') {
    return {
      instruction: 'deposit',
      amount: new anchor.BN(args.slice(0, 8), 'le').toString()
    };
  } else if (discriminator.toString('hex') === 'b712469c946da122') {
    return {
      instruction: 'withdraw',
      amount: new anchor.BN(args.slice(0, 8), 'le').toString()
    };
  }

  return { instruction: 'unknown', data: args.toString('hex') };
}

async function getBalance(connection: Connection, publicKey: PublicKey): Promise<number> {
  return connection.getBalance(publicKey);
}

async function getRecentBlockhash(connection: Connection): Promise<string> {
  const { blockhash } = await connection.getLatestBlockhash('finalized');
  return blockhash;
}

async function getDetailedAccountInfo(connection: Connection, publicKey: PublicKey): Promise<any> {
  const accountInfo = await connection.getAccountInfo(publicKey);
  if (!accountInfo) {
    return null;
  }

  let decodedData: PoolState | null = null;
  if (accountInfo.owner.equals(new PublicKey("24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk"))) {
    try {
      decodedData = decodePoolState(accountInfo.data);
    } catch (error) {
      console.error("Error decoding pool state:", error);
    }
  }

  return {
    lamports: accountInfo.lamports,
    owner: accountInfo.owner.toBase58(),
    executable: accountInfo.executable,
    rentEpoch: accountInfo.rentEpoch,
    data: decodedData ? {
      authority: new PublicKey(decodedData.authority).toBase58(),
      totalBalance: new anchor.BN(decodedData.totalBalance).toString()
    } : accountInfo.data.toString('hex')
  };
}

// const PoolStateSchema = new Map([
//   [PoolState, {
//     kind: 'struct',
//     fields: [
//       ['authority', [32]],
//       ['totalBalance', 'u64']
//     ]
//   }]
// ]);

async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  signers: Keypair[]
): Promise<SimulatedTransactionResponse> {
  transaction.recentBlockhash = await getRecentBlockhash(connection);
  transaction.sign(...signers);
  const { value } = await connection.simulateTransaction(transaction);
  return value;
}

async function logTransactionDetails(
  connection: Connection,
  transaction: Transaction,
  relevantAccounts: PublicKey[],
  context: string,
  signers: Keypair[],
  error?: any
): Promise<void> {
  console.log(`\n--- ${context} ---`);

  const transactionData = {
    recentBlockhash: transaction.recentBlockhash,
    feePayer: transaction.feePayer?.toBase58(),
    instructions: transaction.instructions.map((instruction: TransactionInstruction) => ({
      programId: instruction.programId.toBase58(),
      keys: instruction.keys.map(key => ({
        pubkey: key.pubkey.toBase58(),
        isSigner: key.isSigner,
        isWritable: key.isWritable
      })),
      data: decodeInstructionData(Buffer.from(instruction.data))
    }))
  };

  console.log("Transaction Data:");
  console.log(JSON.stringify(transactionData, null, 2));

  console.log("\nAccount States Before:");
  for (const account of relevantAccounts) {
    const accountInfo = await getDetailedAccountInfo(connection, account);
    console.log(`${account.toBase58()}:`, JSON.stringify(accountInfo, null, 2));
  }

  console.log("\nSimulation Result:");
  try {
    const simulationResult = await simulateTransaction(connection, transaction, signers);
    console.log(JSON.stringify(simulationResult, null, 2));

    console.log("\nAccount States After (simulated):");
    for (const account of relevantAccounts) {
      const accountInfo = await getDetailedAccountInfo(connection, account);
      console.log(`${account.toBase58()}:`, JSON.stringify(accountInfo, null, 2));
    }
  } catch (simError) {
    console.log("Simulation failed:", simError);
  }

  if (error) {
    console.log("\nError:");
    console.log(JSON.stringify({
      message: error.message,
      logs: error.logs
    }, null, 2));
  }

  console.log("--- End of Transaction Details ---\n");
}

async function transferSol(connection: Connection, from: Keypair, to: PublicKey, amount: number) {
  const transferTx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: amount,
    })
  );
  
  await sendAndLogTransaction(connection, transferTx, [from], "Transfer SOL");
}

async function deposit(connection: Connection, program: Program<any>, user: Keypair, poolPDA: PublicKey, amount: anchor.BN) {
  const tx = await program.methods.deposit(amount)
    .accounts({
      pool: poolPDA,
      user: user.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([user])
    .transaction();
  
  await sendAndLogTransaction(connection, tx, [user], "Deposit");
}

async function prepareTransactionData(
  connection: Connection,
  transaction: Transaction,
  relevantAccounts: PublicKey[]
): Promise<string> {
  // Get account info for all relevant accounts
  const accountInfos = await connection.getMultipleAccountsInfo(relevantAccounts);

  // Prepare the data object
  const data = {
    transaction: {
      feePayer: transaction.feePayer?.toBase58(),
      recentBlockhash: transaction.recentBlockhash,
      instructions: transaction.instructions.map((instruction) => ({
        programId: instruction.programId.toBase58(),
        keys: instruction.keys.map(key => ({
          pubkey: key.pubkey.toBase58(),
          isSigner: key.isSigner,
          isWritable: key.isWritable
        })),
        data: Buffer.from(instruction.data).toString('hex')
      }))
    },
    accounts: relevantAccounts.reduce((acc, pubkey, index) => {
      const info = accountInfos[index];
      acc[pubkey.toBase58()] = info ? {
        balance: info.lamports,
        owner: info.owner.toBase58(),
        data: Buffer.from(info.data).toString('hex')
      } : null;
      return acc;
    }, {} as Record<string, any>)
  };

  return JSON.stringify(data);
}


async function withdraw(
  connection: Connection, 
  program: Program<any>, 
  user: anchor.web3.Keypair, 
  poolPDA: PublicKey, 
  amount: anchor.BN
) {
  // Prepare the withdrawal transaction
  const tx = await program.methods.withdraw(amount)
    .accounts({
      pool: poolPDA,
      user: user.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .transaction();

  // Get the latest blockhash
  const { blockhash } = await connection.getLatestBlockhash('finalized');
  tx.recentBlockhash = blockhash;
  tx.feePayer = user.publicKey;

  // Log the transaction details before execution
  const logData = await logContractInteraction(
    connection,
    tx,
    [poolPDA, user.publicKey],
    program.programId,
    getContractCode(),
    user
  );

  console.log("prepare transaction data")
  const prepareLog = await prepareTransactionData(connection, tx, [user.publicKey, poolPDA]);
  console.log(JSON.stringify(prepareLog, null, 2));

  console.log("Withdraw Transaction Log:");
  console.log(JSON.stringify(logData, null, 2));

  // If you want to proceed with the transaction:
  // const txSignature = await sendAndConfirmTransaction(connection, tx, [user]);
  // console.log(`Withdraw transaction signature: ${txSignature}`);
}



// function logSimulationResult(simulationResult: SimulatedTransactionResponse) {
//   return {
//     err: simulationResult.err,
//     logs: simulationResult.logs,
//     unitsConsumed: simulationResult.unitsConsumed,
//     returnData: simulationResult.returnData 
//       ? {
//           programId: typeof simulationResult.returnData.programId === 'object' 
//             ? (simulationResult.returnData.programId as PublicKey).toBase58()
//             : simulationResult.returnData.programId,
//           data: Buffer.from(simulationResult.returnData.data).toString('hex')
//         } 
//       : null,
//     accounts: simulationResult.accounts?.map(account => 
//       account 
//         ? {
//             lamports: account.lamports,
//             owner: typeof account.owner === 'object' && account.owner instanceof PublicKey 
//               ? account.owner.toBase58() 
//               : typeof account.owner === 'string'
//                 ? account.owner
//                 : null,
//             data: Buffer.from(account.data).toString('hex')
//           } 
//         : null
//     )
//   };
// }

async function logContractInteraction(
  connection: Connection,
  transaction: Transaction,
  relevantAccounts: PublicKey[],
  contractProgramId: PublicKey,
  contractCode: string,
  user: anchor.web3.Keypair
): Promise<any> {
  const preTransactionState = await getAccountsState(connection, relevantAccounts);
  const simulationResult = await simulateTransaction(connection, transaction, [user]);
  const contractCodeHash = sha256(contractCode);

  return {
    timestamp: new Date().toISOString(),
    contractProgramId: contractProgramId.toBase58(),
    contractCodeHash: contractCodeHash,
    preTransactionState: preTransactionState,
    proposedTransaction: {
      feePayer: transaction.feePayer?.toBase58(),
      recentBlockhash: transaction.recentBlockhash,
      instructions: transaction.instructions.map(instruction => ({
        programId: instruction.programId.toBase58(),
        keys: instruction.keys.map(key => ({
          pubkey: key.pubkey.toBase58(),
          isSigner: key.isSigner,
          isWritable: key.isWritable
        })),
        data: Buffer.from(instruction.data).toString('hex')
      }))
    },
    simulationResult: simulationResult
  };
}

async function getAccountsState(connection: Connection, accounts: PublicKey[]) {
  const accountInfos = await connection.getMultipleAccountsInfo(accounts);
  return accounts.reduce((acc, account, index) => {
    acc[account.toBase58()] = accountInfos[index] ? {
      lamports: accountInfos[index]!.lamports,
      owner: accountInfos[index]!.owner.toBase58(),
      data: accountInfos[index]!.data.toString('hex')
    } : null;
    return acc;
  }, {} as Record<string, any>);
}


function getContractCode(): string {
  // Implement this function to return the contract code as a string
  // You might read it from a file or fetch it from somewhere
  return "// Contract code here";
}





async function transferRemainingBalance(connection: Connection, from: Keypair, to: PublicKey) {
  const balance = await connection.getBalance(from.publicKey);
  if (balance > 5000) {
    const transferTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - 5000,
      })
    );
    
    await sendAndLogTransaction(connection, transferTx, [from], "Transfer remaining balance");
  } else {
    console.log("Insufficient balance to transfer back.");
  }
}

async function sendAndLogTransaction(connection: Connection, transaction: Transaction, signers: Keypair[], context: string) {
  transaction.recentBlockhash = await getRecentBlockhash(connection);
  transaction.feePayer = signers[0].publicKey;

  // await logTransactionDetails(connection, transaction, signers.map(s => s.publicKey), context, signers);

  try {
    const txSignature = await sendAndConfirmTransaction(connection, transaction, signers);
    console.log(`${context} successful. Transaction signature:`, txSignature);
  } catch (error: any) {
    console.error(`Error in ${context}:`, error.message);
    await logTransactionDetails(connection, transaction, signers.map(s => s.publicKey), `Failed ${context}`, signers, error);
  }
}



async function printFinalBalances(connection: Connection, payerPubkey: PublicKey, userPubkey: PublicKey, poolPDA: PublicKey) {
  const [payerBalance, userBalance, poolBalance] = await Promise.all([
    getBalance(connection, payerPubkey),
    getBalance(connection, userPubkey),
    getBalance(connection, poolPDA)
  ]);

  console.log("\nFinal balances:");
  console.log("Payer balance:", payerBalance / LAMPORTS_PER_SOL, "SOL");
  console.log("User balance:", userBalance / LAMPORTS_PER_SOL, "SOL");
  console.log("Pool balance:", poolBalance / LAMPORTS_PER_SOL, "SOL");

  const finalPoolState = await getDetailedAccountInfo(connection, poolPDA);
  console.log("Final Pool State:", JSON.stringify(finalPoolState, null, 2));
}

async function main() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  // Load or generate keypair
  const KEYPAIR_FILE = 'payer-keypair.json';
  let payer: Keypair;
  try {
    const secretKeyString = fs.readFileSync(KEYPAIR_FILE, 'utf8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    payer = Keypair.fromSecretKey(secretKey);
    console.log("Loaded existing keypair");
  } catch (error) {
    payer = Keypair.generate();
    fs.writeFileSync(KEYPAIR_FILE, JSON.stringify(Array.from(payer.secretKey)));
    console.log("Generated new keypair and saved to", KEYPAIR_FILE);
  }

  const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(payer), {});
  anchor.setProvider(provider);

  const programId = new PublicKey("24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk");
  console.log("Using program ID:", programId.toString());
  
  const program = new Program(IDL as anchor.Idl, programId, provider);

  const user = Keypair.generate();

  console.log("\nPayer address:", payer.publicKey.toString());
  console.log("User address:", user.publicKey.toString());
  
  let payerBalance = await getBalance(connection, payer.publicKey);
  console.log("Payer balance:", payerBalance / LAMPORTS_PER_SOL, "SOL");

  if (payerBalance < 3 * LAMPORTS_PER_SOL) {
    console.log("\nPayer balance is low. Please airdrop 3 SOL to the payer address.");
    console.log("Command: solana airdrop 3 " + payer.publicKey.toString() + " --url https://api.devnet.solana.com");
    console.log("Press Enter when you have completed the airdrop...");
    await new Promise(resolve => process.stdin.once('data', resolve));
    payerBalance = await getBalance(connection, payer.publicKey);
    console.log("Updated payer balance:", payerBalance / LAMPORTS_PER_SOL, "SOL");
  }

  // Use the specific Pool public key
  const poolPDA = new PublicKey("5MsJQJAK6qNfGD5764Mg5zftcnu9nVMDwDMamjV73HHX");
  console.log("Using Pool PDA:", poolPDA.toString());

  // Transfer funds to user
  console.log("\nTransferring 0.002 SOL from payer to user for deposit and fees...");
  await transferSol(connection, payer, user.publicKey, LAMPORTS_PER_SOL/500);

  // Deposit funds
  console.log("\nDepositing funds into the pool...");
  const depositAmount = new anchor.BN(LAMPORTS_PER_SOL/1000); // 0.001 SOL
  await deposit(connection, program, user, poolPDA, depositAmount);

  // Attempt to withdraw more than deposited
  console.log("\nAttempting to withdraw more funds than deposited...");
  const withdrawAmount = new anchor.BN(LAMPORTS_PER_SOL/500); // 0.002 SOL
  await withdraw(connection, program, user, poolPDA, withdrawAmount);

  // Transfer remaining balance back to payer
  console.log("\nTransferring user's balance back to payer...");
  await transferRemainingBalance(connection, user, payer.publicKey);

  // Print final balances
  await printFinalBalances(connection, payer.publicKey, user.publicKey, poolPDA);
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  }
);