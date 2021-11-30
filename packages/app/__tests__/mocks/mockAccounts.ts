import { createType } from 'test-helpers'

export const aliceAccount = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', name: 'ALICE' }
export const bobAccount = { address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', name: 'BOB' }
export const charlieAccount = { address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy', name: 'CHARLIE' }

export const aliceAccountId = createType('AccountId', aliceAccount.address)
export const bobAccountId = createType('AccountId', bobAccount.address)
export const charlieAccountId = createType('AccountId', charlieAccount.address)

export const mockAccounts = [aliceAccount, bobAccount, charlieAccount]

export const shortenedBobAddress = '5FHneW...M694ty'
export const shortenedAliceAddress = '5Grwva...GKutQY'
export const shortenedCharlieAddress = '5DAAnr...3PTXFy'
