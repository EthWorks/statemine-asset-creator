import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @import url('href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"');
  
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

  a {
    color: inherit;
    text-decoration: none;
  }
  
  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
  }
`

export default GlobalStyle
