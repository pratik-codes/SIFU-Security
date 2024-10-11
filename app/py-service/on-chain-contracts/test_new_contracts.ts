import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { VulnerablePool } from "../target/types/vulnerable_pool";
import { expect } from "chai";

describe("vulnerable_pool", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VulnerablePool as Program<VulnerablePool>;
  const authority = provider.wallet.publicKey;

  let poolPDA: anchor.web3.PublicKey;
  let poolBump: number;

  before(async () => {
    [poolPDA, poolBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("pool"), authority.toBuffer()],
      program.programId
    );
  });

  it("Initializes the pool", async () => {
    await program.methods
      .initialize()
      .accounts({
        pool: poolPDA,
        authority: authority,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const poolAccount = await program.account.pool.fetch(poolPDA);
    expect(poolAccount.authority.toString()).to.equal(authority.toString());
    expect(poolAccount.totalBalance.toNumber()).to.equal(0);
    expect(poolAccount.userKeys).to.be.empty;
    expect(poolAccount.userBalances).to.be.empty;
  });

  it("Deposits funds", async () => {
    const user = anchor.web3.Keypair.generate();
    const amount = new anchor.BN(1_000_000_000); // 1 SOL

    // Airdrop some SOL to the user
    await provider.connection.requestAirdrop(user.publicKey, 2_000_000_000);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for airdrop to be confirmed

    await program.methods
      .deposit(amount)
      .accounts({
        pool: poolPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const poolAccount = await program.account.pool.fetch(poolPDA);
    expect(poolAccount.totalBalance.toNumber()).to.equal(amount.toNumber());
    expect(poolAccount.userKeys[0].toString()).to.equal(user.publicKey.toString());
    expect(poolAccount.userBalances[0].toNumber()).to.equal(amount.toNumber());
  });

  it("Withdraws funds (vulnerable)", async () => {
    const user = anchor.web3.Keypair.generate();
    const depositAmount = new anchor.BN(1_000_000_000); // 1 SOL
    const withdrawAmount = new anchor.BN(2_000_000_000); // 2 SOL (more than deposited)

    // Airdrop some SOL to the user
    await provider.connection.requestAirdrop(user.publicKey, 2_000_000_000);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for airdrop to be confirmed

    // Deposit first
    await program.methods
      .deposit(depositAmount)
      .accounts({
        pool: poolPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Now withdraw more than deposited
    await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        pool: poolPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const poolAccount = await program.account.pool.fetch(poolPDA);
    expect(poolAccount.totalBalance.toNumber()).to.be.lessThan(0);
    expect(poolAccount.userBalances[0].toNumber()).to.equal(0);
  });
});