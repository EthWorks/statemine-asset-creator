import type { FormEvent } from 'react'
import type { ModalStep } from './types'

import { useCallback } from 'react'

import { useAccounts } from 'use-substrate'

import { AccountSelect } from '../AccountSelect'
import { ButtonOutline, ButtonPrimary } from '../button/Button'
import { ArrowLeft, ArrowRight } from '../icons'
import { useNewAssetModal } from './context/useNewAssetModal'
import { ModalFooter } from './ModalFooter'

export function SecondStep({ onNext, onBack }: ModalStep): JSX.Element | null {
  const _onNext = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onNext()
  }, [onNext])

  const { admin, setAdmin, issuer, setIssuer, freezer, setFreezer } = useNewAssetModal()
  const accounts = useAccounts()

  return (
    <form onSubmit={_onNext}>
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
