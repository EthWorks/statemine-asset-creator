import { ThemeProvider } from 'styled-components'

import { theme } from '../../styles/styleVariables'
import { Label } from './Label'

const Default = {
  component: Label,
  title: 'Components/Typography/Label'
}

export default Default

export const Base = (): JSX.Element => <ThemeProvider theme={theme}><Label>Label text</Label></ThemeProvider>
