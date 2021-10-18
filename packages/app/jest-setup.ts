import '@testing-library/jest-dom'
import failOnConsole from 'jest-fail-on-console'
import {PointerEvent} from "./__tests__/helpers/events"

failOnConsole({
  shouldFailOnWarn: true,
  shouldFailOnError: true,
})

window.PointerEvent = PointerEvent

global.ResizeObserver = class ResizeObserver {
  cb: any
  constructor(cb: any) {
    this.cb = cb
  }
  observe(): void {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }])
  }
  unobserve(): void {}
  disconnect(): void {}
}

global.DOMRect = {
  fromRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0,  x: 0, y: 0, toJSON: () => null }),
} as unknown as DOMRect
