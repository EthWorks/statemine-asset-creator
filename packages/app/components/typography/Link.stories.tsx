import { Link } from './Link'
import { theme } from '../../styles/styleVariables'
import { ThemeProvider } from 'styled-components'

const Default = {
  component: Link,
  title: 'Components/Link',
}

export default Default

export const Base = (): JSX.Element => <ThemeProvider theme={theme}><Link>Link</Link></ThemeProvider>
