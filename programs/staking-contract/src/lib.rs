use anchor_lang::system_program;
use anchor_spl::{associated_token::AssociatedToken, token::{MintTo, TokenAccount}};

use {
    anchor_lang::prelude::*,
    anchor_spl::{
        metadata::{
            create_metadata_accounts_v3, mpl_token_metadata::types::DataV2,
            CreateMetadataAccountsV3,Metadata
        },
        token::{Mint, Token, mint_to},
    },
};

declare_id!("3zwUW9CAKvJU4MYaKmuKCUn7CmZYsdAX5FMFt3dqbhnG");

const POINTS_PER_SOL_PER_DAY: u64 = 1_000_000; 
const LAMPORTS_PER_SOL: u64 = 1_000_000_000;
const SECONDS_PER_DAY: u64 = 86_400;

#[program]
pub mod staking_contract {

    use super::*;
    use anchor_spl::token::{self, Burn};
    

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

    pub fn create_token_mint(ctx: Context<CreateToken>, _token_decimals: u8, token_name: String, token_symbol: String, token_uri: String) -> Result<()>{

        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: ctx.accounts.metadata_account.to_account_info(),
                    mint: ctx.accounts.mint_account.to_account_info(),
                    mint_authority: ctx.accounts.payer.to_account_info(),
                    payer: ctx.accounts.payer.to_account_info(),
                    update_authority: ctx.accounts.payer.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            DataV2 { name: (token_name), symbol: (token_symbol), uri: (token_uri), seller_fee_basis_points: 0, creators: None, collection: None, uses: None },
            false, // is_mutable
            true, // is_collection
            None, // collection_details
        )?;
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
                to: ctx.accounts.vault.to_account_info(),
            },
        );

        system_program::transfer(cpi_context, amount)?;

        mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint_account.to_account_info(),
                    to: ctx.accounts.associated_token_account.to_account_info(),
                    authority: ctx.accounts.payer.to_account_info(),
                },
            ),
            amount * 10u64.pow(ctx.accounts.mint_account.decimals as u32)
        )?;

        pda_account.staked_amount = pda_account.staked_amount.checked_add(amount)
            .ok_or(StakeError::Overflow)?;

        msg!("Stake successful! Amount: {}", amount);
        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>,amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);
        require!(ctx.accounts.pda_account.staked_amount >= amount, StakeError::InvalidAmount);

        let pda_account = &mut ctx.accounts.pda_account;

        require!(pda_account.staked_amount >= amount, StakeError::InsufficientStake);

        let current_timestamp = Clock::get()?.unix_timestamp;

        update_points(pda_account, current_timestamp)?;

        let signer_key = ctx.accounts.user.key(); 
        let vault_seeds = &[
            b"vault",
            signer_key.as_ref(),
            &[ctx.bumps.vault],
        ];
        let vault_signer = &[&vault_seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },
            vault_signer,
        );
        system_program::transfer(cpi_context, amount * LAMPORTS_PER_SOL)?;

        let burn_cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint_account.to_account_info(),
                from: ctx.accounts.associated_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );

        token::burn(burn_cpi_context, amount * 10u64.pow(ctx.accounts.mint_account.decimals as u32))?;

        ctx.accounts.pda_account.staked_amount = pda_account.staked_amount.checked_sub(amount)
            .ok_or(StakeError::Underflow)?;
        msg!("Unstake successful! Amount: {}", amount);
        Ok(())
    }

    pub fn claim_points(ctx: Context<ClaimPoints>) -> Result<()> {
        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;
        
        // Update points to current time
        update_points(pda_account, clock.unix_timestamp)?;
        
        let claimable_points = pda_account.total_points / 1_000_000; // Convert micro-points to points
        
        msg!("User has {} claimable points", claimable_points);
        
        // Reset points after claiming (or you could track claimed vs unclaimed separately)
        pda_account.total_points = 0;
        
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
    // Points = (staked_amount_in_sol * time_in_days * points_per_sol_per_day)
    // Using micro-points for precision to avoid floating point
    let points = (staked_amount as u128)
    .checked_mul(time_elapsed as u128)
    .ok_or(StakeError::Overflow)?
    .checked_mul(POINTS_PER_SOL_PER_DAY as u128)
    .ok_or(StakeError::Overflow)?
    .checked_div(LAMPORTS_PER_SOL as u128)
    .ok_or(StakeError::Overflow)?
    .checked_div(SECONDS_PER_DAY as u128)
    .ok_or(StakeError::Overflow)?;

    Ok(points as u64)
}

#[derive(Accounts)]
pub struct CreatePdaAccount<'info> {
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

    #[account(
        init,
        payer = payer,
        seeds = [b"vault", payer.key().as_ref()],
        bump,
        space = 8,
    )]
    pub vault: SystemAccount<'info>,
    
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

    #[account(mut)]
    pub mint_account: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint_account,
        associated_token::authority = payer
    )]
    pub associated_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,

    #[account(
        mut,
        seeds = [b"vault", payer.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,
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

    pub mint_account: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint_account,
        associated_token::authority = user
    )]
    pub associated_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,
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
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction( _token_decimals: u8, token_name: String, token_symbol: String, token_uri: String )]
pub struct CreateToken<'info>{
    #[account(mut)]
    pub payer:Signer<'info>,

    #[account(
        mut,
        seeds=[b"metadata", token_metadata.key().as_ref(), mint_account.key().as_ref()],bump, seeds::program=token_metadata.key()
    )]

    pub metadata_account:UncheckedAccount<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = _token_decimals,
        mint::authority = payer.key()
    )]
    pub mint_account:Account<'info, Mint>,
    pub token_metadata:Program<'info, Metadata>,
    pub token_program:Program<'info, Token>,
    pub system_program:Program<'info, System>,
    pub rent:Sysvar<'info, Rent>
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