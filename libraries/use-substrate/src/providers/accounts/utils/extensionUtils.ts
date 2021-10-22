import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'

import { checkConditionRepeatedly } from '../../../util'

export const getInjectedAccounts = async (appName: string): Promise<InjectedAccountWithMeta[]> => {
  const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp')

  await web3Enable(appName)

  return await web3Accounts()
}

export const checkRepeatedlyIfExtensionLoaded = (onSuccess: () => void, onFailure: () => void): () => void => {
  return checkConditionRepeatedly(
    () => !!Object.keys(window.injectedWeb3 ?? {}).length,
    onSuccess,
    onFailure
  )
}
