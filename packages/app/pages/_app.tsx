import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { ApiContextProvider } from 'use-substrate'

const AccountsContextProvider = dynamic(() => import('use-substrate/dist/src/providers/accounts/provider').then((module) => module.AccountsContextProvider) as Promise<() => (JSX.Element | null)>,{ ssr: false })

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ApiContextProvider>
      <AccountsContextProvider>
        <Component {...pageProps} />
      </AccountsContextProvider>
    </ApiContextProvider>
  )
}

export default MyApp
