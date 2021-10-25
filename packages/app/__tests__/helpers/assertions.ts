import { screen } from '@testing-library/react'

export function assertLocalStorage(key: string, value: unknown) {
  expect(localStorage.getItem(key)).toEqual(value)
}

export function assertNewTabOpened(url: string) {
  return expect(global.open).toBeCalledWith(url, '_blank', 'noopener,noreferrer')
}

export async function assertLink(url: string) {
  const link = await screen.findByRole('link')

  expect(link.getAttribute('href')).toEqual(url)
}

export async function assertText(text: string) {
  await screen.findByText(text)
}
