import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import GlobalStyle from '../styles/globalStyle'
import { ThemeProvider } from 'styled-components'
import { theme } from '../styles/styleVariables'

const AccountsContextProvider = dynamic(() => import('use-substrate').then((module) => module.AccountsContextProvider) as Promise<() => (JSX.Element | null)>,{ ssr: false })
const ApiContextProvider = dynamic(() => import('use-substrate').then((module) => module.ApiContextProvider) as Promise<() => (JSX.Element | null)>,{ ssr: false })

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ApiContextProvider>
      <AccountsContextProvider>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AccountsContextProvider>
    </ApiContextProvider>
  )
}

export default MyApp
