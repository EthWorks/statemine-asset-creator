import { ApiRx, WsProvider } from '@polkadot/api'
import React, { useEffect, useMemo, useState } from 'react'

import { ApiContext } from './context'
import {APIConnecting, ConnectionState} from './types'
import { DEFAULT_CONFIG } from '../../consts/defaultConfig'

interface Props {
  chainUrl?: string
}

export const ApiContextProvider: React.FC<Props> = ({ children, chainUrl }): JSX.Element | null => {
  const [connectionStates, setConnectionStates] = useState<ConnectionState>('connecting')

}
