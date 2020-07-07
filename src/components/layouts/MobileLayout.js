
import {bgScreen} from "../../constants/colors";
import Head from "next/head";
import persistStore from "../../stores/PersistStore";
import userStore from "../../stores/User";
import accountsStore from "../../stores/Accounts";
import {observer} from 'mobx-react';
import {permissionId} from "../../constants/values";
import React, {useEffect, useState,useRef} from "react";
import "./Layout.scss";
import "./index.scss";
import Router from "next/router";
import {getUserBalance} from "../../network/Queries";
import {fetchStore, getWidth, deviceWide, height, showMassage, Platform} from "../../utils";
import NavFooterButtons from "./footerButtons";
import DrawerPanel from "./DrawerPanel";
import ToastCard from "../ToastCard";
import {globalState} from "../../stores";
import {TouchableOpacity} from "../../react-native";
import {View} from "../../react-native";
import Typography from "@material-ui/core/Typography";
import images from "../../../public/static/assets/images";


const  maxWidth=700;
const MobileLayout = observer( props => {
    const [showToast, setShowToast] = useState();
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [accountSelectorVisible, setAccountSelectorVisible] = useState(false);
    const [screenwidth, setScreenwidth] = useState(900);
    const [isWide, setIsWide] = useState(false);
    let costPermission=null;
    let payAnnouncePermissioin=null;
    const ref = useRef(null);
    const selecetRole=(status)=> {
        setAccountSelectorVisible(status);
        getBalance();
    }
    let initDrawer=null;
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
        if(userStore.RoleID){
            return ;
        }
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

        //props.child && props.child.render()
    }
    const manageResizeScreen=()=> {
        setIsWide(deviceWide());
        setScreenwidth(width);
        global.deviceWidth=window.innerWidth

        const width = ref.current ? ref.current.offsetWidth : maxWidth;
        const height = ref.current ? ref.current.offsetHeight : 800;
        global.width=width;
        global.height=height;
        document.body.onresize = () => {
            if(ref.current){
                setScreenwidth(ref.current.offsetWidth);
                global.width=ref.current.offsetWidth;
                global.height=ref.current.offsetHeight;
                window.ss=ref.current
                props.onResizeScreen && props.onResizeScreen(ref.current.offsetWidth,ref.current.offsetHeight);
            }
        };
    }
    const closeMenuinSmallDevice=()=>{
        if(global.deviceWidth<1000){
            globalState.showMenu=false;
        }
    }
    useEffect(() => {
        init();
        document.title = props.title;
        manageResizeScreen();
        closeMenuinSmallDevice();
        if(initDrawer &&  props.onRef ){
            props.onRef(initDrawer);
        }
    },  [ref.current]);

    return (
        <div  dir={"rtl"}  style={{ display: 'flex',flex:1,  justifyContent:'center',  height: '100%',backgroundImage22: `url(${images.publicPg})`}}>
            <DrawerPanel
                onRef={initDrawerData=>initDrawer=initDrawerData}
                title={'منوی من'} open={props.showMenu || globalState.showMenu  }
                onClose={()=> globalState.showMenu=false}>
            </DrawerPanel>
            <div
                ref={ref} dir={"rtl"}
                style={{
                    display:'flex',
                    flex:1,
                    maxWidth:maxWidth,
                    width:'100%',
                    backgroundColor:bgScreen,
                    flexDirection:'column',
                    margin:isWide?3:0,paddingTop:props.header?63:0,
                    position:'relative',
            }}>
               <div id={"header"} style={{position:'fixed',top:0,zIndex:4,width:global.width}}>
                    {props.header}
                </div>
                <View id={'body'} style={{height:'100%',padding:0 , width:'100%',marginBottom:props.footer?0:0}}>
                        {props.children}
                </View>
               <div style={{position:'fixed',zIndex:4,bottom:0,width:global.width,}}>
                    {props.footer}
                </div>
                <ToastCard
                    visible={globalState.toastCard}
                    type={globalState.toastType}
                    title={globalState.toastTitle}
                    message={globalState.responseMessage}
                    onClose={() => globalState.hideToastCard()}
                />
           </div>
        </div>
    );
});

export default MobileLayout;
