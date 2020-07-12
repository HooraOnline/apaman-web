import React, {PureComponent} from 'react';
import {FlatList, Image, Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View,} from '../src/react-native';
import {observer} from 'mobx-react';

import {AlertMessage, AndroidBackButton, Fab, LoadingPopUp, Toolbar} from '../src/components';
import NoticBoardCard from "../src/components/NoticBoardCard";
import images from "../public/static/assets/images";
import {bgEmpty, bgScreen, bgWhite, drawerItem, primaryDark} from '../src/constants/colors';
import {addNoticeBoardQuery, getNoticeBoardQuery} from '../src/network/Queries';
//ToDo Test callBack
/*
import  Toast from 'react-native-simple-toast';
*/
import {navigation, onScrollFab} from "../src/utils";
import {userStore} from '../src/stores';
import MobileLayout from "../src/components/layouts/MobileLayout";
import persistStore from "../src/stores/PersistStore";

const BORDER_RADIUS = 20;
const height = global.height;
const width = global.width;



@observer
export default class BankComback extends PureComponent {
    constructor() {
        super();
        this.state = {
            showOverlay: false,
            showDeletePopUp: false,
            showEditPopUp: false,
            showAddNewLabelPopUp: false,
            nominatedToDeleteItem: null,
            nominateToEditItem: null,
            loading: false,
            loadingMessage: '',
            idSwipeOpened: -1,
            noticBoards: [],
            isFabVisible: true,
            permission: {}
        };
    }

    componentDidMount() {
        debugger
       let params=navigation.getQueryParams();
        const routeName = global.WebBackScreenName || 'PayAnnounce';//queryString[1];
        const orderId = params.orderId;
        const payToken = params.Token;
        const callBackStatus = params.status;
        console.log(orderId);
        console.log(payToken);
        console.log(callBackStatus);
        navigation.navigate(routeName,{ orderId: orderId , payToken:payToken,paymentSuccess:true });
    }

    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'نتیجه تراکنش',
        };

        return (
            <MobileLayout
                header={<Toolbar customStyle={toolbarStyle}/>}
                footer={
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            backgroundColor: primaryDark
                        }}
                    >
                       <Text style={{padding:10,color:bgWhite}}>تایید</Text>
                    </View>
                }
            >
                <View style={{flex: 1,}}>
                    <Text style={{padding:24,}}>بازگشت از بانک</Text>
                </View>
            </MobileLayout>
        );
    }

    onBackPress() {
        navigation.goBack();
    }
}

