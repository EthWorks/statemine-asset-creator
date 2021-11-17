function patchDetectPackage (): void {
  function getObjectToPatch () {
    if (!global.__polkadotjs) {
      global.__polkadotjs = {}
    }

    return global.__polkadotjs
  }

  if (getObjectToPatch().isProxy) {
    return
  }
  global.__polkadotjs = new Proxy(getObjectToPatch(), {
    get (target, key) {
      if (key === 'isProxy')
        return true

      return []
    }
  })
}
patchDetectPackage()

import '@testing-library/jest-dom'
import 'mock-local-storage'

