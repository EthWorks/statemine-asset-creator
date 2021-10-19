import { ConfigContext } from '../providers'
import { useContext } from 'react'

interface UseConfig {
  chainUrl: string
}

export function useConfig(): UseConfig {
  const { config } = useContext(ConfigContext)

  return config
}
