type Error = 'EXTENSION'

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
