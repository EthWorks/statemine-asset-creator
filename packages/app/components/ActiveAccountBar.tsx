import type { FC } from 'react'

import { Chains, useActiveAccounts, useBalances, useBestNumber } from 'use-substrate'

import { FormatBalance } from './FormatBalance'
import { FormatBlockNumber } from './FormatBlockNumber'

interface Props {
  onClick: () => void
}

export const ActiveAccountBar: FC<Props> = ({ onClick }) => {
  const { activeAccounts } = useActiveAccounts()
  const { freeBalance: kusamaFreeBalance } = useBalances(activeAccounts[Chains.Kusama]?.toString(), Chains.Kusama) || {}
  const { freeBalance: statemineFreeBalance } = useBalances(activeAccounts[Chains.Statemine]?.toString(), Chains.Statemine) || {}
  const kusamaBlockNumber = useBestNumber(Chains.Kusama)
  const statemineBlockNumber = useBestNumber(Chains.Statemine)
  const isKusamaAccountSet = !!activeAccounts[Chains.Kusama]

  return (
    <div
      data-testid="active-account-bar"
      onClick={onClick}
    >
      {isKusamaAccountSet && (
        <div>
          <div>
            <p>Kusama</p>
            <FormatBalance token={'KSM'} chainDecimals={12} value={kusamaFreeBalance}/>
            <p>
            Current block
              <FormatBlockNumber value={kusamaBlockNumber}/>
            </p>
          </div>
          <div>
            {activeAccounts[Chains.Kusama]?.toString()}
          </div>
        </div>
      )}
      <div>
        <div>
          <p>Statemine</p>
          <FormatBalance token={'KSM'} chainDecimals={12} value={statemineFreeBalance}/>
          <p>
            Current block
            <FormatBlockNumber value={statemineBlockNumber}/>
          </p>
        </div>
        <div>
          {activeAccounts[Chains.Statemine]?.toString()}
        </div>
      </div>
    </div>
  )
}
