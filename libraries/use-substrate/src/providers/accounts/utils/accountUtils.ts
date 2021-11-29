import { SubjectInfo } from '@polkadot/ui-keyring/observable/types'

import { Account } from '../types'

export const mapObservableToAccounts = (observableAccounts: SubjectInfo | undefined): Account[] => {
  return Object.values(observableAccounts || []).map(({ json }) => ({
    address: json.address,
    name: json.meta.name
  }))
}
