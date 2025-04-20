#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("2JwsoU5RL9MpQvyaydghZfx32ijo49HiLMJAfutPMSEg");

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

      // ctx.accounts.lottery.bump = ctx.bumps.lottery;
      // ctx.accounts.lottery.start_time = start_time;
      // ctx.accounts.lottery.end_time = end_time;
      // ctx.accounts.lottery.ticket_price = price;
      // ctx.accounts.lottery.authority = *ctx.accounts.payer.key;
      // ctx.accounts.lottery.reward_amount = 0;
      // ctx.accounts.lottery.total_tickets = 0;
      // ctx.accounts.lottery.randomness_account = Pubkey::default();
      // ctx.accounts.lottery.winner_claimed = false;

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