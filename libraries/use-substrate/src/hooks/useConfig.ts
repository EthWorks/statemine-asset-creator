import { Config, ConfigContext } from '../providers'
import { useContext } from 'react'

export function useConfig(): Config {
  const { config } = useContext(ConfigContext)

  return config
}
