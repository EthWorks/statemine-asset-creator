type GrayShadeTypes = 'gray50' | 'gray300' | 'gray400' | 'gray500'| 'gray600' | 'gray700' | 'gray800' | 'gray900'
type AppColorTypes = 'black' | 'blue' | 'green' | 'indigo' | 'pinkLight' | 'pinkDark' | 'red' | 'redDark' | 'white'
export type BorderRadiusType = 's' | 'm' | 'l' | 'circle' | 'none'

export type ColorType = GrayShadeTypes | AppColorTypes
export type Colors = Record<ColorType, string>
export type BorderRadius = Record<BorderRadiusType, string>

interface Theme {
  colors: Colors,
  borderRadius: BorderRadius
}

export const theme: Theme = {
  colors: {
    gray50: '#FAFAFA',
    gray300: '#D4D4D4',
    gray400: '#A3A3A3',
    gray500: '#737373',
    gray600: '#525252',
    gray700: '#404040',
    gray800: '#262626',
    gray900: '#171717',
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
