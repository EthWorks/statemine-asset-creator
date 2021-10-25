export function assertLocalStorage(key: string, value: unknown) {
  expect(localStorage.getItem(key)).toEqual(value)
}

export function assertNewTabOpened(url: string) {
  return expect(global.open).toBeCalledWith(url, '_blank', 'noopener,noreferrer')
}
