import { useLocalStorage } from './useLocalStorage'

export function useExtensionActivated(): boolean  {
  const [isActivated] = useLocalStorage('extensionActivated')

  return isActivated === 'true'
}
