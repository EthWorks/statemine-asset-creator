import { fireEvent, screen } from '@testing-library/react'

export function clickButton(name: string) {
  const enableWeb3Button = screen.getByRole('button', { name })

  fireEvent.click(enableWeb3Button)
}
