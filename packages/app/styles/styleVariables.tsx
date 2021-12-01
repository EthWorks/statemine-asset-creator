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

export type ColorType = 'black' | 'blue' | 'green' | 'indigo' | 'pinkLight' | 'pinkDark' | 'red' | 'redDark' | 'white'
export type BorderRadiusType = 's' | 'm' | 'l' | 'circle' | 'none'

export type Colors = Record<ColorType, string>
export type BorderRadius = Record<BorderRadiusType, string>

interface Theme {
  colors: { gray: GrayShades } & Colors
  borderRadius: BorderRadius
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
    blue: '#5048E5',
    indigo: '#828DF8',
    pinkLight: '#E6007A',
    pinkDark: '#C30070',
    redDark: '#DC2626',
    red: '#EF4444',
    white: '#FFFFFF'
  },
  borderRadius: {
    s: '4px',
    m: '8px',
    l: '10px',
    circle: '50%',
    none: '0'
  }
}
