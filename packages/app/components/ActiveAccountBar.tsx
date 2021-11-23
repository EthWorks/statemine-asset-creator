import type { FC } from 'react'

import { Chains, useActiveAccounts, useBalances } from 'use-substrate'

import styles from '../styles/Home.module.css'

interface Props {
  onClick: () => void
}

export const ActiveAccountBar: FC<Props> = ({ onClick }) => {
  const { activeAccounts } = useActiveAccounts()
  const { freeBalance: kusamaFreeBalance } = useBalances(activeAccounts[Chains.Kusama]?.toString(), Chains.Kusama) || {}
  const { freeBalance: statemineFreeBalance } = useBalances(activeAccounts[Chains.Statemine]?.toString(), Chains.Statemine) || {}

  if (!kusamaFreeBalance || !statemineFreeBalance) return null
    
  return (
    <div 
      data-testid="active-account-bar"
      onClick={onClick}
    >
      <p>
        {activeAccounts[Chains.Kusama]?.toString()}
      </p>
      <p className={styles.description}>
        KUSAMA {kusamaFreeBalance.toString()} KSM
      </p>
      <p className={styles.description}>
        STATEMINE {statemineFreeBalance.toString()} KSM
      </p>
    </div>
  )
}
