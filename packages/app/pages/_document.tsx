import type { DocumentInitialProps, DocumentContext } from 'next/document'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext):  Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    return { ...initialProps }
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          <link rel="icon" href='/favicon.ico' />
        </Head>
        <body>
          <Main />c
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
