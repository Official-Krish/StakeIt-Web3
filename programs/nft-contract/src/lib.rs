use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::metadata::{
    create_master_edition_v3, create_metadata_accounts_v3, CreateMasterEditionV3,
    CreateMetadataAccountsV3, Metadata,
};
use anchor_spl::token::{mint_to, transfer, Mint, MintTo, Token, TokenAccount, Transfer};
use mpl_token_metadata::types::{DataV2};
use anchor_lang::solana_program::system_instruction;


declare_id!("7mEjdqGfFBtH3T6qWHBxTLwq2PoaYjZjr4zF2w8kZ5FY");

#[program]
pub mod nft_contract {
    use super::*;

    pub fn create_nft(
        ctx: Context<CreateNft>,
        _id: u64,
        name: String,
        symbol: String,
        uri: String,
        point_price: u64,
        base_price: u64,
    ) -> Result<()> {
        mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    authority: ctx.accounts.user.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                },
            ),
            1,
        )?;

        // Metadata
        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    payer: ctx.accounts.user.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    metadata: ctx.accounts.nft_metadata.to_account_info(),
                    mint_authority: ctx.accounts.user.to_account_info(),
                    update_authority: ctx.accounts.user.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            DataV2 {
                name,
                symbol,
                uri,
                seller_fee_basis_points: 0,
                creators: None,
                collection: None,
                uses: None,
            },
            true,
            true,
            None,
        )?;

        // Master Edition
        create_master_edition_v3(
            CpiContext::new(
                ctx.accounts.metadata_program.to_account_info(),
                CreateMasterEditionV3 {
                    edition: ctx.accounts.master_edition_account.to_account_info(),
                    payer: ctx.accounts.user.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    metadata: ctx.accounts.nft_metadata.to_account_info(),
                    mint_authority: ctx.accounts.user.to_account_info(),
                    update_authority: ctx.accounts.user.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    token_program: ctx.accounts.token_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            None,
        )?;

        // Store custom data
        let data = &mut ctx.accounts.nft_data;
        data.mint = ctx.accounts.mint.key();
        data.point_price = point_price;
        data.base_price = base_price;
        data.bump = ctx.bumps.nft_data;
        Ok(())
    }


    pub fn buy_nft_with_sol(ctx: Context<BuyNftWithSOL>, _id: u64) -> Result<()> {
        let listing = &ctx.accounts.listing;
        let amount = listing.price;

        require!(amount > 0, CustomError::InvalidAmount);
        require!(
            ctx.accounts.seller_token_account.amount >= 1,
            CustomError::InvalidAmount
        );
        

        // Transfer main amount to seller
        let ix1 = system_instruction::transfer(
            ctx.accounts.buyer.key,
            &listing.seller,
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix1,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.seller.to_account_info(),
            ],
        )?;

        let id = _id;

        // Transfer NFT from pda to buyer
        let id_bytes = id.to_le_bytes();
        let marketplace_seeds = &[
            b"marketplace", 
            id_bytes.as_ref(), 
            listing.seller.as_ref(),
            &[ctx.bumps.marketplace_authority]
        ];
        let signer_seeds = &[&marketplace_seeds[..]];

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.seller_token_account.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
                    authority: ctx.accounts.marketplace_authority.to_account_info(),
                },
                signer_seeds
            ),
            1,
        )?;
        
        let listing_account_info = ctx.accounts.listing.to_account_info();
        let seller_account_info = ctx.accounts.seller.to_account_info();
        
        **seller_account_info.try_borrow_mut_lamports()? += listing_account_info.lamports();
        **listing_account_info.try_borrow_mut_lamports()? = 0;
        Ok(())
    }

    
    pub fn list_nft(ctx: Context<ListNft>, price: u64, _id: u64) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        listing.seller = ctx.accounts.seller.key();
        listing.price = price;
        listing.bump = ctx.bumps.listing;


        // Approve the marketplace PDA as delegate for the seller's token account
        anchor_spl::token::approve(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Approve {
                    to: ctx.accounts.seller_token_account.to_account_info(),
                    delegate: ctx.accounts.marketplace_authority.to_account_info(),
                    authority: ctx.accounts.seller.to_account_info(),
                },
            ),
            1, 
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct CreateNft<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        mint::decimals = 0,
        mint::authority = user.key(),
        mint::freeze_authority = user.key(),
        seeds = [b"mint", user.key().as_ref(), id.to_le_bytes().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = user
    )]
    pub token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = user,
        seeds = [b"nft_data", mint.key().as_ref()],
        bump,
        space = 8 + 32 + 8 + 8 + 1
    )]
    pub nft_data: Account<'info, NftData>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub metadata_program: Program<'info, Metadata>,

    #[account(
        mut,
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            mint.key().as_ref(),
        ],
        bump,
        seeds::program = metadata_program.key()
    )]
    /// CHECK: Metadata account
    pub nft_metadata: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            mint.key().as_ref(),
            b"edition"
        ],
        bump,
        seeds::program = metadata_program.key()
    )]
    /// CHECK: Master edition account
    pub master_edition_account: UncheckedAccount<'info>,
}

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct BuyNftWithSOL<'info> {
    #[account(mut)] 
    pub buyer: Signer<'info>,

    /// CHECK: Seller account - validated through listing
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"listing", id.to_le_bytes().as_ref(), seller.key().as_ref()],
        bump,
        close = seller
    )]
    pub listing: Account<'info, ListingData>,

    /// CHECK: Admin account for mint seeds
    pub admin: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"mint", admin.key().as_ref(), id.to_le_bytes().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = seller
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = mint,
        associated_token::authority = buyer
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    /// CHECK: This is the marketplace PDA that acts as delegate
    #[account(
        seeds = [b"marketplace", id.to_le_bytes().as_ref(), seller.key().as_ref()],
        bump
    )]
    pub marketplace_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NftData {
    pub mint: Pubkey,
    pub point_price: u64,
    pub base_price: u64,
    pub bump: u8,
}

#[error_code]
pub enum CustomError {
    #[msg("Invalid amount provided.")]
    InvalidAmount,
    #[msg("Invalid price provided.")]
    InvalidPrice,
}

#[derive(Accounts)]
#[instruction(price: u64, id: u64)]
pub struct ListNft<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    
    #[account(
        init_if_needed,
        payer = seller,
        space = 8 + 32 + 8 + 1,
        seeds = [b"listing", id.to_le_bytes().as_ref(), seller.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, ListingData>,

    /// CHECK: Admin account for mint seeds
    pub admin: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"mint", admin.key().as_ref(), id.to_le_bytes().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = seller
    )]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is the marketplace PDA that acts as delegate
    #[account(
        seeds = [b"marketplace", id.to_le_bytes().as_ref(), seller.key().as_ref()],
        bump
    )]
    pub marketplace_authority: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct ListingData {
    pub seller: Pubkey,
    pub price: u64,
    pub bump: u8,
}



pub const ADMIN_PUBKEY: Pubkey = pubkey!("D8kz4JbFHtVcyE8AAcZGLeA28TwNm4JjpDaLBeqDzTwn");