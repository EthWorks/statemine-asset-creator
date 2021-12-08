import { ALICE } from '../consts'

export const mockExtensionDapp = {
  web3Enable: async () => ({}),
  web3AccountsSubscribe: async () => ({}),
  web3Accounts: async () => [],
  web3FromAddress: () => ({
    signer: ALICE
  })
}
