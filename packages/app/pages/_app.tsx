import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { IdProvider } from '@radix-ui/react-id'

const AccountsContextProvider = dynamic(() => import('use-substrate').then((module) => module.AccountsContextProvider) as Promise<() => (JSX.Element | null)>,{ ssr: false })
const ApiContextProvider = dynamic(() => import('use-substrate').then((module) => module.ApiContextProvider) as Promise<() => (JSX.Element | null)>,{ ssr: false })

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <IdProvider>
      <ApiContextProvider>
        <AccountsContextProvider>
          <Component {...pageProps} />
        </AccountsContextProvider>
      </ApiContextProvider>
    </IdProvider>
  )
}

export default MyApp
