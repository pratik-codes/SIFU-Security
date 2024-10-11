use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::invoke;
use std::str::FromStr;

declare_id!("DE8mBCGgZi8aFHfXvdsjWUFWb8MJnZv8SFxvA8xzUVpt");

// Declare the Signature Verifier program ID
const SIGNATURE_VERIFIER_PROGRAM_ID: &str = "G6U43g6N9H7MwTjAi6BkWvPG4LJJTgn5RrYNSaoohLND";

#[program]
pub mod vulnerable_pool {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.total_balance = 0;
        pool.user_keys = Vec::new();
        pool.user_balances = Vec::new();
        msg!("Pool initialized with authority: {}", pool.authority);
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let user = &ctx.accounts.user;

        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: user.to_account_info(),
                    to: pool.to_account_info(),
                },
            ),
            amount,
        )?;

        pool.total_balance = pool.total_balance.checked_add(amount).ok_or(ErrorCode::Overflow)?;

        if let Some(index) = pool.user_keys.iter().position(|&key| key == user.key()) {
            pool.user_balances[index] = pool.user_balances[index].checked_add(amount).ok_or(ErrorCode::Overflow)?;
        } else {
            pool.user_keys.push(user.key());
            pool.user_balances.push(amount);
        }

        let user_balance = pool.user_balances[pool.user_keys.iter().position(|&key| key == user.key()).unwrap()];
        msg!("User {} deposited {} lamports", user.key(), amount);
        msg!("New user balance: {} lamports", user_balance);
        msg!("New pool total balance: {} lamports", pool.total_balance);

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64, signature: [u8; 64]) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let user = &mut ctx.accounts.user;

        // Create a message to verify
        let mut hash_input = pool.to_account_info().key.to_bytes().to_vec();
        hash_input.extend_from_slice(&user.key().to_bytes());
        hash_input.extend_from_slice(&amount.to_le_bytes());
        let message = hash::hash(&hash_input).to_bytes();

        // Verify the signature
        let verifier_program_id = Pubkey::from_str(SIGNATURE_VERIFIER_PROGRAM_ID).unwrap();
        if ctx.accounts.verifier_program.key() != verifier_program_id {
            return Err(ErrorCode::InvalidVerifierProgram.into());
        }

        let verify_ix = Instruction {
            program_id: verifier_program_id,
            accounts: vec![AccountMeta::new_readonly(ctx.accounts.verifier_state.key(), false)],
            data: signature.to_vec().into_iter().chain(message.into_iter()).collect(),
        };

        invoke(
            &verify_ix,
            &[ctx.accounts.verifier_state.to_account_info()],
        ).map_err(|_| error!(ErrorCode::InvalidSignature))?;

        // VULNERABLE: No check if user has sufficient balance
        **pool.to_account_info().try_borrow_mut_lamports()? = pool.to_account_info().lamports().checked_sub(amount).ok_or(ErrorCode::InsufficientFunds)?;
        **user.to_account_info().try_borrow_mut_lamports()? = user.to_account_info().lamports().checked_add(amount).ok_or(ErrorCode::Overflow)?;

        pool.total_balance = pool.total_balance.checked_sub(amount).ok_or(ErrorCode::InsufficientFunds)?;

        if let Some(index) = pool.user_keys.iter().position(|&key| key == user.key()) {
            pool.user_balances[index] = pool.user_balances[index].checked_sub(amount).unwrap_or(0);
        } else {
            pool.user_keys.push(user.key());
            pool.user_balances.push(0);
        }

        let user_balance = pool.user_balances[pool.user_keys.iter().position(|&key| key == user.key()).unwrap()];
        msg!("User {} withdrew {} lamports", user.key(), amount);
        msg!("New user balance: {} lamports", user_balance);
        msg!("New pool total balance: {} lamports", pool.total_balance);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 4 + (32 * 50) + 4 + (8 * 50))]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64, signature: [u8; 64])]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK: Verified in the withdraw function
    pub verifier_program: AccountInfo<'info>,
    /// CHECK: Verified in the CPI to the verifier program
    pub verifier_state: AccountInfo<'info>,
}

#[account]
pub struct Pool {
    pub authority: Pubkey,
    pub total_balance: u64,
    pub user_keys: Vec<Pubkey>,
    pub user_balances: Vec<u64>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Math operation overflow")]
    Overflow,
    #[msg("Insufficient funds for operation")]
    InsufficientFunds,
    #[msg("Invalid signature")]
    InvalidSignature,
    #[msg("Invalid verifier program")]
    InvalidVerifierProgram,
}