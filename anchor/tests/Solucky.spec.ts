import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Solucky } from '../target/types/Solucky'

describe('Solucky', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Solucky as Program<Solucky>

  const SoluckyKeypair = Keypair.generate()

  it('Initialize Solucky', async () => {
    await program.methods
      .initialize()
      .accounts({
        Solucky: SoluckyKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([SoluckyKeypair])
      .rpc()

    const currentCount = await program.account.Solucky.fetch(SoluckyKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Solucky', async () => {
    await program.methods.increment().accounts({ Solucky: SoluckyKeypair.publicKey }).rpc()

    const currentCount = await program.account.Solucky.fetch(SoluckyKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Solucky Again', async () => {
    await program.methods.increment().accounts({ Solucky: SoluckyKeypair.publicKey }).rpc()

    const currentCount = await program.account.Solucky.fetch(SoluckyKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Solucky', async () => {
    await program.methods.decrement().accounts({ Solucky: SoluckyKeypair.publicKey }).rpc()

    const currentCount = await program.account.Solucky.fetch(SoluckyKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set Solucky value', async () => {
    await program.methods.set(42).accounts({ Solucky: SoluckyKeypair.publicKey }).rpc()

    const currentCount = await program.account.Solucky.fetch(SoluckyKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the Solucky account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        Solucky: SoluckyKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.Solucky.fetchNullable(SoluckyKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
