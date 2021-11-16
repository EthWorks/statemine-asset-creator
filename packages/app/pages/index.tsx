import type { NextPage } from 'next'

import { useState } from 'react'
import styled from 'styled-components'

import { Chains, useAccounts, useBalances } from 'use-substrate'

import background from '../assets/background.svg'
import { AccountSelectModal, ButtonPrimary, ConnectWalletModal, CreatedAssets, NewAssetModal, Text } from '../components'
import Card from '../components/Card/Card'
import PageBox from '../components/PageBox/PageBox'
import PageTemplate from '../components/template/PageTemplate'
import styles from '../styles/Home.module.css'
import { extensionActivated, shouldSelectAccount, useAsync, useToggle } from '../utils'

const Home: NextPage = () => {
  const [account] = useState<string | null>(localStorage.getItem('activeAccount'))
  const [isNewAssetModalOpen, toggleNewAssetModalOpen] = useToggle()
  const [isConnectWalletModalOpen, toggleConnectWalletModalOpen, setConnectWalletModalOpen] = useToggle(!extensionActivated())
  const [isAccountSelectModalOpen, toggleSelectAccountModalOpen, setSelectAccountModalOpen] = useToggle(shouldSelectAccount())

  const balances = useBalances(account, Chains.Kusama)
  const statemineBalances = useBalances(account, Chains.Statemine)
  const { web3Enable } = useAccounts()

  const onExtensionActivated = (): void => {
    setConnectWalletModalOpen(false)
    setSelectAccountModalOpen(true)
  }

  async function enableWeb3(): Promise<boolean | void> {
    if (extensionActivated()) {
      await web3Enable()
    }
  }

  useAsync(enableWeb3, [web3Enable])

  return (
    <PageTemplate
      background={background}
      title="Dashboard"
      header={
        <div>
          {!localStorage.getItem('activeAccount') && <ButtonPrimary onClick={toggleConnectWalletModalOpen}>Connect</ButtonPrimary>}
        </div>
      }
    >
      <PageBox size='large' title='Created assets'>
        <StyledCard padding='m'>
          <StyledCardTitle size="SM" color="white">You haven’t created any assets yet.</StyledCardTitle>
          <Text size="SM">Here you can create fungible assets, which will be governed by you and accounts you
            designate.</Text>
          <div>
            {localStorage.getItem('activeAccount') ?
              <StyledButton onClick={toggleNewAssetModalOpen}>Create new asset</StyledButton>
              : <StyledButton onClick={toggleConnectWalletModalOpen} large>Connect to create your asset</StyledButton>
            }
          </div>
        </StyledCard>
      </PageBox>
      <PageBox size='large' title='In your wallet'>
        <StyledCard padding='m'>
          <StyledCardTitle size="SM" color="white">You don’t have any assets in your wallet</StyledCardTitle>
          <Text size="SM">Balance of your Statemine Assets will show here</Text>
        </StyledCard>
      </PageBox>

      <NewAssetModal isOpen={isNewAssetModalOpen} closeModal={toggleNewAssetModalOpen}/>
      <ConnectWalletModal isOpen={isConnectWalletModalOpen} closeModal={toggleConnectWalletModalOpen} onExtensionActivated={onExtensionActivated}/>
      <AccountSelectModal isOpen={isAccountSelectModalOpen} closeModal={toggleSelectAccountModalOpen}/>
      <div data-testid='active-account-container'>
        <p>
          {account}
        </p>
        <p className={styles.description}>
          Balance: {balances?.freeBalance.toString()}
        </p>
        <p className={styles.description}>
          Statemine Balance: {statemineBalances?.freeBalance.toString()}
        </p>
      </div>
      <CreatedAssets/>
    </PageTemplate>
  )
}

export default Home

export const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledCardTitle = styled(Text)`
  margin-bottom: 16px;
  font-weight: 500;
  line-height: 18px;
`

const StyledButton = styled(ButtonPrimary)`
  margin-top: 16px;
`
