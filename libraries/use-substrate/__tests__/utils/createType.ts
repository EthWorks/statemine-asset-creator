import type { Codec, DetectCodec } from '@polkadot/types/types'

import { ApiRx } from '@polkadot/api'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createType = (type: string, params: unknown): DetectCodec<Codec, any> => new ApiRx().createType(type, params)
