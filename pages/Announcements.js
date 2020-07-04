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
class Announcements extends PureComponent {
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

@observer
export default class NoticBoard extends PureComponent {
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
            permission: userStore.findPermission(permissionId.noticBoard),
            idSwipeOpened: -1,
            noticBoards: [],
            isFabVisible: true,
        };
    }

    componentDidMount() {
        this.getNoticsBoard();
    }

    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'تابلو اعلانات',
        };

        return (
    <MobileLayout title={`تابلو اعلانات`}>
    <View style={{flex: 1, backgroundColor: '#F5F1F1'}}>
                <Toolbar customStyle={toolbarStyle}/>
                <AndroidBackButton
                    onPress={() => {
                        if (
                            this.state.showAddNewLabelPopUp ||
                            this.state.showEditPopUp
                        ) {
                            this.setState({
                                showAddNewLabelPopUp: false,
                                showOverlay: false,
                                showEditPopUp: false,
                                nominateToEditItem: null,
                            });
                        } else if (this.state.showDeletePopUp) {
                            this.setState({
                                showOverlay: false,
                                showDeletePopUp: false,
                                nominatedToDeleteItem: null,
                            });
                        } else {
                            this.onBackPress();
                        }
                        return true;
                    }}
                />

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
                    data={this.state.noticBoards}
                    extraData={this.state.idSwipeOpened}
                    onScroll={this.onScrollFab}
                    ListEmptyComponent={
                        <View
                            style={{
                                height: height - 90,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: this.state.noticBoards.length > 0 ? bgScreen : bgEmpty
                            }}>
                            <Image
                                source={images.es_board}
                                style={{width: width, height: (width / 100) * 62}}
                            />


                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-ExtraBold'
                                            : 'IRANYekanExtraBold',
                                    fontSize: 18,
                                    textAlign: 'center',
                                }}>
                                تابلو اعلانات خالی است
                            </Text>
                            {this.state.permission.writeAccess &&
                            <View
                                pointerEvents="box-none"
                                style={{
                                    //...StyleSheet.absoluteFillObject,
                                    alignItems: 'center',
                                    //justifyContent: 'flex-end',
                                    //flex: 1,
                                    //marginBottom: 50,

                                }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: drawerItem,
                                        textAlign: 'center',

                                    }}>
                                    شما هنوز اعلانی برای اهالی ثبت نکرده‌‎اید.
                                </Text>

                                <View style={{marginTop:30}}>
                                    <Fab
                                        onPress={() => this.showAddNewLabelPopUp()}
                                        icon={images.ic_addbroadcast}
                                        title={"اعلان جدید"}
                                    />
                                </View>
                            </View>
                            }


                        </View>
                    }
                    renderItem={({item, index}) => (
                        <NoticBoardCard
                            item={item}
                            index={index}
                            permission={this.state.permission}
                            onSwipeRemove={item => this.showDeletePopUp(item)}
                            navigateToEdit={item => this.showEditPopUp(item)}
                            onOpenSwipe={id => this.onOpenSwipe(id)}
                            idSwipeOpened={this.state.idSwipeOpened}
                        />
                    )}
                />

                {this.state.noticBoards.length > 0 && this.state.isFabVisible && this.state.permission.writeAccess && (
                    <View
                        pointerEvents="box-none"
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            flex: 1,
                            padding: 16,
                        }}
                    >
                        <Fab
                            onPress={() => this.showAddNewLabelPopUp()}
                            icon={images.ic_add}
                        />
                    </View>
                )}

                {this.state.showDeletePopUp && (
                    <AlertMessage
                        visible={this.state.showDeletePopUp}
                        title="حذف واحد"
                        message={
                            'آیا از حذف اعلان ' + this.state.nominatedToDeleteItem.Title + ' مطمئن هستید؟'
                        }
                        onConfirm={() => {
                            this.setState({showDeletePopUp: false});
                            this.onConfirmDelete();
                        }}
                        onDismiss={() => this.setState({showDeletePopUp: false})}
                        confirmTitle="بله"
                        dismissTitle="خیر"
                    />
                )}

                <LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage}/>

            </View>
    </MobileLayout>
        );
    }


    // findPermission(itemId) {
    //   return userStore.Form.find(o => o.formID === itemId);
    // }

    onBackPress() {
        this.props.navigation.goBack();
    }

    onOpenSwipe(index) {
        this.setState({idSwipeOpened: index});
    }

    async getNoticsBoard() {
        Keyboard.dismiss();
        this.setState({loading: true, loadingMessage: 'در حال دریافت ...'});
        await getNoticeBoardQuery()
            .then(result => this.setState({loading: false, noticBoards: result}))
            .catch(e => this.setState({loading: false}));
    }

    async onConfirmNewLabel(item) {
        Keyboard.dismiss();
        this.setState({loading: true, loadingMessage: 'در حال ذخیره ...'});

        // const {
        //   title,
        //   message,
        //   DestinationBuildingID,
        //   DestinationRoleID,
        // } = item;

        // let data = {
        //   title                       : title,
        //   description                 : message,
        //   DestinationBuildingID       : DestinationBuildingID,
        //   DestinationRoleID           : DestinationRoleID.length == persistStore.roles.length ? null : DestinationRoleID,
        //   BuildingID                  : userStore.BuildingID,
        //   UnitID                      : userStore.UnitID,
        // }
        // if (item.id) {
        //   data = Object.assign(data, { ID: this.state.id });
        // }
        // item = Object.assign(item, {BuildingID: userStore.BuildingID, UnitID: userStore.UnitID});

        await addNoticeBoardQuery(item).then(() => {
            this.dismissAll();
            this.getNoticsBoard()
        }).catch(e => this.setState({loading: false}));

    }

    async onConfirmDelete() {
        this.setState({loading: true, loadingMessage: 'در حال حذف ...', showDeletePopUp: false});
        const {ID} = this.state.nominatedToDeleteItem;
        await addNoticeBoardQuery({
            ID: ID,
            isDisabled: true,
            BuildingID: userStore.BuildingID,
            UnitID: userStore.UnitID,
        })
            .then(() => {
                this.dismissAll();
                this.getNoticsBoard()
            })
            .catch(e => {
                Toast.show('remove Failed!!!', Toast.LONG);
                this.setState({loading: false});
            });


    }

    showDeletePopUp(item) {
        this.setState({
            showOverlay: true,
            showDeletePopUp: true,
            nominatedToDeleteItem: item,
        });
    }

    showEditPopUp(item) {
        this.props.navigation.navigate('AddMessage', {item: item,
            onSave: (item) => this.onConfirmNewLabel(item)});
        // this.setState({
        //     showOverlay: true,
        //     showEditPopUp: true,
        //     nominateToEditItem: item,
        // });
    }

    showAddNewLabelPopUp() {
        Router.push({
            pathname: '/AddMessage',
        })
      /*  this.props.navigation.navigate('AddMessage', {
            onSave: (item) => this.onConfirmNewLabel(item)});*/
        //     showAddNewLabelPopUp: true,
        // });
    }

    dismissAll() {
        this.setState({
            showOverlay: false,
            showDeletePopUp: false,
            showEditPopUp: false,
            showAddNewLabelPopUp: false,
            nominatedToDeleteItem: null,
            nominateToEditItem: null,
        });
    }

    /*onScrollFab = event => {
        const fabStatus = onScrollFab(event, this._listViewOffset);
        this._listViewOffset = fabStatus.currentOffset;
        if (fabStatus.isFabVisible !== this.state.isFabVisible) {
            LayoutAnimation.configureNext(fabStatus.customLayoutLinear);
            this.setState({isFabVisible: fabStatus.isFabVisible});
        }
    };*/
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
