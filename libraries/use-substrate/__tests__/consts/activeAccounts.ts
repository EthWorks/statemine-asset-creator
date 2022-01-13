import type { Account, ActiveAccount } from '../../src'

import { kusamaCreateType } from 'test-helpers'

import { ALICE_ID, BOB, BOB_ID } from './addresses'

export const BOB_ACTIVE_ACCOUNT_WITHOUT_NAME: ActiveAccount = { address: BOB_ID }
export const BOB_ACTIVE_ACCOUNT: ActiveAccount = { address: BOB_ID, name: 'Bob' }
export const BOB_ACCOUNT_WITHOUT_NAME: Account = { address: BOB, name: undefined }
export const ALICE_ACTIVE_ACCOUNT_WITHOUT_NAME: ActiveAccount = { address: ALICE_ID }
export const BOB_ACTIVE_ACCOUNT_KUSAMA_FORMAT: ActiveAccount = { address: kusamaCreateType('AccountId', BOB), name: undefined }
