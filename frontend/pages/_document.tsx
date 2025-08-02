import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preload" href="/fonts/chakobsa.ttf" as="font" crossOrigin="anonymous" />
          <style>{`@font-face{font-family:'Chakobsa';src:url('/fonts/chakobsa.ttf') format('truetype');}`}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
