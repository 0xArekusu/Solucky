#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_spl::
{
  associated_token::AssociatedToken, 
  metadata::Metadata, 
  token_interface::
  {
    Mint, TokenAccount, TokenInterface, MintTo, mint_to
  }
};

use anchor_spl::metadata::{
  create_metadata_accounts_v3, 
  CreateMetadataAccountsV3,
  mpl_token_metadata::types::
  {
    Creator, CollectionDetails, DataV2
  }
};

declare_id!("2JwsoU5RL9MpQvyaydghZfx32ijo49HiLMJAfutPMSEg");

#[constant]
pub const NAME: &str = "Token Lottery Ticker #";
#[constant]
pub const SYMBOL: &str = "TLT";
#[constant]
pub const URI: &str = "";

#[program]
pub mod solucky {

    use super::*;


    pub fn initialize_config(
      ctx: Context<InitializeConfig>,
      start_time: u64,
      end_time: u64,
      price: u64,
    ) -> Result<()>{

      *ctx.accounts.lottery = Configuration {
        authority: *ctx.accounts.payer.key,
        ticket_price: price,
        start_time: start_time,
        end_time: end_time,
        randomness_account: Pubkey::default(),
        winner: 0,
        reward_amount: 0,
        total_tickets: 0,
        winner_claimed: false,
        bump: ctx.bumps.lottery,
      };

      Ok(())
    }


    pub fn initialize_lottery(
      ctx: Context<InitializeLottery>,

    ) -> Result<()>{

      let signer_seeds: &[&[&[u8]]] = &[&[
        b"collection_mint".as_ref(),
        &[ctx.bumps.collection_mint],
      ]];

      msg!("Creating Mint account");
      mint_to(
        CpiContext::new_with_signer(
          ctx.accounts.token_program.to_account_info(),
          MintTo{
            mint: ctx.accounts.collection_mint.to_account_info(),
            to: ctx.accounts.collection_token_account.to_account_info(),
            authority: ctx.accounts.collection_mint.to_account_info()
          }, 
          signer_seeds,
        ),
        1
      )?;

      msg!("Creating Metadata account");
      create_metadata_accounts_v3(
        CpiContext::new_with_signer(
          ctx.accounts.token_metadata_program.to_account_info(), 
          CreateMetadataAccountsV3{
            metadata: ctx.accounts.metadata.to_account_info(),
            mint: ctx.accounts.collection_mint.to_account_info(),
            mint_authority: ctx.accounts.collection_mint.to_account_info(),
            payer: ctx.accounts.payer.to_account_info(),
            update_authority: ctx.accounts.system_program.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
          }, 
          &signer_seeds
        ), 
        DataV2{
          name: NAME.to_string(),
          symbol: SYMBOL.to_string(),
          uri: URI.to_string(),
          seller_fee_basis_points: 0,
          creators: Some(vec![Creator{
            address: ctx.accounts.collection_mint.key(),
            verified: false,
            share: 100,
          }]),
          collection: None,
          uses: None,
        }, 
        true, 
        true, 
        Some(CollectionDetails::V1 {size: 0})
      )?;


      Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeConfig<'info>{

  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    init, 
    payer = payer,
    space = 8 + Configuration::INIT_SPACE,
    seeds = [b"lottery".as_ref()],
    bump
  )]
  pub lottery: Account<'info, Configuration>,

  pub system_program: Program<'info, System>,

}

#[account]
#[derive(InitSpace)]
pub struct Configuration{

  pub winner: u64,
  pub winner_claimed: bool,
  pub start_time: u64,
  pub end_time: u64,
  pub reward_amount: u64,
  pub total_tickets: u64,
  pub ticket_price: u64,
  pub authority: Pubkey,
  pub randomness_account: Pubkey,

  pub bump: u8,
}



#[derive(Accounts)]
pub struct InitializeLottery<'info>{

  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    init,
    payer = payer,
    mint::decimals = 0,
    mint::authority = collection_mint,
    mint::freeze_authority = collection_mint,
    seeds = [b"collection_mint".as_ref()],
    bump,
  )]
  pub collection_mint: InterfaceAccount<'info, Mint>,

  #[account(
    init,
    payer = payer,
    token::mint = collection_mint,
    token::authority = collection_token_account,
    seeds = [b"collection_associated_token".as_ref()],
    bump,
  )]
  pub collection_token_account: InterfaceAccount<'info, TokenAccount>,

  #[account(
    mut,
    seeds = [
      b"metadata", 
      token_metadata_program.key().as_ref(), 
      collection_mint.key().as_ref()
    ],
    bump,
    seeds::program = token_metadata_program.key()
  )]
  /// CHECK: This account is checked by the metadata smart contract
  pub metadata: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [
      b"metadata", 
      token_metadata_program.key().as_ref(), 
      collection_mint.key().as_ref(),
      b"edition",
    ],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by the metadata smart contract
  pub master_edition: UncheckedAccount<'info>,


  pub system_program: Program<'info, System>,
  pub token_program: Interface<'info, TokenInterface>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub token_metadata_program: Program<'info, Metadata>,
  pub rent: Sysvar<'info, Rent>,
}