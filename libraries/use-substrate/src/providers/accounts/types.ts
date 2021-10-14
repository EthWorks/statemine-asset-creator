import { InjectedWindowProvider } from '@polkadot/extension-inject/types'

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

export interface UseAccounts {
  allAccounts: Account[]
  hasAccounts: boolean
  error?: Error
}
