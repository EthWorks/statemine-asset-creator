import type { Codec, DetectCodec } from '@polkadot/types/types'

import { ApiRx } from '@polkadot/api'

let apiRx: ApiRx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createType = (type: string, params: unknown): DetectCodec<Codec, any> => {
  if (!apiRx) {
    apiRx = new ApiRx()
  }

  return apiRx.createType(type, params)
}
