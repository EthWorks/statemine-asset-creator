import type { FC } from 'react'

import { Chains, useActiveAccount, useBalances, useBestNumber } from 'use-substrate'

import styles from '../styles/Home.module.css'

interface Props {
  onClick: () => void
}

export const ActiveAccountBar: FC<Props> = ({ onClick }) => {
  const { activeAccount } = useActiveAccount()
  const { freeBalance: kusamaFreeBalance } = useBalances(activeAccount?.toString(), Chains.Kusama) || {}
  const { freeBalance: statemineFreeBalance } = useBalances(activeAccount?.toString(), Chains.Statemine) || {}
  const kusamaBlockNumber = useBestNumber(Chains.Kusama)
  const statemineBlockNumber = useBestNumber(Chains.Statemine)

  if (!kusamaFreeBalance || !statemineFreeBalance) return null
    
  return (
    <div 
      data-testid="active-account-bar"
      onClick={onClick}
    >
      <div>
        <p className={styles.description}>
          KUSAMA {kusamaFreeBalance.toString()} KSM
        </p>
        <p className={styles.description}>
          Current block #{kusamaBlockNumber?.toString()}
        </p>
        <p>
          {activeAccount?.toString()}
        </p>
      </div>
      <div>
        <p className={styles.description}>
          Current block #{statemineBlockNumber?.toString()}
        </p>
        <p className={styles.description}>
          STATEMINE {statemineFreeBalance.toString()} KSM
        </p>
        <p>
          {activeAccount?.toString()}
        </p>
      </div>
    </div>
  )
}
