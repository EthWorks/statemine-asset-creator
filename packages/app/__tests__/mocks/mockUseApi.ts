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
        create: jest.fn(),
        setMetadata: jest.fn(),
        setTeam: jest.fn()
      },
      utility: {
        batchAll: noop
      }
    }
  }
}
