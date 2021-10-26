import { fireEvent, screen } from '@testing-library/react'

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
