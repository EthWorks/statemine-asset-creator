import { encodeAddress } from '@polkadot/keyring'
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types'

import { Account } from '../types'

export const mapObservableToAccounts = (observableAccounts: SubjectInfo | undefined, ss58Format?: number): Account[] => {
  return Object.values(observableAccounts || []).map(({ json }) => ({
    address: encodeAddress(json.address, ss58Format),
    name: json.meta.name
  }))
}
