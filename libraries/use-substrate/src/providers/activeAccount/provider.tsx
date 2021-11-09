import { AccountId } from '@polkadot/types/interfaces'
import React, { FC, useContext, useEffect, useState } from 'react'

import { Chains } from '../../consts'
import { ApiContext, UseApi } from '../api'
import { ActiveAccountContext } from './context'

function useAnyApi(): UseApi | undefined {
  const [api, setApi] = useState<UseApi>()
  const apis = useContext(ApiContext)

  useEffect(() => {
    const key = Object.keys(apis)[0]
    setApi(apis[key as Chains])
  }, [apis])

  return api
}

export const ActiveAccountProvider: FC = ({ children }) => {
  const api = useAnyApi()
  const [activeAccount, setActiveAccount] = useState<AccountId>()

  useEffect(() => {
    const initValue = localStorage.getItem('activeAccount')
    setActiveAccount(initValue ? api?.api?.createType('AccountId', initValue) : undefined)
  }, [api])

  const _setActiveAccount = (accountId: AccountId): void => {
    localStorage.setItem('activeAccount', accountId.toHuman())
    setActiveAccount(accountId)
  }

  return (
    <ActiveAccountContext.Provider value={{ activeAccount, setActiveAccount: _setActiveAccount }}>
      {children}
    </ActiveAccountContext.Provider>
  )
}
