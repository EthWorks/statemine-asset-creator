import type { InjectedWindowProvider } from '@polkadot/extension-inject/types'

type Error = 'EXTENSION'

declare global {
  interface Window {
    injectedWeb3?: Record<string, InjectedWindowProvider>;
  }
}
export type Address = string

export interface Account {
  name: string | undefined
  address: Address
}

export type ExtensionStatus = 'Loading' | 'Available' | 'Unavailable' | 'Enabled' | 'Loaded'

export interface UseAccounts {
  extensionStatus: ExtensionStatus;
  web3Enable: () => Promise<void>
  allAccounts: Account[]
  hasAccounts: boolean
  error?: Error
}
