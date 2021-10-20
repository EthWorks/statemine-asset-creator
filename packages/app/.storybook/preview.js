import { addDecorator } from '@storybook/client-api';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/styleVariables';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

addDecorator(
    story => (
        <ThemeProvider theme={theme}>
          {story()}
        </ThemeProvider>
    )
)