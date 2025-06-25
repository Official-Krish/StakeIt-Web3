use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("EbbermosrWwxzWb3R4LmiXsXvdHV1JEkYr1e3mwDWjQv");

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
        pda_account.accrued_reward = 0;

        msg!("PDA Account created successfully!");
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);
        let pda_account = &mut ctx.accounts.pda_account;

        let current_timestamp = Clock::get()?.unix_timestamp;

        // Update points and rewards before changing staked amount
        update_points_and_rewards(pda_account, current_timestamp)?;

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

        msg!("Stake successful! Amount: {} lamports, New total: {} lamports", 
             amount, pda_account.staked_amount);
        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);
        let pda_account = &mut ctx.accounts.pda_account;

        require!(pda_account.staked_amount >= amount, StakeError::InsufficientStake);

        let current_timestamp = Clock::get()?.unix_timestamp;

        // Update points and rewards before unstaking
        update_points_and_rewards(pda_account, current_timestamp)?;

        // Transfer staked amount back to user
        **pda_account.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += amount;

        pda_account.staked_amount = pda_account.staked_amount.checked_sub(amount)
            .ok_or(StakeError::Underflow)?;

        // Transfer accumulated rewards if any
        if pda_account.accrued_reward > 0 {
            let vault_balance = ctx.accounts.vault_account.to_account_info().lamports();
            require!(vault_balance >= pda_account.accrued_reward, StakeError::InsufficientVaultFunds);
            
            **ctx.accounts.vault_account.to_account_info().try_borrow_mut_lamports()? -= pda_account.accrued_reward;
            **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += pda_account.accrued_reward;
            
            msg!("Rewards claimed: {} lamports", pda_account.accrued_reward);
            pda_account.accrued_reward = 0;
        }

        msg!("Unstake successful! Amount: {} lamports", amount);
        Ok(())
    }

    pub fn claim_points(ctx: Context<ClaimPoints>, amount: u32) -> Result<()> {
        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;
        
        // Update points to current time
        update_points_and_rewards(pda_account, clock.unix_timestamp)?;
        
        // Convert points to actual value (divide by precision factor)
        let claimable_points = pda_account.total_points / PRECISION_FACTOR as u64;
        
        msg!("User has {} claimable points", claimable_points);
        require!(claimable_points >= amount as u64, StakeError::InsufficientPoints);
        
        // Subtract claimed points (convert amount back to precision)
        let points_to_subtract = (amount as u128).checked_mul(PRECISION_FACTOR)
            .ok_or(StakeError::Overflow)? as u64;
        
        pda_account.total_points = pda_account.total_points.checked_sub(points_to_subtract)
            .ok_or(StakeError::Underflow)?;
        
        msg!("Claimed {} points successfully", amount);
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
        
        // Calculate current rewards
        let new_rewards = calculate_reward(pda_account.staked_amount, time_elapsed)?;
        let current_total_rewards = pda_account.accrued_reward.checked_add(new_rewards)
            .ok_or(StakeError::Overflow)?;
        
        // Display points without precision factor
        let display_points = current_total_points / PRECISION_FACTOR as u64;
        
        msg!("Current points: {}, Staked amount: {} SOL, Accrued rewards: {} lamports", 
             display_points,
             pda_account.staked_amount / LAMPORTS_PER_SOL,
             current_total_rewards);
        
        Ok(())
    }

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        let vault_account = &mut ctx.accounts.vault_account;
        vault_account.bump = ctx.bumps.vault_account;
        vault_account.owner = ctx.accounts.admin.key();

        msg!("Vault initialized successfully!");
        Ok(())
    }

    pub fn fund_vault(ctx: Context<FundVault>, amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.admin.to_account_info(),
                to: ctx.accounts.vault_account.to_account_info(),
            },
        );

        system_program::transfer(cpi_context, amount)?;

        msg!("Vault funded successfully! Amount: {} lamports", amount);
        Ok(())
    }
}

fn update_points_and_rewards(pda_account: &mut StakeAccount, current_timestamp: i64) -> Result<()> {
    let time_elapsed = current_timestamp
        .checked_sub(pda_account.last_updated_timestamp)
        .ok_or(StakeError::InvalidTimestamp)?;

    if time_elapsed > 0 && pda_account.staked_amount > 0 {
        let new_points = calculate_points(pda_account.staked_amount, time_elapsed)?;
        pda_account.total_points = pda_account.total_points.checked_add(new_points)
            .ok_or(StakeError::Overflow)?;

        let new_reward = calculate_reward(pda_account.staked_amount, time_elapsed)?;
        pda_account.accrued_reward = pda_account.accrued_reward.checked_add(new_reward)
            .ok_or(StakeError::Overflow)?;

        msg!("Updated - Points added: {}, Rewards added: {} lamports", 
             new_points / PRECISION_FACTOR as u64, new_reward);
    }
    
    pda_account.last_updated_timestamp = current_timestamp;
    Ok(())
}

fn calculate_points(staked_amount: u64, time_elapsed: i64) -> Result<u64> {
    if staked_amount == 0 || time_elapsed <= 0 {
        return Ok(0);
    }

    let staked_amount_u128 = staked_amount as u128;
    let time_elapsed_u128 = time_elapsed as u128;
    
    // Calculate: (staked_lamports * time_seconds * points_per_sol_per_day * PRECISION_FACTOR) / (lamports_per_sol * seconds_per_day)
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
    
    let final_points = points_with_precision as u64;

    msg!("Points calculation: staked={} lamports, time={} seconds, points_with_precision={}", 
         staked_amount, time_elapsed, final_points);
    
    Ok(final_points)
}

fn calculate_reward(staked_amount: u64, time_elapsed: i64) -> Result<u64> {
    if staked_amount == 0 || time_elapsed <= 0 {
        return Ok(0);
    }

    const ANNUAL_RATE_NUMERATOR: u128 = 7;  // 7% APY
    const ANNUAL_RATE_DENOMINATOR: u128 = 100;
    const SECONDS_PER_YEAR: u128 = 31_536_000; 

    let time_elapsed = time_elapsed as u128;
    let staked = staked_amount as u128;

    let reward = staked
        .checked_mul(ANNUAL_RATE_NUMERATOR)
        .ok_or(StakeError::Overflow)?
        .checked_mul(time_elapsed)
        .ok_or(StakeError::Overflow)?
        .checked_div(ANNUAL_RATE_DENOMINATOR)
        .ok_or(StakeError::Overflow)?
        .checked_div(SECONDS_PER_YEAR)
        .ok_or(StakeError::Overflow)?;

    msg!("Reward calculation: staked={} lamports, time={} seconds, reward={} lamports", 
         staked_amount, time_elapsed, reward);

    Ok(reward as u64) 
}

#[derive(Accounts)]
pub struct CreatePdaAccount <'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + 32 + 8 + 8 + 8 + 8 + 1,
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

    ///CHECK: Admin account for vault transfers
    pub admin: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"vault_account", admin.key().as_ref(), b"vault"],
        bump = vault_account.bump,
        constraint = vault_account.owner == admin.key() @ StakeError::Unauthorized,
    )]
    pub vault_account: Account<'info, VaultAccount>,
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

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init_if_needed,
        payer = admin,
        space = 8 + 32 + 1,
        seeds = [b"vault_account", admin.key().as_ref(), b"vault"],
        bump,
    )]
    pub vault_account: Account<'info, VaultAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FundVault<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault_account", admin.key().as_ref(), b"vault"],
        bump = vault_account.bump,
        constraint = vault_account.owner == admin.key() @ StakeError::Unauthorized,
    )]  
    pub vault_account: Account<'info, VaultAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub staked_amount: u64,
    pub total_points: u64,
    pub accrued_reward: u64,
    pub last_updated_timestamp: i64,
    pub bump: u8,
}

#[account]
pub struct VaultAccount {
    pub owner: Pubkey,
    pub bump: u8,
}

#[error_code]
pub enum StakeError {
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Insufficient staked amount")]
    InsufficientStake,
    #[msg("Insufficient points to claim")]
    InsufficientPoints,
    #[msg("Insufficient vault funds")]
    InsufficientVaultFunds,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
}