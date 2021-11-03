export function extensionActivated(): boolean {
  return localStorage.getItem('extensionActivated') === 'true'
}

export function activeAccountSet(): boolean {
  return localStorage.getItem('activeAccount') !== null
}

export const shouldSelectAccount = (): boolean => extensionActivated() && !activeAccountSet()
