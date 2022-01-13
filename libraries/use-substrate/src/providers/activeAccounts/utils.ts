import type { ApiRx } from '@polkadot/api'
import type { Account } from '../accounts'
import type { ActiveAccounts, ActiveAccountsInput } from './types'

import { addressEq, encodeAddress } from '@polkadot/util-crypto'

import { Chains } from '../../consts'
import { isString } from '../../util/checks'

export function convertAddressesToAccountIds(initialAccounts: ActiveAccountsInput, api?: ApiRx): ActiveAccounts {
  const activeAccounts: ActiveAccounts = {}
  if (!api) return activeAccounts
  // eslint-disable-next-line array-callback-return
  Object.entries(initialAccounts).map(([chain, account]) => {
    if (account) {
      const { address, name } = account
      activeAccounts[chain as Chains] = { address: (isString(address) ? api.createType('AccountId', address) : address), name }
    } else {
      activeAccounts[chain as Chains] = undefined
    }
  })

  return activeAccounts
}

export function filterAccountsPresentInExtension(localStorageAccounts: ActiveAccountsInput, extensionAccounts: Account[]): ActiveAccountsInput {
  const accountsPresentInExtension: ActiveAccountsInput = {}
  // eslint-disable-next-line array-callback-return
  Object.entries(localStorageAccounts).map(([chain, account]) => {
    if (account) {
      const { address, name } = account
      const matchedExtensionAccount = extensionAccounts.find(extensionAccount => addressEq(extensionAccount.address, address))
      accountsPresentInExtension[chain as Chains] = matchedExtensionAccount ? { address, name } : undefined
    }
  })

  return accountsPresentInExtension
}

export function writeToLocalStorage(updatedActiveAccounts: ActiveAccountsInput): void {
  const result: ActiveAccountsInput = {}
  ;(Object.entries(updatedActiveAccounts)).forEach(([chain, account]) => {
    if (account !== undefined) {
      result[chain as Chains] = { address: encodeAddress(account.address), name: account.name }
    }
  })

  localStorage.setItem('activeAccounts', JSON.stringify(result))
}
