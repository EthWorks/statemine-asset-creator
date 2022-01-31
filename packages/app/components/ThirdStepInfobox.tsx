import styled from 'styled-components'

import { ActiveAccount } from 'use-substrate'

import { Info } from './Info'

interface TransactionWarningProps {
  relayChainActiveAccount: ActiveAccount | undefined,
  parachain: string,
  relayChain: string,
  openAccountSelectModal: () => void
}

export function ThirdStepInfobox({ relayChainActiveAccount, relayChain, parachain, openAccountSelectModal }: TransactionWarningProps): JSX.Element {
  const requiredTeleportInfo = (
    <StyledInfo
      text={`Owner account has insufficient funds on ${parachain} to create the asset. A Teleport transaction from selected ${relayChain} account will be executed.`}
    />
  )

  const noKusamaAccountWarning = (
    <StyledInfo
      text={`Insufficient funds on the owner account to create the asset. Cannot execute teleport transaction due to not selected ${relayChain} account.`}
      type='warning'
      action={{
        name: `Select ${relayChain} account`,
        onClick: openAccountSelectModal
      }}
    />
  )

  if (relayChainActiveAccount) {
    return requiredTeleportInfo
  }

  return noKusamaAccountWarning
}

const StyledInfo = styled(Info)`
  margin-bottom: 16px;
`
