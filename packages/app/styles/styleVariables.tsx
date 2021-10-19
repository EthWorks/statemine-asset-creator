interface GrayShades {
  50: string,
  300: string,
  400: string,
  500: string,
  600: string,
  700: string,
  800: string,
  900: string
}

export type ColorType = 'black' | 'green' | 'indigo' | 'pink' | 'red' | 'white'

export type Colors = Record<ColorType, string>

interface Theme {
  colors: { gray: GrayShades } & Colors
}

export const theme: Theme = {
  colors: {
    gray: {
      50: '#FAFAFA',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    },
    black: '#000000',
    green: '#2DD4BF',
    indigo: '#828DF8',
    pink: '#E6007A',
    red: '#EF4444',
    white: '#FFFFFF'
  }
}
