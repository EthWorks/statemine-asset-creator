import { createType } from 'test-helpers'

export const mockUseApi = {
  api: {
    createType,
    registry: {
      createType
    },
    tx: {
      assets: {
        create: () => {/**/
        },
        setMetadata: () => {/**/
        },
      },
      utility: {}
    }
  }
}
