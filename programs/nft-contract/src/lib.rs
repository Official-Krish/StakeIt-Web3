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


    pub fn buy_nft_with_sol(ctx: Context<BuyNftWithSOL>, _id: u64, amount: u64) -> Result<()> {
        let nft_data = &ctx.accounts.nft_data;
        require!(amount > 0, CustomError::InvalidAmount);
        require!(amount >= nft_data.base_price, CustomError::InvalidPrice);
        require!(
            ctx.accounts.seller_token_account.amount >= 1,
            CustomError::InvalidAmount
        );
        
        let royalty = (nft_data.base_price * 5) / 100;

        // Transfer main amount to seller
        let ix1 = system_instruction::transfer(
            ctx.accounts.buyer.key,
            ctx.accounts.seller.key,
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix1,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.seller.to_account_info(),
            ],
        )?;
        
        let ix2 = system_instruction::transfer(
            ctx.accounts.buyer.key,
            ctx.accounts.royalty_recipient.key,
            royalty,
        );
        anchor_lang::solana_program::program::invoke(
            &ix2,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.royalty_recipient.to_account_info(),
            ],
        )?;

        // Transfer NFT from seller to buyer
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.seller_token_account.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
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
        space = 8 + std::mem::size_of::<NftData>()
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
    #[account(mut, address = ADMIN_PUBKEY)] 
    pub admin: Signer<'info>,
    #[account(mut)] 
    pub buyer: Signer<'info>,
    #[account(mut)] 
    pub seller: Signer<'info>,

    #[account(
        seeds = [b"nft_data", mint.key().as_ref()],
        bump = nft_data.bump,
    )]
    pub nft_data: Account<'info, NftData>,

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

    #[account(mut, address = ADMIN_PUBKEY)]
    pub royalty_recipient: Signer<'info>,

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


pub const ADMIN_PUBKEY: Pubkey = pubkey!("D8kz4JbFHtVcyE8AAcZGLeA28TwNm4JjpDaLBeqDzTwn");