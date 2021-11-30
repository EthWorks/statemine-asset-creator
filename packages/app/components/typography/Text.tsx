import styled, { css } from 'styled-components'

import { ColorType } from '../../styles/styleVariables'

type TextSize = 'XXS' | 'XS' | 'SM' | 'Base' | 'Lg' | 'XL' | '2XL' | '3XL'| '4XL'| '5XL'| '6XL'

export interface TextProps {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  className?: string
  color?: ColorType;
  size?: TextSize;
}

const TextBoldStyle = css`
  font-weight: 700;
`

const TextItalicStyle = css`
  font-style: italic;
`

const TextUnderlineStyle = css`
  text-decoration: underline;
`

export const Text = styled.p<TextProps>`
  ${({ bold }) => bold && TextBoldStyle};
  ${({ italic }) => italic && TextItalicStyle};
  ${({ underline }) => underline && TextUnderlineStyle};
  color: ${({ theme, color }) => color ? theme.colors[color] : theme.colors.gray[400]};
  font-size: ${({ size }) => size ? sizes[size].fontSize : sizes.Base.fontSize};
  line-height: ${({ size }) => size ? sizes[size].lineHeight : sizes.Base.lineHeight};
`

interface TextProperties {
  fontSize: string;
  lineHeight: string;
}

const sizes: Record<TextSize, TextProperties> = {
  XXS: {
    fontSize: '10px',
    lineHeight: '16px'
  },
  XS: {
    fontSize: '12px',
    lineHeight: '16px'
  },
  SM: {
    fontSize: '14px',
    lineHeight: '20px'
  },
  Base: {
    fontSize: '16px',
    lineHeight: '24px'
  },
  Lg: {
    fontSize: '18px',
    lineHeight: '28px'
  },
  XL: {
    fontSize: '20px',
    lineHeight: '32px'
  },
  '2XL': {
    fontSize: '24px',
    lineHeight: '32px'
  },
  '3XL': {
    fontSize: '30px',
    lineHeight: '40px'
  },
  '4XL': {
    fontSize: '36px',
    lineHeight: '44px'
  },
  '5XL': {
    fontSize: '48px',
    lineHeight: '56px'
  },
  '6XL': {
    fontSize: '64px',
    lineHeight: '72px'
  }
}
