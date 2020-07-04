/*!

=========================================================
* NextJS Material Kit v1.0.0 based on Material Kit Free - v2.0.2 (Bootstrap 4.0.0 Final Edition) and Material Kit React v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-kit
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-kit/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

import { appWithTranslation } from '../i18n'
import { fetchStore } from "../src/utils";

//import PageChange from "components_creative/PageChange/PageChange.js";

//import "assets/scss/nextjs-material-kit.scss?v=1.0.0";
//import "assets/css/apamanGlobal.css";
import persistStore from "../src/stores/PersistStore";
import { accountsStore, userStore } from "../src/stores";
import { loginQuery } from "../src/network/Queries";

//******************


import Layout from "../src/components/Layout";


Router.events.on("routeChangeStart", url => {
  console.log(`Loading: ${url}`);
  document.body.classList.add("body-page-transition");
 /* if (url == '/home') {
    ReactDOM.render(
      <PageChange path={url} />, document.getElementById("page-transition")
    );
  }*/

});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }
  async componentDidMount() {
    await fetchStore();
    let comment = document.createComment(``);
    document.insertBefore(comment, document.documentElement);
    this.loadUserData();

  }
/*  async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    console.warn("@@@@@@@@@@ App nextJs INIT");
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }*/

  loadUserData = (status) => {
    if (persistStore.token) {
      console.log('**** Have Token ****');
      try {
        if (accountsStore.accounts.length > 1) {
          if (persistStore.selected === 0) {
            userStore.setUser(accountsStore.accounts[0]);
          } else {
            userStore.setUser(accountsStore.accounts.find(account => account.ID === persistStore.selected));
          }
        } else if (accountsStore.accounts.length === 1) {
          userStore.setUser(accountsStore.accounts[0]);
        }
        loginQuery(persistStore.username, null);

      } catch (error) {
        console.log('catch Token : ', error);
      }
    }


  }


  render() {
    const { Component, pageProps,router,  } = this.props;
    const title = 'اپامن'
    return (
        <>
          <Layout>
            <Component router={router} {...pageProps} {...this.state} />
          </Layout>
        </>
    )


    //return <Component {...pageProps} {...this.state} />
  }
}
export default MyApp


/*export default withRedux(createStore())(
    withRouter(MyApp)
)*/
//export default appWithTranslation(MyApp)