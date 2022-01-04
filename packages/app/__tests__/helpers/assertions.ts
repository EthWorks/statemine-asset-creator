import { screen, within } from '@testing-library/react'

export function assertLocalStorage(key: string, value: unknown) {
  expect(localStorage.getItem(key)).toEqual(value)
}

export function assertNewTabOpened(url: string) {
  return expect(global.open).toBeCalledWith(url, '_blank', 'noopener,noreferrer')
}

export async function assertText(text: string) {
  await screen.findByText(text)
}

export function assertInput(inputName:string, text: string) {
  const input = screen.getByLabelText(inputName)

  expect(input).toHaveValue(text)
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

export function assertButtonDisabled(name: string) {
  const button = screen.getByRole('button', { name })

  expect(button).toBeDisabled()
}

export function assertButtonNotDisabled(name: string) {
  const button = screen.getByRole('button', { name })

  expect(button).not.toBeDisabled()
}

export async function findButtonNotDisabled(name: string) {
  const button = await screen.findByRole('button', { name })

  expect(button).not.toBeDisabled()
}

export function assertInputValue(inputName: string, value: string) {
  const input = screen.getByLabelText(inputName)

  expect(input).toHaveValue(value)
}

export const assertTextInAccountSelect = async (accountName: string, dropdownIndex: number) => {
  const accountSelectButton = (await screen.findAllByTestId('open-account-select'))[dropdownIndex]
  await within(accountSelectButton).findByText(accountName)
}

export const assertModalClosed = () => {
  expect(screen.queryByTestId('modal')).toBeFalsy()
}

export async function assertInputHint(inputName: string, hint: string) {
  const input = await screen.findByLabelText(inputName)

  expect(input.nextSibling).toHaveTextContent(hint)
}
