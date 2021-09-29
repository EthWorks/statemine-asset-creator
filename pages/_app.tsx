import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ApiContextProvider } from "../lib/providers/api/provider"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApiContextProvider>
      <Component {...pageProps} />
    </ApiContextProvider>
  )
}

export default MyApp
