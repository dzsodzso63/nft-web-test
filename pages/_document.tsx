import Document, { DocumentContext } from 'next/document'
import { createGlobalStyle, ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<><GlobalStyle /><App {...props} /></>),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #202020;
  }
  * {
    margin: 0px;
    padding: 0px;
  }
`
