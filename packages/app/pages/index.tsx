import type { NextPage } from 'next'

import Head from 'next/head'
import { useEffect } from 'react'
import styled from 'styled-components'

import { Chains, useAccounts, useActiveAccount, useApi, useAssets } from 'use-substrate'

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
import Error from './_error'

const Home: NextPage = () => {
  const { activeAccount } = useActiveAccount(Chains.Statemine)
  const { address } = activeAccount || {}
  const { web3Enable } = useAccounts()
  const assets = useAssets(Chains.Statemine, { owner: address })
  const [isNewAssetModalOpen, toggleNewAssetModalOpen] = useToggle()
  const [isConnectWalletModalOpen, toggleConnectWalletModalOpen, setConnectWalletModalOpen] = useToggle(!extensionActivated())
  const [isAccountSelectModalOpen, toggleAccountSelectModalOpen, setAccountSelectModalOpen] = useToggle()

  const { connectionState: statemineConnectionState } = useApi(Chains.Statemine)
  const { connectionState: kusamaConnectionState } = useApi(Chains.Kusama)

  useEffect(() => {
    setAccountSelectModalOpen(extensionActivated() && !address)
  }, [address, setAccountSelectModalOpen])

  const onExtensionActivated = (): void => {
    setConnectWalletModalOpen(false)
    setAccountSelectModalOpen(true)
  }

  async function enableWeb3(): Promise<boolean | void> {
    if (extensionActivated()) {
      await web3Enable()
    }
  }

  useAsync(enableWeb3, [web3Enable])

  if (kusamaConnectionState === 'error' || statemineConnectionState === 'error' ||
      kusamaConnectionState === 'disconnected' || statemineConnectionState === 'disconnected') {
    return <Error statusCode={500}/>
  }

  return (
    <>
      <Head>
        <title>Statemine Asset Creator</title>
        <meta name="description" content="Application for managing assets on Statemine"/>
      </Head>
      <PageTemplate
        background={background}
        title="Dashboard"
        templateHeader={address && assets?.length ? <ButtonPrimary onClick={toggleNewAssetModalOpen}>Create new asset</ButtonPrimary> : null}
        header={
          <div data-testid='page-header'>
            {address
              ? <ActiveAccountBar onClick={toggleAccountSelectModalOpen}/>
              : <ButtonPrimary onClick={toggleConnectWalletModalOpen}>Connect</ButtonPrimary>
            }
          </div>
        }
      >
        {address && assets?.length
          ? <PageBox size='full' title={`Created assets [${assets.length}]`}>
            <CreatedAssets assets={assets}/>
          </PageBox>
          : <PageBox size='large' title='Created assets'>
            <StyledCard padding='m'>
              <StyledCardTitle size="SM" color="white">You haven’t created any assets yet.</StyledCardTitle>
              <Text size="SM">Here you can create fungible assets, which will be governed by you and accounts you
                designate.</Text>
              <div>
                {address
                  ? <StyledButton onClick={toggleNewAssetModalOpen}>Create new asset</StyledButton>
                  : <StyledButton onClick={toggleConnectWalletModalOpen} large>Connect to create your asset</StyledButton>
                }
              </div>
            </StyledCard>
          </PageBox>
        }
        <PageBox size='large' title='In your wallet'>
          <StyledCard padding='m'>
            <StyledCardTitle size="SM" color="white">You don’t have any assets in your wallet</StyledCardTitle>
            <Text size="SM">Balance of your Statemine Assets will show here</Text>
          </StyledCard>
        </PageBox>

        <NewAssetModal
          isOpen={isNewAssetModalOpen}
          closeModal={toggleNewAssetModalOpen}
          openAccountSelectModal={toggleAccountSelectModalOpen}
        />
        <ConnectWalletModal
          isOpen={isConnectWalletModalOpen}
          closeModal={toggleConnectWalletModalOpen}
          onExtensionActivated={onExtensionActivated}
        />
        <AccountSelectModal isOpen={isAccountSelectModalOpen} closeModal={toggleAccountSelectModalOpen}/>
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
