import type { ApiRx } from '@polkadot/api'
import type { Account } from '../accounts'
import type { ActiveAccounts, ActiveAccountsInput } from './types'

import { Chains } from '../../consts'
import { isString } from '../../util/checks'

export function convertAddressesToAccountIds(initialAccounts: ActiveAccountsInput, api?: ApiRx): ActiveAccounts {
  const activeAccounts: ActiveAccounts = {}
  // eslint-disable-next-line array-callback-return
  Object.entries(initialAccounts).map(([chain, accountId]) => {
    activeAccounts[chain as Chains] = isString(accountId) ? api?.createType('AccountId', accountId) : accountId
  })

  return activeAccounts
}

export function filterAccountsPresentInExtension(localStorageAccounts: ActiveAccountsInput, extensionAccounts: Account[]): ActiveAccountsInput {
  const accountsPresentInExtension: ActiveAccountsInput = {}
  // eslint-disable-next-line array-callback-return
  Object.entries(localStorageAccounts).map(([chain, localStorageAccountId]) => {
    const matchedExtensionAccount = extensionAccounts.find(extensionAccount => extensionAccount.address === localStorageAccountId.toString())
    accountsPresentInExtension[chain as Chains] = matchedExtensionAccount ? localStorageAccountId : undefined
  })

  return accountsPresentInExtension
}
