import { useContext } from 'react'
import { ApiContext } from '../providers'
import type { UseApi } from '../providers'

export const useApi = (): UseApi => useContext(ApiContext)
