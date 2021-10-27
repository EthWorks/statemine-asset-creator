import { render, RenderResult } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import { theme } from '../../styles/styleVariables'

export const renderWithTheme = (component: JSX.Element): RenderResult =>
  render(<ThemeProvider theme = {theme} > {component} </ThemeProvider>)
