import { fireEvent, screen } from '@testing-library/react'

import { PointerEvent } from './events'

export function clickButton(name: string) {
  const button = screen.getByRole('button', { name })

  fireEvent.click(button)
}

export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
}

export function resetLocalStorage(key: string) {
  localStorage.removeItem(key)
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
