/* eslint-disable  @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom'
import 'mock-local-storage'

import { PointerEvent } from './__tests__/helpers'

// @ts-ignore
window.PointerEvent = PointerEvent

global.open = jest.fn()

global.ResizeObserver = class ResizeObserver {
  cb: any
  constructor(cb: any) {
    this.cb = cb
  }
  observe(): void {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 }, contentBoxSize: {} }])
  }
  unobserve(): void { /**/ }
  disconnect(): void { /**/ }
}

// @ts-ignore
global.DOMRect = {
  fromRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => null }),
} as unknown as DOMRect
