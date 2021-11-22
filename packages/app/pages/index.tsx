import type { NextPage } from 'next'

import Head from 'next/head'
import { useEffect } from 'react'
import styled from 'styled-components'

import { useAccounts, useActiveAccount } from 'use-substrate'

import background from '../assets/background.svg'
import {
  AccountSelectModal,
  ActiveAccountBar,
  ButtonPrimary,
  Card,
  ConnectWalletModal,
  CreatedAssets,
  NewAssetModal,
  PageBox,
  PageTemplate,
  Text
} from '../components'
import { extensionActivated, useAsync, useToggle } from '../utils'

const Home: NextPage =  () => {
  const { activeAccount: account } = useActiveAccount()
  const [isNewAssetModalOpen, toggleNewAssetModalOpen] = useToggle()
  const [isConnectWalletModalOpen, toggleConnectWalletModalOpen, setConnectWalletModalOpen] = useToggle(!extensionActivated())
  const [isAccountSelectModalOpen, toggleSelectAccountModalOpen, setSelectAccountModalOpen] = useToggle()

  useEffect(() => {
    setSelectAccountModalOpen(extensionActivated() && !account)
  }, [account, setSelectAccountModalOpen])

  const { web3Enable } = useAccounts()

  const onExtensionActivated = (): void => {
    setConnectWalletModalOpen(false)
    setSelectAccountModalOpen(true)
  }

  async function enableWeb3(): Promise<boolean | void> {
    if(extensionActivated()) {
      await web3Enable()
    }
  }

  useAsync(enableWeb3, [web3Enable])

  return (
    <>
      <Head>
        <title>Statemine Asset Creator</title>
        <meta name="description" content="Application for managing assets on Statemine"/>
      </Head>
      <PageTemplate
        background={background}
        title="Dashboard"
        header={
          <div data-testid='page-header'>
            {account 
              ? <ActiveAccountBar onClick={toggleSelectAccountModalOpen}/>
              : <ButtonPrimary onClick={toggleConnectWalletModalOpen}>Connect</ButtonPrimary>
            }
          </div>
        }
      >
        <PageBox size='large' title='Created assets'>
          <StyledCard padding='m'>
            <StyledCardTitle size="SM" color="white">You haven’t created any assets yet.</StyledCardTitle>
            <Text size="SM">Here you can create fungible assets, which will be governed by you and accounts you
              designate.</Text>
            <div>
              {account
                ? <StyledButton onClick={toggleNewAssetModalOpen}>Create new asset</StyledButton>
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
        <ConnectWalletModal 
          isOpen={isConnectWalletModalOpen} 
          closeModal={toggleConnectWalletModalOpen}
          onExtensionActivated={onExtensionActivated}
        />
        <AccountSelectModal isOpen={isAccountSelectModalOpen} closeModal={toggleSelectAccountModalOpen}/>
        <CreatedAssets/>
      </PageTemplate>
    </>
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
