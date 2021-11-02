export function extensionActivated(): boolean {
  return localStorage.getItem('extensionActivated') === 'true'
}

export function activeAccountSet(): boolean {
  return localStorage.getItem('activeAccount') !== null
}

export const accountSet = (): boolean => extensionActivated() && !activeAccountSet()
