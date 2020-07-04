import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/styles";

class MyDocument extends Document {
  render() {
    return (
        <html lang="en">
        <Head>
          <meta charSet="UTF-8"/>
          <link rel="icon" href="../static/logo.png"/>
          <meta name="description" content={ 'مدیریت هوشمند ساختمان'}/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="../static/assets/global.css"/>
          <link rel="stylesheet" href="../static/assets/iconfont.css"/>
          <link rel="shortcut icon" href="/static/icon.png"/>
          <link rel="apple-touch-icon" href="/static/icon.png"/>
          <link rel="apple-touch-icon" href="/static/apple-touch-icon.png"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link rel="manifest" href="/static/manifest.webmanifest"/>
          <meta name="theme-color" content="#ff6600"/>
          <meta name="apple-mobile-web-app-title" content="Hacker News"/>
          <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
          <meta name="apple-mobile-web-app-capable" content="yes"/>
          <meta name="mobile-web-app-capable" content="yes"/>



          <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#000000" />
        {/*  <link rel="shortcut icon" href={require("../assets/logo.png")} />
          <link
              rel="apple-touch-icon"
              sizes="76x76"
              href={require("../assets/logo.png")}
          />*/}


          <link
              rel="stylesheet"
              type="text/css"
              href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons"
          />
          <link
              href="https://use.fontawesome.com/releases/v5.0.10/css/all.css"
              rel="stylesheet"
          />


        </Head>
        <body>
        <div id="page-transition"></div>
        <Main />
        <NextScript />
        </body>
        </html>
    );
  }
}

/*MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />)
      });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      <React.Fragment key="styles">
        {initialProps.styles}
        {sheets.getStyleElement()}
      </React.Fragment>
    ]
  };
};*/

export default MyDocument;
