use anchor_lang::prelude::*;
use anchor_lang::solana_program::ed25519_program::ID as ED25519_ID;
use anchor_lang::solana_program::instruction::Instruction;

declare_id!("G6U43g6N9H7MwTjAi6BkWvPG4LJJTgn5RrYNSaoohLND"); // Replace with your actual program ID


#[program]
pub mod signature_verifier {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, public_key: [u8; 32]) -> Result<()> {
        let verifier_state = &mut ctx.accounts.verifier_state;
        verifier_state.public_key = public_key;
        verifier_state.authority = ctx.accounts.authority.key();
        Ok(())
    }

    pub fn verify_signature(ctx: Context<VerifySignature>, signature: [u8; 64], message: Vec<u8>) -> Result<()> {
        let verifier_state = &ctx.accounts.verifier_state;
        
        let ix = Instruction {
            program_id: ED25519_ID,
            accounts: vec![],
            data: [
                &[1], // Prefix
                &signature[..],
                &[verifier_state.public_key.len() as u8],
                &verifier_state.public_key[..],
                &[message.len() as u8],
                &message[..],
            ]
            .concat(),
        };

        let account_infos = vec![];

        solana_program::program::invoke(&ix, &account_infos).map_err(|_| error!(ErrorCode::SignatureVerificationFailed))?;

        msg!("Signature verified successfully");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32,
        seeds = [b"verifier_state", authority.key().as_ref()],
        bump
    )]
    pub verifier_state: Account<'info, VerifierState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifySignature<'info> {
    #[account(
        seeds = [b"verifier_state", verifier_state.authority.as_ref()],
        bump
    )]
    pub verifier_state: Account<'info, VerifierState>,
}

#[account]
pub struct VerifierState {
    pub public_key: [u8; 32],
    pub authority: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Signature verification failed")]
    SignatureVerificationFailed,
}