import { screen, within } from '@testing-library/react'

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

export function assertTextInput(inputName:string, text: string) {
  const input = screen.getByLabelText(inputName)

  expect(input).toHaveTextContent(text)
}

export function assertNoButton(name: string) {
  expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
}

export function assertNoText(text: string) {
  expect(screen.queryByText(text)).toBeFalsy()
}

export async function assertLinkByText(text: string, url: string) {
  const link = await screen.findByText(text)

  expect(link.getAttribute('href')).toEqual(url)
}

export async function assertInputError(inputName: string, errorText: string) {
  const customInputComponent = screen.getByTestId(inputName)
  const inputError = await within(customInputComponent).findByTestId('input-error')

  expect(inputError).toHaveTextContent(errorText)
}

export function assertNoInputError(inputName: string) {
  const customInputComponent = screen.getByTestId(inputName)

  expect(within(customInputComponent).queryByTestId('input-error')).not.toBeInTheDocument()
}

export function assertButtonNotDisabled(name: string) {
  const button = screen.getByRole('button', { name })
  expect(button).not.toBeDisabled()
}

export function assertButtonDisabled(name: string) {
  const button = screen.getByRole('button', { name })
  expect(button).toBeDisabled()
}
