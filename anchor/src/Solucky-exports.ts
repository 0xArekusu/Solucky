// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SoluckyIDL from '../target/idl/Solucky.json'
import type { Solucky } from '../target/types/Solucky'

// Re-export the generated IDL and type
export { Solucky, SoluckyIDL }

// The programId is imported from the program IDL.
export const SOLUCKY_PROGRAM_ID = new PublicKey(SoluckyIDL.address)

// This is a helper function to get the Solucky Anchor program.
export function getSoluckyProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...SoluckyIDL, address: address ? address.toBase58() : SoluckyIDL.address } as Solucky, provider)
}

// This is a helper function to get the program ID for the Solucky program depending on the cluster.
export function getSoluckyProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Solucky program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return SOLUCKY_PROGRAM_ID
  }
}
