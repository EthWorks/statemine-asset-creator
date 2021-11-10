import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
  }
  
  button {
    font-family: 'Space Grotesk', sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
  
  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
  }
`

export default GlobalStyle
