import { createType } from 'test-helpers'

import { noop } from '../helpers'

export const mockUseApi = {
  api: {
    createType,
    registry: {
      createType
    },
    tx: {
      assets: {
        create: noop,
        setMetadata: noop
      },
      utility: {}
    }
  }
}
