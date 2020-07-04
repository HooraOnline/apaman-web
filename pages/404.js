// pages/mycart.js

import PanelLayout from "../src/components/layouts/panelLayout";
import React, {Component} from "react";
import MobileLayout from "../src/components/layouts/MobileLayout";
import {bgWhite, primaryDark} from "../src/constants/colors";
import {Toolbar,AndroidBackButton} from "../src/components";
import images from "../public/static/assets/images";
import Typography from "@material-ui/core/Typography";
import Router from "next/router";
import {View} from "../src/react-native";
import {navigation} from "../src/utils";
import Text from "../src/react-native/Text";
const onBackPressed=()=> {
    //window.history.back();
    Router.back();
}



export default class A404 extends Component{

    render(props) {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'آدرس اشتباه',

        };
        return (
            <MobileLayout
                title={`درباره ما`}
                header={ <Toolbar  customStyle={toolbarStyle}/>}

                style={{padding:'0',height:'fit-content'}}>

                <View style={{flex: 1, backgroundColor: '#F5F1F1',alignItems:'center'}}>
                    <Text style={{padding:20,fontSize:16,}}>چنین صفحه ای یافت نشد.</Text>
                </View>
            </MobileLayout>);
    }
    onBackPress=()=> {
        navigation.goBack();
    }
}
