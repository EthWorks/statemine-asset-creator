import styled, { css } from 'styled-components'

interface TextProps {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  className?: string
  green?: boolean
  pink?: boolean
  red?: boolean
  white?: boolean
}

export const TextBoldStyle = css`
  font-weight: 700;
`

const TextItalicStyle = css`
  font-style: italic;
`

const TextUnderlineStyle = css`
  text-decoration: underline;
`

const TextWhiteStyle = css`
  color: ${({ theme }) => theme.color.white};
`

const TextPinkStyle = css`
  color: ${({ theme }) => theme.color.pink};
`

const TextRedStyle = css`
  color: ${({ theme }) => theme.color.red};
`

const TextGreenStyle = css`
  color: ${({ theme }) => theme.color.green};
`

const TextAllStyles = css<TextProps>`
  ${({ bold }) => bold && TextBoldStyle};
  ${({ italic }) => italic && TextItalicStyle};
  ${({ underline }) => underline && TextUnderlineStyle};
  ${({ white }) => white ? TextWhiteStyle : ({ theme }) => theme.colors.gray[400]};
  ${({ pink }) => pink ? TextPinkStyle : ({ theme }) => theme.colors.gray[400]};
  ${({ red }) => red ? TextRedStyle : ({ theme }) => theme.colors.gray[400]};
  ${({ green }) => green ? TextGreenStyle : ({ theme }) => theme.colors.gray[400]};
`

export const TextXS = styled.p<TextProps>`
  font-size: 12px;
  line-height: 16px;
  ${TextAllStyles}
`

export const TextSM = styled.p<TextProps>`
  font-size: 14px;
  line-height: 20px;
  ${TextAllStyles}
`

export const TextBase = styled.p<TextProps>`
  font-size: 16px;
  line-height: 24px;
  ${TextAllStyles}
`

export const TextLg = styled.p<TextProps>`
  font-size: 18px;
  line-height: 28px;
  ${TextAllStyles}
`

export const TextXL = styled.p<TextProps>`
  font-size: 20px;
  line-height: 32px;
  ${TextAllStyles}
`

export const Text2xl = styled.p<TextProps>`
  font-size: 24px;
  line-height: 32px;
  ${TextAllStyles}
`

export const Text3xl = styled.p<TextProps>`
  font-size: 30px;
  line-height: 40px;
  ${TextAllStyles}
`

export const Text4xl = styled.p<TextProps>`
  font-size: 36px;
  line-height: 44px;
  ${TextAllStyles}
`

export const Text5xl = styled.p<TextProps>`
  font-size: 48px;
  line-height: 56px;
  ${TextAllStyles}
`

export const Text6xl = styled.p<TextProps>`
  font-size: 64px;
  line-height: 72px;
  ${TextAllStyles}
`
