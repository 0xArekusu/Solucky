import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Solucky } from '../target/types/solucky'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

describe('Solucky', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const wallet = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Solucky as Program<Solucky>

  const SoluckyKeypair = Keypair.generate()

  it('Should initialize', async () => {

    const blockhashWithContext = await provider.connection.getLatestBlockhash();


    const initConfigIx = await program.methods
      .initializeConfig(
        new anchor.BN(0),
        new anchor.BN(1822712025),
        new anchor.BN(10000),
      )
      .instruction();

      const initConfigTx = new anchor.web3.Transaction(
        {
          feePayer: provider.wallet.publicKey,
          blockhash: blockhashWithContext.blockhash,
          lastValidBlockHeight: blockhashWithContext.lastValidBlockHeight,
        }
      ).add(initConfigIx);

      const initConfigSignature = await anchor.web3.sendAndConfirmTransaction(
        provider.connection,
        initConfigTx,
        [wallet.payer],
        {skipPreflight: true}
      );

      console.log('Init config signature', initConfigSignature);


      const initLotteryIx = await program.methods
      .initializeLottery()
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .instruction();

      const initLotteryTx = new anchor.web3.Transaction(
        {
          feePayer: provider.wallet.publicKey,
          blockhash: blockhashWithContext.blockhash,
          lastValidBlockHeight: blockhashWithContext.lastValidBlockHeight,
        }
      ).add(initLotteryIx);

      const initLotterySignature = await anchor.web3.sendAndConfirmTransaction(
        provider.connection,
        initLotteryTx,
        [wallet.payer],
        {skipPreflight: true}
      );

      console.log('Init lottery signature', initLotterySignature);

  })
})
