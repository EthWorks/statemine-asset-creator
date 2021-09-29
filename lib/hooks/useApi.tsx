import { useContext } from 'react'
import { ApiContext } from '../providers/api/context'
import type { UseApi } from "../providers/api/types"

export const useApi = (): UseApi => useContext(ApiContext)
