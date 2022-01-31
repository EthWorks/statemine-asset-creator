import BN from 'bn.js'
import styled from 'styled-components'

import { useActiveAccount, useBalances } from 'use-substrate'

import { useAppChains, useCapitalizedChains } from '../utils'
import { Info } from './Info'

interface TransactionWarningProps {
  openAccountSelectModal: () => void,
  teleportAmount: BN | undefined
}

export function ThirdStepInfobox({ openAccountSelectModal, teleportAmount }: TransactionWarningProps): JSX.Element {
  const { parachain, relayChain } = useAppChains()
  const [capitalizedRelayChain, capitalizedParachain] = useCapitalizedChains([relayChain, parachain])
  const { activeAccount: relayChainActiveAccount } = useActiveAccount(relayChain)
  const { availableBalance: relayChainAvailableBalance } = useBalances(relayChainActiveAccount?.address.toString(), relayChain) || {}

  const requiredTeleportInfo = (
    <StyledInfo
      text={`Owner account has insufficient funds on ${capitalizedParachain} to create the asset. A Teleport transaction from selected ${capitalizedRelayChain} account will be executed.`}
    />
  )

  const noRelayChainAccountWarning = (
    <StyledInfo
      text={`Insufficient funds on the owner account to create the asset. Cannot execute teleport transaction due to not selected ${capitalizedRelayChain} account.`}
      type='warning'
      action={{
        name: `Select ${capitalizedRelayChain} account`,
        onClick: openAccountSelectModal
      }}
    />
  )

  const lowRelayChainBalanceWarning = (
    <StyledInfo
      text={'Selected Kusama account has insufficient funds to execute teleport transaction. A Teleport transaction from selected Kusama account will be executed.'}
      type='warning'
      action={{
        name: `Change ${capitalizedRelayChain} account`,
        onClick: openAccountSelectModal
      }}
    />
  )

  if (!relayChainActiveAccount) {
    return noRelayChainAccountWarning
  }

  if (teleportAmount && relayChainAvailableBalance?.lt(teleportAmount)) {
    return lowRelayChainBalanceWarning
  }

  return requiredTeleportInfo
}

const StyledInfo = styled(Info)`
  margin-bottom: 16px;
`
