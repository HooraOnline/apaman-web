import React,{PureComponent} from "react";
import PanelLayout from "../src/components/layouts/panelLayout";

import {
    FlatList,
    Image,
    Keyboard,
    LayoutAnimation,
    Platform, SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions
} from '../src/react-native';
import {observer} from 'mobx-react';
import {
    AddMessagePopUp,
    AlertMessage,
    AndroidBackButton, CostCard,
    Fab,
    LoadingPopUp,
    Overlay,
    Toolbar
} from '../src/components';
import NoticBoardCard from "../src/components/NoticBoardCard";
import images from "../public/static/assets/images";
import {bgEmpty, bgScreen, drawerItem, primaryDark} from '../src/constants/colors';
import {addNoticeBoardQuery, getNoticeBoardQuery} from '../src/network/Queries';

import {userStore} from '../src/stores';

import {permissionId} from '../src/constants/values';
/*import Toast from 'react-native-simple-toast';*/
import {mapNumbersToEnglish, onScrollFab} from '../src/utils';
import MobileLayout from "../src/components/layouts/MobileLayout";
import Router from "next/router";
/*import Collapsible from "react-native-collapsible";*/

const BORDER_RADIUS = 20;
export default class Announcements extends PureComponent {
    render() {
        const {confirm, dismiss, title} = this.props;
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                    paddingTop: 16,
                    paddingBottom: 8,
                    paddingHorizontal: 8,
                    width: 300,
                    height: 120,
                    justifyContent: 'space-between',
                    borderRadius: 4,
                }}
            >
                <Text style={{alignSelf: 'flex-start'}}>
                    آیا از حذف "{title}" مطمئن هستید؟
                </Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={confirm} style={{paddingHorizontal: 16}}>
                        <Text style={{color: primaryDark}}>تایید</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={dismiss} style={{paddingHorizontal: 16}}>
                        <Text style={{color: primaryDark}}>انصراف</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    button: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    rightStyle: {
        borderBottomEndRadius: BORDER_RADIUS,
        borderTopEndRadius: BORDER_RADIUS,
    },
    leftStyle: {
        borderBottomStartRadius: BORDER_RADIUS,
        borderTopStartRadius: BORDER_RADIUS,
    },
    selectedButton: {
        backgroundColor: '#00c9cb',
    },
    unselecetedButton: {
        backgroundColor: 'white',
    },
    text: {
        fontSize: 14,
    },
    selectedText: {
        color: 'white',
    },
    unselectedText: {color: '#00c9cb'},
});
