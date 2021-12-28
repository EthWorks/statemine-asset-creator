import type { SubmittableExtrinsicFunction } from '@polkadot/api/types'
import type { AccountId } from '@polkadot/types/interfaces'
import type { XcmVersionedMultiLocation } from '@polkadot/types/lookup'
import type { UseTransaction } from './types/useTransaction'

import BN from 'bn.js'
import { useMemo } from 'react'

import { Chains } from '../consts'
import { isFunction } from '../util/checks'
import { getTeleportWeight } from '../util/getTeleportWeight'
import { useApi } from './useApi'
import { useParaId } from './useParaId'
import { useTransaction } from './useTransaction'

export type UseTeleport = UseTransaction

export interface TeleportInput {
  account: AccountId | undefined,
  chain: Chains
}

const XCM_LOC = ['xcm', 'xcmPallet', 'polkadotXcm']
const XCM_FNS = ['limitedTeleportAssets', 'teleportAssets']

export function useTeleport(sender: TeleportInput, recipient: TeleportInput, amount: BN): UseTeleport | undefined {
  const { api } = useApi(sender.chain)
  const senderParaId = useParaId(sender.chain)
  const recipientParaId = useParaId(recipient.chain)
  const isParaTeleport = !!senderParaId

  const [destWeight, call] = useMemo(
    (): [number, SubmittableExtrinsicFunction<'rxjs'> | undefined] => {
      const m = XCM_LOC.filter((x) => api?.tx[x] && XCM_FNS.some((f) => isFunction(api.tx[x][f])))[0]
      const f = XCM_FNS.filter((f) => isFunction(api?.tx[m][f]))[0]

      return [
        getTeleportWeight(),
        api?.tx[m][f]
      ]
    },
    [api]
  )

  const params = useMemo(
    () => {
      // From Polkadot runtime 9110 (no destination weight)
      // Get first item, it should have V0, V1, ...
      const firstType = call && api?.createType<XcmVersionedMultiLocation>(call.meta.args[0].type.toString())
      const isCurrent = firstType?.defKeys.includes('V1')

      const dst = isParaTeleport
        ? { X1: 'Parent' }
        : { X1: { ParaChain: recipientParaId } }
      const acc = { X1: { AccountId32: { id: recipient.account?.toHex(), network: 'Any' } } }
      const ass = isParaTeleport
        ? [{ ConcreteFungible: { amount, id: { X1: 'Parent' } } }]
      // forgo id - 'Here' for 9100, 'Null' for 9110 (both is the default enum value)
        : [{ ConcreteFungible: { amount } }]

      return isCurrent
        ? call?.meta.args.length === 5
        // with weight
          ? call.method === 'limitedTeleportAssets'
            ? [{ V0: dst }, { V0: acc }, { V0: ass }, 0, { Unlimited: null }]
            : [{ V0: dst }, { V0: acc }, { V0: ass }, 0, destWeight]
        // without weight
          : [{ V0: dst }, { V0: acc }, { V0: ass }, 0]
        : [dst, acc, ass, destWeight]
    },
    [api, amount, call, destWeight, isParaTeleport, recipient.account, recipientParaId]
  )

  return useTransaction(call, params, sender.account?.toString())
}
