import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'

const AccountsContextProvider = dynamic(() => import('use-substrate').then((module) => module.AccountsContextProvider) as Promise<() => (JSX.Element | null)>,{ ssr: false })
const ApiContextProvider = dynamic(() => import('use-substrate').then((module) => module.ApiContextProvider) as Promise<() => (JSX.Element | null)>,{ ssr: false })

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
