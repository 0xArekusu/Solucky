'use client'

import { getSoluckyProgram, getSoluckyProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useSoluckyProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSoluckyProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getSoluckyProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['Solucky', 'all', { cluster }],
    queryFn: () => program.account.Solucky.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['Solucky', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ Solucky: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useSoluckyProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSoluckyProgram()

  const accountQuery = useQuery({
    queryKey: ['Solucky', 'fetch', { cluster, account }],
    queryFn: () => program.account.Solucky.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['Solucky', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ Solucky: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['Solucky', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ Solucky: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['Solucky', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ Solucky: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['Solucky', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ Solucky: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
