import type { FormEvent } from 'react'
import type { ModalStep } from './types'

import { useCallback } from 'react'

import { Chains, useAccounts, useActiveAccount } from 'use-substrate'

import { convertActiveAccountToAccount } from '../../utils'
import { AccountSelect } from '../AccountSelect'
import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { ArrowLeft, ArrowRight } from '../icons'
import { Info } from '../Info'
import { useNewAssetModal } from './context/useNewAssetModal'
import { printItems, useInsufficientAdminBalances } from './helpers'
import { ModalFooter } from './ModalFooter'

export function SecondStep({ onNext, onBack }: ModalStep): JSX.Element | null {
  const _onNext = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onNext()
  }, [onNext])

  const { admin, setAdmin, issuer, setIssuer, freezer, setFreezer } = useNewAssetModal()
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const account = convertActiveAccountToAccount(activeAccount)

  const accounts = useAccounts()
  const insufficientFundsAdmins = useInsufficientAdminBalances(admin, issuer, freezer)
  const listedAdmins = printItems(insufficientFundsAdmins)

  return (
    <form onSubmit={_onNext}>
      <AccountSelect
        label='Owner account'
        accounts={accounts.allAccounts}
        currentAccount={account}
        setCurrentAccount={() => { /**/ }}
        disabled
      />
      <AccountSelect
        label='Admin account'
        accounts={accounts.allAccounts}
        currentAccount={admin}
        setCurrentAccount={setAdmin}
        withAccountInput
      />
      <AccountSelect
        label='Issuer account'
        accounts={accounts.allAccounts}
        currentAccount={issuer}
        setCurrentAccount={setIssuer}
        withAccountInput
      />
      <AccountSelect
        label='Freezer account'
        accounts={accounts.allAccounts}
        currentAccount={freezer}
        setCurrentAccount={setFreezer}
        withAccountInput
      />
      {insufficientFundsAdmins.length > 0 && (
        <Info
          type='info'
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
