export function extensionActivated(): boolean {
  return localStorage.getItem('extensionActivated') === 'true'
}
