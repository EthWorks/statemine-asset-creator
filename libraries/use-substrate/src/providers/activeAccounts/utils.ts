import type { ApiRx } from '@polkadot/api'
import type { Account } from '../accounts'
import type { ActiveAccounts, ActiveAccountsInput } from './types'

import { Chains } from '../../consts'
import { isString } from '../../util/checks'

export function convertAddressesToAccountIds(initialAccounts: ActiveAccountsInput, api?: ApiRx): ActiveAccounts {
  const activeAccounts: ActiveAccounts = {}
  // eslint-disable-next-line array-callback-return
  Object.entries(initialAccounts).map(([chain, { address }]) => {
    activeAccounts[chain as Chains] = isString(address) ? { address: api?.createType('AccountId', address) } : { address: address }
  })

  return activeAccounts
}

export function filterAccountsPresentInExtension(localStorageAccounts: ActiveAccountsInput, extensionAccounts: Account[]): ActiveAccountsInput {
  const accountsPresentInExtension: ActiveAccountsInput = {}
  // eslint-disable-next-line array-callback-return
  Object.entries(localStorageAccounts).map(([chain, { address }]) => {
    const matchedExtensionAccount = extensionAccounts.find(extensionAccount => extensionAccount.address === address?.toString())
    accountsPresentInExtension[chain as Chains] = matchedExtensionAccount ? { address } : undefined
  })

  return accountsPresentInExtension
}
