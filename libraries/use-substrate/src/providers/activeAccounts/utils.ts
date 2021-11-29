import type { ApiRx } from '@polkadot/api'
import type { ActiveAccounts, ActiveAccountsInput } from './types'

import { Chains } from '../../consts'
import { isString } from '../../util/checks'

export function convertAddressesToAccountIds(initialAccounts: ActiveAccountsInput, api?: ApiRx): ActiveAccounts {
  const activeAccounts: ActiveAccounts = {}
  Object.entries(initialAccounts).map(([chain, accountId]) => {
    activeAccounts[chain as Chains] = isString(accountId) ? api?.createType('AccountId', accountId) : accountId
  })

  return activeAccounts
}
