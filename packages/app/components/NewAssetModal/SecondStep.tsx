import type { FormEvent } from 'react'
import type { ModalStep } from './types'

import { useCallback } from 'react'
import styled from 'styled-components'

import { useAccounts, useActiveAccount } from 'use-substrate'

import { convertActiveAccountToAccount, useAppChains } from '../../utils'
import { AccountSelect } from '../AccountSelect'
import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { ArrowLeft, ArrowRight } from '../icons'
import { Info } from '../Info'
import { Link } from '../typography'
import { useNewAssetModal } from './context/useNewAssetModal'
import { printItems, useInsufficientAdminBalances } from './helpers'
import { ModalFooter } from './ModalFooter'

export function SecondStep({ onNext, onBack }: ModalStep): JSX.Element | null {
  const { parachain } = useAppChains()
  const _onNext = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onNext()
  }, [onNext])

  const { admin, setAdmin, issuer, setIssuer, freezer, setFreezer } = useNewAssetModal()
  const { activeAccount } = useActiveAccount(parachain)
  const account = convertActiveAccountToAccount(activeAccount)

  const accounts = useAccounts()
  const insufficientFundsAdmins = useInsufficientAdminBalances(admin, issuer, freezer)
  const listedAdmins = printItems(insufficientFundsAdmins)

  const _setAdminForAllAccounts = (): void => {
    setIssuer(admin)
    setFreezer(admin)
  }

  const useAdminEverywhereButton = <StyledLink onClick={_setAdminForAllAccounts}>Use everywhere</StyledLink>

  return (
    <form onSubmit={_onNext}>
      <AccountSelect
        label='Owner account'
        accounts={accounts.allAccounts}
        currentAccount={account}
        setCurrentAccount={() => { /**/ }}
        disabled
        chain={parachain}
      />
      <AccountSelect
        label='Admin account'
        accounts={accounts.allAccounts}
        currentAccount={admin}
        setCurrentAccount={setAdmin}
        withAccountInput
        button={useAdminEverywhereButton}
        chain={parachain}
      />
      <AccountSelect
        label='Issuer account'
        accounts={accounts.allAccounts}
        currentAccount={issuer}
        setCurrentAccount={setIssuer}
        withAccountInput
        chain={parachain}
      />
      <AccountSelect
        label='Freezer account'
        accounts={accounts.allAccounts}
        currentAccount={freezer}
        setCurrentAccount={setFreezer}
        withAccountInput
        chain={parachain}
      />
      {insufficientFundsAdmins.length > 0 && (
        <Info
          text={`Insufficient funds on the ${listedAdmins} account${insufficientFundsAdmins.length > 1 ? 's' : ''} to create assets.`}
        />
      )}
      <ModalFooter contentPosition='between'>
        <ButtonOutline type='button' onClick={onBack}>
          <ArrowLeft />
              Back
        </ButtonOutline>
        <ButtonPrimary type='submit'>
              Next
          <ArrowRight />
        </ButtonPrimary>
      </ModalFooter>
    </form>
  )
}

const StyledLink = styled(Link)`
  margin-left: auto;
  font-size: 12px;
  line-height: 16px;
`
