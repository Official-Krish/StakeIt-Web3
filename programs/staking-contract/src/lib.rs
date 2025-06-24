use anchor_lang::prelude::*;
use anchor_lang::system_program;


declare_id!("BoN2bzEWpqnFcugMCzPec63EDyGA7LHLSMySdMJxiY7x");

const POINTS_PER_SOL_PER_DAY: u64 = 864; 
const LAMPORTS_PER_SOL: u64 = 1_000_000_000;
const SECONDS_PER_DAY: u64 = 86_400;
const PRECISION_FACTOR: u128 = 1_000_000; 

#[program]
pub mod staking_contract {
    use super::*;

    pub fn create_pda_account(ctx: Context<CreatePdaAccount>) -> Result<()> {
        let pda_account = &mut ctx.accounts.pda_account;
        pda_account.owner = ctx.accounts.payer.key();
        pda_account.staked_amount = 0;
        pda_account.total_points = 0;
        pda_account.last_updated_timestamp = Clock::get()?.unix_timestamp;
        pda_account.bump = ctx.bumps.pda_account;

        msg!("PDA Account created successfully!");
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);
        let pda_account = &mut ctx.accounts.pda_account;

        let current_timestamp = Clock::get()?.unix_timestamp;

        update_points(pda_account, current_timestamp)?;

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: pda_account.to_account_info(),
            },
        );

        system_program::transfer(cpi_context, amount)?;
        pda_account.staked_amount = pda_account.staked_amount.checked_add(amount)
            .ok_or(StakeError::Overflow)?;

        msg!("Stake successful! Amount: {}", amount);
        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>,amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);
        let pda_account = &mut ctx.accounts.pda_account;

        require!(pda_account.staked_amount >= amount, StakeError::InsufficientStake);

        let current_timestamp = Clock::get()?.unix_timestamp;

        update_points(pda_account, current_timestamp)?;

        // let user_key = ctx.accounts.user.key(); 
        // let seeds = &[
        //     b"pda_account",
        //     user_key.as_ref(),
        //     &[pda_account.bump],
        // ];
        // let signer = &[&seeds[..]];
        // let cpi_context = CpiContext::new_with_signer(
        //     ctx.accounts.system_program.to_account_info(),
        //     system_program::Transfer {
        //         from: pda_account.to_account_info(),
        //         to: ctx.accounts.user.to_account_info(),
        //     },
        //     signer,
        // );
        // system_program::transfer(cpi_context, amount)?;
        **pda_account.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += amount;

        pda_account.staked_amount = pda_account.staked_amount.checked_sub(amount)
            .ok_or(StakeError::Underflow)?;
        msg!("Unstake successful! Amount: {}", amount);
        Ok(())
    }

    pub fn claim_points(ctx: Context<ClaimPoints>, amount: u32) -> Result<()> {
        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;
        
        // Update points to current time
        update_points(pda_account, clock.unix_timestamp)?;
        
        let claimable_points = pda_account.total_points; 
        
        msg!("User has {} claimable points", claimable_points);
        require!(claimable_points >= amount as u64, StakeError::InsufficientStake);
        
        // Reset points after claiming (or you could track claimed vs unclaimed separately)
        pda_account.total_points = pda_account.total_points.checked_sub(amount as u64)
            .ok_or(StakeError::Underflow)?;
        
        Ok(())
    }
    
    pub fn get_points(ctx: Context<GetPoints>) -> Result<()> {
        let pda_account = &ctx.accounts.pda_account;
        let clock = Clock::get()?;
        
        // Calculate current points without updating the account
        let time_elapsed = clock.unix_timestamp.checked_sub(pda_account.last_updated_timestamp)
            .ok_or(StakeError::InvalidTimestamp)?;
        
        let new_points = calculate_points(pda_account.staked_amount, time_elapsed)?;
        let current_total_points = pda_account.total_points.checked_add(new_points)
            .ok_or(StakeError::Overflow)?;
        
        msg!("Current points: {}, Staked amount: {} SOL", 
             current_total_points / 1_000_000, 
             pda_account.staked_amount / LAMPORTS_PER_SOL);
        
        Ok(())
    }
    
}

fn update_points(pda_account: &mut StakeAccount, current_timestamp: i64) -> Result<()> {
    let time_elapsed = current_timestamp
        .checked_sub(pda_account.last_updated_timestamp)
        .ok_or(StakeError::Underflow)?;

    if time_elapsed > 0  && pda_account.staked_amount > 0 {
        let new_points = calculate_points(pda_account.staked_amount, time_elapsed)?;
        pda_account.total_points = pda_account.total_points.checked_add(new_points)
            .ok_or(StakeError::Overflow)?;
    }
    pda_account.last_updated_timestamp = current_timestamp;
    Ok(())
}

fn calculate_points(staked_amount: u64, time_elapsed: i64) -> Result<u64> {
    // Rate: 864 points per SOL per day = 0.01 points per SOL per second
    if staked_amount == 0 || time_elapsed <= 0 {
        return Ok(0);
    }

    // Formula: (staked_lamports * time_seconds * points_per_sol_per_day * PRECISION_FACTOR) / (lamports_per_sol * seconds_per_day)
    
    let staked_amount_u128 = staked_amount as u128;
    let time_elapsed_u128 = time_elapsed as u128;
    
    let numerator = staked_amount_u128
        .checked_mul(time_elapsed_u128)
        .ok_or(StakeError::Overflow)?
        .checked_mul(POINTS_PER_SOL_PER_DAY as u128)
        .ok_or(StakeError::Overflow)?
        .checked_mul(PRECISION_FACTOR)
        .ok_or(StakeError::Overflow)?;
    
    let denominator = (LAMPORTS_PER_SOL as u128)
        .checked_mul(SECONDS_PER_DAY as u128)
        .ok_or(StakeError::Overflow)?;
    
    let points_with_precision = numerator
        .checked_div(denominator)
        .ok_or(StakeError::Overflow)?;
    
    // Remove precision factor
    let final_points = points_with_precision
        .checked_div(PRECISION_FACTOR)
        .ok_or(StakeError::Overflow)?;

    msg!("Points calculation: staked={}, time={}, points={}", 
         staked_amount, time_elapsed, final_points);
    
    Ok(final_points as u64)
}

#[derive(Accounts)]
pub struct CreatePdaAccount <'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 8 + 8 + 8 + 1,
        seeds = [b"pda_account", payer.key().as_ref()],
        bump,
    )]

    pub pda_account: Account<'info, StakeAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"pda_account", payer.key().as_ref()],
        bump = pda_account.bump,
        constraint = pda_account.owner == payer.key() @ StakeError::Unauthorized,
    )]
    pub pda_account: Account<'info, StakeAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"pda_account", user.key().as_ref()],
        bump = pda_account.bump,
        constraint = pda_account.owner == user.key() @ StakeError::Unauthorized,
    )]
    pub pda_account: Account<'info, StakeAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimPoints<'info> {
    #[account(
        mut,
        seeds = [b"pda_account", user.key().as_ref()],
        bump = pda_account.bump,
        constraint = pda_account.owner == user.key() @ StakeError::Unauthorized,
    )]
    pub pda_account: Account<'info, StakeAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetPoints<'info> {
    #[account(
        seeds = [b"pda_account", user.key().as_ref()],
        bump = pda_account.bump,
        constraint = pda_account.owner == user.key() @ StakeError::Unauthorized,
    )]
    pub pda_account: Account<'info, StakeAccount>,

    ///CHECK: The user account that is querying their points
    pub user: UncheckedAccount<'info>,
}

#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub staked_amount: u64,
    pub total_points: u64,
    pub last_updated_timestamp: i64,
    pub bump: u8,
}

#[error_code]
pub enum StakeError {
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Insufficient staked amount")]
    InsufficientStake,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
}