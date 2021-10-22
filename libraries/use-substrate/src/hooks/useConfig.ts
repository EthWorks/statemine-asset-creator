import { useContext } from 'react'

import { Config, ConfigContext } from '../providers'

export function useConfig(): Config {
  const { config } = useContext(ConfigContext)

  return config
}
