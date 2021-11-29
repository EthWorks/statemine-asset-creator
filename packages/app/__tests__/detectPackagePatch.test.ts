import { GlobalWithPjs, patchDetectPackage } from '../utils/patchDetectPackage'

function getEntry(name: string) {
  const _global = global as GlobalWithPjs

  if (!_global.__polkadotjs) {
    _global.__polkadotjs = {}
  }

  if (!_global.__polkadotjs[name]) {
    _global.__polkadotjs[name] = []
  }

  return _global.__polkadotjs[name]
}

describe('proxy to patch detect package', () => {
  it('returns empty array for a chunk', () => {
    patchDetectPackage()
    const entry = getEntry('@polkadot/util-crypto')
    expect(entry).toEqual([])
    entry.push('sth')
    expect(getEntry('@polkadot/util-crypto')).toEqual([])
  })
})
