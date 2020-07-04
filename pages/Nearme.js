import React, {PureComponent} from 'react';
import {
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,

    View,
} from '../src/react-native';
import {observer} from 'mobx-react';

import images from "public/static/assets/images";
import {bgEmpty, bgScreen, drawerItem, primaryDark} from '../src/constants/colors';

import {userStore} from '../src/stores';

import {permissionId} from '../src/constants/values';


const BORDER_RADIUS = 20;


@observer
export default class NearMe extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showOverlay: false,
            showDeletePopUp: false,
            showEditPopUp: false,
            showAddNewLabelPopUp: false,
            nominatedToDeleteItem: null,
            nominateToEditItem: null,
            loading: false,
            loadingMessage: '',
            permission: userStore.findPermission(permissionId.noticBoard),
            idSwipeOpened: -1,
            dataList: [],
            isFabVisible: true,
        };
    }

    componentDidMount() {

    }

    render() {

        return (
            <View style={{flex: 1, backgroundColor: '#F5F1F1'}}>
                <FlatList
                    ItemSeparatorComponent={() => (
                        <View
                            style={{
                                height: 1,
                                backgroundColor: '#D5CBCB',
                            }}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.dataList}
                    extraData={this.state.idSwipeOpened}
                    onScroll={this.onScrollFab}
                    ListEmptyComponent={
                        <View
                            style={{
                                height: height - 150,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: this.state.dataList.length > 0 ? bgScreen : bgEmpty
                            }}>
                            <Image
                                source={images.es_InProgress}
                                style={{width: width, height: (width / 100) * 62}}
                            />


                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-ExtraBold'
                                            : 'IRANYekanExtraBold',
                                    fontSize: 16,
                                    textAlign: 'center',
                                }}>
                                فعلا در منطقه شما فعال نیست.
                            </Text>
                        </View>
                    }
                    renderItem={({item, index}) => (
                        <View></View>
                    )}
                />





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
