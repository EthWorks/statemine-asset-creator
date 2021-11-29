import { createContext } from 'react'

import { DEFAULT_CONFIG } from '../../consts'
import { Config } from './types'

export const ConfigContext = createContext<{ config: Config }>({
  config: DEFAULT_CONFIG
})
