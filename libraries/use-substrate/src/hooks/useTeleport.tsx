import type { AccountId } from '@polkadot/types/interfaces'
import type { UseTransaction } from './types/useTransaction'

import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains } from '../consts'
import { useApi } from './useApi'
import { useParaId } from './useParaId'
import { useTransaction } from './useTransaction'

export type UseTeleport = UseTransaction

export interface TeleportInput {
  account: AccountId,
  chain: Chains
}

export function useTeleport(sender: TeleportInput, recipient: TeleportInput, amount: BN): UseTeleport | undefined {
  const { api } = useApi(sender.chain)
  const senderParaId = useParaId(sender.chain)
  const recipientParaId = useParaId(recipient.chain)
  const isParaTeleport = !!senderParaId

  const call = api?.tx.xcmPallet.teleportAssets

  const params = useMemo(
    () => {
      const destination = isParaTeleport
        ? { parents: 1, interior: 'Here' }
        : { parents: 0, interior: { X1: { Parachain: recipientParaId } } }
      const account = { parents: 0, interior: { X1: { AccountId32: { id: recipient.account?.toHex(), network: 'Any' } } } }
      const asset = [{ id: { Concrete: { parents: 0, interior: 'Here' } }, fun: { Fungible: amount } }]

      return [{ V1: destination }, { V1: account }, { V1: asset }, 0]
    },
    [amount, isParaTeleport, recipient.account, recipientParaId]
  )

  return useTransaction(call, params, sender.account?.toString())
}
