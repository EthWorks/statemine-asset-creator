import { ThemeProvider } from 'styled-components'

import { theme } from '../../styles/styleVariables'
import { Link } from './Link'

const Default = {
  component: Link,
  title: 'Components/Link',
}

export default Default

export const Base = (): JSX.Element => <ThemeProvider theme={theme}><Link>Link</Link></ThemeProvider>
