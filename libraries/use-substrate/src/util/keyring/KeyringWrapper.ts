import type { Keyring } from '@polkadot/ui-keyring'

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'

import { DEFAULT_SS58_FORMAT } from '../../consts'

export class KeyringWrapper {
  public keyring: Keyring

  constructor(keyring: Keyring) {
    this.keyring = keyring
  }

  isLoaded = (): boolean => {
    try {
      return !!this.keyring?.keyring
    } catch {
      return false
    }
  }

  injectAccountsAddedToExtension = (accounts: InjectedAccountWithMeta[]): void => {
    accounts.forEach(({ address, meta }) => this.keyring.addExternal(address, meta))
  }

  forgetAccountsRemovedFromExtension = (allInjectedAccounts: InjectedAccountWithMeta[]): void => {
    const accountsFromKeyring = this.keyring.getAccounts()
    const allInjectedAddresses = allInjectedAccounts.map(({ address }) => address)

    accountsFromKeyring.forEach(({ address: addressFromKeyring }) => {
      if (!allInjectedAddresses.includes(addressFromKeyring)) {
        this.keyring.forgetAccount(addressFromKeyring)
      }
    })
  }

  loadAccounts = (injectedAccounts: InjectedAccountWithMeta[]): void => {
    this.keyring.loadAll({ isDevelopment: false, ss58Format: DEFAULT_SS58_FORMAT }, injectedAccounts)
  }
}
