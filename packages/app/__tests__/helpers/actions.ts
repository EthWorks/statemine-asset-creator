import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Chains } from 'use-substrate'

import { PointerEvent } from './events'

export function clickButton(name: string) {
  const button = screen.getByRole('button', { name })

  fireEvent.click(button)
}

export async function findAndClickButton(name: string) {
  const button = await screen.findByRole('button', { name })

  fireEvent.click(button)
}

export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
}

export function openDropdown(openDropdownButton: HTMLElement) {
  fireEvent.pointerDown(
    openDropdownButton,
    new PointerEvent('pointerdown', {
      ctrlKey: false,
      button: 0
    })
  )
}

export function fillInput(label: string, value: unknown): void {
  const input = screen.getByLabelText(label)

  fireEvent.change(input, { target: { value } })
}

export async function selectAccountFromDropdown(dropdownIndex: number, accountIndex: number) {
  const openDropdownButton = await getAccountSelect(dropdownIndex)
  userEvent.click(openDropdownButton)

  const dropdownMenu = await screen.findByRole('list')
  const menuItems = await within(dropdownMenu).findAllByRole('listitem')

  userEvent.click(menuItems[accountIndex])
}

export function typeInInput(inputName: string, value: string) {
  const decimalsInput = screen.getByLabelText(inputName)

  userEvent.type(decimalsInput, value)
}

export async function getAccountSelect(dropdownIndex: number) {
  return (await screen.findAllByTestId('open-account-select'))[dropdownIndex]
}

export async function clickByText(text: string) {
  const useEverywhereLink = await screen.findByText(text)

  fireEvent.click(useEverywhereLink)
}

export async function switchApiTo(chain: Chains) {
  const switcher = await screen.findByRole('button', { name: 'Network kusama' })
  userEvent.click(switcher)
  userEvent.click(await screen.findByText(chain))
}
