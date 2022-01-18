import type { UseAccounts } from 'use-substrate'

import { mockAccounts } from './mockAccounts'

export const mockWeb3Enable = jest.fn().mockResolvedValue('')
export const mockUseAccounts: UseAccounts = {
  allAccounts: mockAccounts,
  hasAccounts: true,
  web3Enable: mockWeb3Enable,
  extensionStatus: 'Loaded'
}
