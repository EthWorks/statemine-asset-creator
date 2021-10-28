import type { RenderResult } from '@testing-library/react'

import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import { theme } from '../../styles/styleVariables'

export const renderComponent = (component: JSX.Element): RenderResult =>
  render(<ThemeProvider theme = {theme} > {component} </ThemeProvider>)
