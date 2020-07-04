
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
import {fetchStore, getWidth, deviceWide, height, showMassage} from "../../utils";
import NavFooterButtons from "./footerButtons";
import DrawerPanel from "./DrawerPanel";
import ToastCard from "../ToastCard";
import {globalState} from "../../stores";
import {TouchableOpacity} from "../../react-native";
import {View} from "../../react-native";


const BaseLayout = observer( props => {
    const [showToast, setShowToast] = useState();
    const [screenwidth, setScreenwidth] = useState(900);
    const [isWide, setIsWide] = useState(false);
    const ref = useRef(null);

    const manageResizeScreen=()=> {
        setIsWide(deviceWide());
        setScreenwidth(width);
        const width = ref.current ? ref.current.offsetWidth : 700;
        const height = ref.current ? ref.current.offsetHeight : 700;
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

    useEffect(() => {
        document.title = props.title;
        manageResizeScreen();
    },  [ref.current]);

  return (
    <div dir={global.isRtl || "rtl"}  style={{ display: 'flex',flex:1,  justifyContent:'center',  height: '100%'}}>
        <View  ref={ref} dir={"rtl"} style={[{flex:1,maxWidth:props.maxWidth || 700 ,position:'relative', backgroundColor:screenwidth<700?bgScreen:bgScreen,flexDirection:'column',margin:  isWide?0:0 },props.style]}>
            {props.children}
            <ToastCard
                visible={globalState.toastCard}
                type={globalState.toastType}
                title={globalState.toastTitle}
                message={globalState.responseMessage}
                onClose={() => globalState.hideToastCard()}
            />

        </View>
    </div>
  );
});

export default BaseLayout;
