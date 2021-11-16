/* eslint-disable @typescript-eslint/no-explicit-any,no-undef */

type GlobalThis = typeof globalThis;

function evaluateThis (fn: (code: string) => unknown): GlobalThis {
  return fn('return this') as GlobalThis
}

export const xglobal = (
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof global !== 'undefined'
      ? global
      : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
          ? window
          : evaluateThis(Function)
)

type This = typeof globalThis

type PolkadotJsGlobal = Record<string, any>
declare global {
  let __polkadotjs: PolkadotJsGlobal
}

export type GlobalWithPjs = This & {__polkadotjs: PolkadotJsGlobal}

const _global = xglobal as GlobalWithPjs

function getObjectToPatch (): PolkadotJsGlobal {
  if (!_global.__polkadotjs) {
    _global.__polkadotjs = {}
  }

  return _global.__polkadotjs
}
export function patchDetectPackage (): void {
  if (getObjectToPatch().isProxy) {

    return
  }
  _global.__polkadotjs = new Proxy(getObjectToPatch(), {
    get (target, key) {
      if (key === 'isProxy')
        return true

      return []
    }
  })
}
patchDetectPackage()
