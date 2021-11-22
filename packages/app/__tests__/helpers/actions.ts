import { fireEvent, screen, within } from '@testing-library/react'

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
      button: 0,
    })
  )
}

export function fillInput(label: string, value: unknown): void {
  const input = screen.getByLabelText(label)

  fireEvent.change(input, { target: { value } })
}

export async function selectAccountFromDropdown(accountIndex: number) {
  const openDropdownButton = await screen.findByTestId('open-account-select')
  openDropdown(openDropdownButton)
  const dropdownMenu = await screen.findByRole('menu')
  const menuItems = await within(dropdownMenu).findAllByRole('menuitem')

  fireEvent.click(menuItems[accountIndex])
}
