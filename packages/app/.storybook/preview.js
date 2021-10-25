import { addDecorator } from '@storybook/client-api';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/styleVariables';
import * as NextImage from "next/image";

const OriginalNextImage = NextImage.default;

export const parameters = {
  actions: {argTypesRegex: "^on[A-Z].*"},
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

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => (
    <OriginalNextImage
      {...props}
      unoptimized
    />
  ),
});