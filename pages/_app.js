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

//import { appWithTranslation } from '../i18n'
import { fetchStore } from "../src/utils";

//import PageChange from "components_creative/PageChange/PageChange.js";

//import "assets/scss/nextjs-material-kit.scss?v=1.0.0";
//import "assets/css/apamanGlobal.css";
import persistStore from "../src/stores/PersistStore";
import { accountsStore, userStore } from "../src/stores";
import { loginQuery } from "../src/network/Queries";

//******************


import Layout from "../src/components/Layout";


import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';



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
 static async getInitialProps22({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }
  viewportHandler=(event)=> {
    // NOTE: This doesn't actually work at time of writing
    if (event.target.scale > 3) {
      document.body.classList.remove("hide-text");
    } else {
      document.body.classList.add("hide-text");
    }
  }
  async componentDidMount() {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
      let viewportmeta = document.querySelector('meta[name="viewport"]');
      if(viewportmeta===null){
        viewportmeta = document.createElement("meta");
        viewportmeta.setAttribute("name","viewport");
        document.head.appendChild(viewportmeta);
        viewportmeta = document.querySelector('meta[name="viewport"]');
       /* document.body.addEventListener('gesturestart', function () {
          viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.0,user-scalable=no';
        }, false);*/
      }
      viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no");
      console.log(document.querySelector('meta[name="viewport"]'));
    }
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
    const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

    const theme = createMuiTheme({
          direction: 'rtl',
      });
    return (
        <>
            <StylesProvider jss={jss}>
                <Layout>
                    <Component router={router} {...pageProps} {...this.state} />
                </Layout>
            </StylesProvider>

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
