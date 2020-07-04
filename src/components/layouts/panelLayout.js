// components/Layout.js
import Head from "next/head";
import Header from "./Header";
import NavBar from "./NavBar";
import NavFooterButtons from "./footerButtons";
//import MenuBar from "./MenuBar";
import persistStore from "../../stores/PersistStore";
import userStore from "../../stores/User";
import accountsStore from "../../stores/Accounts";
import {permissionId} from "../../constants/values";
import {useEffect, useState} from "react";
import "./Layout.scss";
import "./index.scss";
import Router from "next/router";
import {getUserBalance} from "../../network/Queries";
import {fetchStore} from "../../utils";

const PanelLayout = props => {
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [accountSelectorVisible, setAccountSelectorVisible] = useState(false);
    let costPermission=null;
    let payAnnouncePermissioin=null;
    const selecetRole=(status)=> {
        setAccountSelectorVisible(status);
        getBalance()
    }

    const getBalance=async()=> {
        setLoadingBalance(true)
        getUserBalance()
            .then(result => {
                updateBalance(result);
            })
            .catch(e => {
                console.log('********* getUserBalance catch e:', e);
                setLoadingBalance(false)
                // Toast.show(e.errMessage, Toast.LONG);
            });

    }

    const updateBalance=(newBalance)=> {
        accountsStore.accounts = accountsStore.accounts.map(function (item) {
            if (item.UnitID) {
                const target = newBalance.find(obj => obj.UnitID === item.UnitID);
                item.UnitBalance = target.UnitBalance;
                return item;
            } else {
                return item;
            }
        });
    }

    const onRoleSelected=(item)=> {
        persistStore.selected = item.ID;
        userStore.setUser(item);
        userStore.setUnitBalance(item.UnitBalance);
        costPermission = userStore.findPermission(permissionId.costCalculation);
        payAnnouncePermissioin = userStore.findPermission(userStore.RoleID === 1 ? permissionId.manualPay : permissionId.pay);
    }

    const init=async()=> {
        await fetchStore();
        if (!persistStore.token) {
            Router.push('/login');
            return;
        }

        if (accountsStore.accounts.length > 1) {
            if (persistStore.selected === 0) {
                persistStore.selected=accountsStore.accounts[0].ID
                userStore.setUser(accountsStore.accounts[0]);
                selecetRole(true);
                // this.setState({showAccountSelect: true});
            } else {
                let selecteAccount=accountsStore.accounts.find(account => account.ID === persistStore.selected,);
                userStore.setUser(selecteAccount);
            }
        } else if (accountsStore.accounts.length === 1) {
            persistStore.selected = accountsStore.accounts[0].ID;
            userStore.setUser(accountsStore.accounts[0]);
        }
        costPermission = userStore.findPermission(
            permissionId.costCalculation,
        );
        payAnnouncePermissioin = userStore.findPermission(
            userStore.RoleID === 1 ? permissionId.manualPay : permissionId.pay,
        );
    }

    useEffect(() => {
        init();
    }, []);


  return (
    <div dir={"rtl"}  className="Layout">
      <Head>
        <title>{props.title}</title>
      </Head>
     {/* <Header appTitle={props.title} />*/}
      <div className="Content">
        {/*  <MenuBar title={props.title} onRoleSelected={props.onRoleSelected}  navButtons={NavFooterButtons}>{props.children}</MenuBar>*/}
      </div>
      <NavBar navButtons={NavFooterButtons}/>
    </div>
  );
};

export default PanelLayout;
