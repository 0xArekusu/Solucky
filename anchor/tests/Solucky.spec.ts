import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Solucky } from '../target/types/solucky'

describe('Solucky', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const wallet = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Solucky as Program<Solucky>

  const SoluckyKeypair = Keypair.generate()

  it('Should initialize configuration', async () => {
    const initConfigTx = await program.methods
      .initializeConfig(
        new anchor.BN(0),
        new anchor.BN(1822712025),
        new anchor.BN(10000),
      ).instruction();

      const blockhashWithContext = await provider.connection.getLatestBlockhash();
      const tx = new anchor.web3.Transaction(
        {
          feePayer: provider.wallet.publicKey,
          blockhash: blockhashWithContext.blockhash,
          lastValidBlockHeight: blockhashWithContext.lastValidBlockHeight,
        }
      ).add(initConfigTx);

      const signature = await anchor.web3.sendAndConfirmTransaction(
        provider.connection,
        tx,
        [wallet.payer],
        {skipPreflight: true}
      );

      console.log('Your transaction signature', "signature");
  })
})
