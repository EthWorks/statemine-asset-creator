import type { AccountId } from '@polkadot/types/interfaces'

import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'

export function isAddressValid(address: string | AccountId): boolean {
  try {
    encodeAddress(
      isHex(address)
        ? hexToU8a(address)
        : decodeAddress(address)
    )

    return true
  } catch (error) {
    return false
  }
}
