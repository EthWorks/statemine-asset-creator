// eslint-disable-next-line @typescript-eslint/ban-types
declare type FnType = Function;

export function isFunction(value: unknown): value is FnType {
  return typeof value === 'function'
}
