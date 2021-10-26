import { ThemeProvider } from 'styled-components'

import { theme } from '../../styles/styleVariables'
import { Header } from './Header'

const Default = {
  component: Header,
  title: 'Components/Typography/Header',
}

export default Default

export const Base = (): JSX.Element => <ThemeProvider theme={theme}><Header style={{ color: '#000000'}}>Header text</Header></ThemeProvider>
