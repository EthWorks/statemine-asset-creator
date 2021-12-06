import type { FormEvent } from 'react'
import type { ModalStep } from './types'

import BN from 'bn.js'
import { useCallback } from 'react'

import { Chains, useAccounts, useActiveAccount, useBalances } from 'use-substrate'

import { convertActiveAccountToAccount } from '../../utils'
import { AccountSelect } from '../AccountSelect'
import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { ArrowLeft, ArrowRight } from '../icons'
import { Info } from '../Info'
import { useNewAssetModal } from './context/useNewAssetModal'
import { ModalFooter } from './ModalFooter'

// to be changed based on chains decimals
const EXPECTED_BALANCE = new BN('1000000000')

export function SecondStep({ onNext, onBack }: ModalStep): JSX.Element | null {
  const _onNext = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onNext()
  }, [onNext])

  const { admin, setAdmin, issuer, setIssuer, freezer, setFreezer } = useNewAssetModal()
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const account = convertActiveAccountToAccount(activeAccount)

  const { availableBalance: adminsAvailableBalance } = useBalances(admin?.address, Chains.Statemine) || {}
  const { availableBalance: issuersAvailableBalance } = useBalances(issuer?.address, Chains.Statemine) || {}
  const { availableBalance: freezersAvailableBalance } = useBalances(freezer?.address, Chains.Statemine) || {}

  const accounts = useAccounts()

  const zeroFundsAccounts = [adminsAvailableBalance, issuersAvailableBalance, freezersAvailableBalance].map(balance => {
    return balance?.lt(EXPECTED_BALANCE) ? balance : null
  })

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
      <Info type='info'>Insufficient funds on the {zeroFundsAccounts.join(' and')} accounts to create assets.</Info>
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
