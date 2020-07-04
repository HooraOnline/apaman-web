import React, {PureComponent} from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    View,
    SwipeOut
} from '../../src/react-native';
import {observer} from 'mobx-react';

import {
    AlertMessage,
    AndroidBackButton,
    Fab,
    LoadingPopUp,
    Toolbar,

} from '../../src/components';
//import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';

import {bgEmpty, bgScreen, drawerItem, gray} from '../../src/constants/colors';
import {addCarQuery, getUnitCarQuery,} from '../../src/network/Queries';
import {persistStore, userStore} from '../../src/stores';
import {permissionId} from '../../src/constants/values';
//import Toast from 'react-native-simple-toast';
import {navigation, onScrollFab, waitForData} from '../../src/utils';
import IOSSwipeCard from "../../src/components/IOSSwipeCard";
import images from "../../public/static/assets/images";
import MobileLayout from "../../src/components/layouts/MobileLayout";
import Router from "next/router";
const BORDER_RADIUS = 20;
class CarItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    render() {
        const {BrandName, ModelName, ColorName, TagOne, TagCharacter, TagTwo, TagIran} = this.props.item;
        const {permission, idSwipeOpened, index} = this.props;
        return (
            <IOSSwipeCard
                noPadding
                index={index}
                style={{height:60}}
                permission={permission}
                onDelete={() => this.props.onSwipeRemove(this.props.item)}
                onEdit={() => this.props.navigateToEdit(this.props.item)}
                onClose={() => {
                }}
                onOpen={id => this.props.onOpenSwipe(id)}
                idSwipeOpened={idSwipeOpened}
            >
                <View style={{
                    flexDirection: 'column',
                    padding: 24,
                    paddingVertical: 20,
                    borderBottomWidth: 1,
                    borderColor: gray,

                }}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{
                            fontSize: 14, color: '#5D4A4A', fontFamily: 'IRANYekanFaNum-Bold',
                        }}>{BrandName.trim()}, {ModelName.trim()}, {ColorName.trim()}</Text>
                        <Text style={{
                            fontSize: 13, color: '#5D4A4A',
                        }}>{TagIran}  |  {TagTwo} {TagCharacter} {TagOne}</Text>
                    </View>
                </View>
            </IOSSwipeCard>
        );
    }
}

@observer
export default class Cars extends PureComponent {
    constructor() {
        super();
        this.state = {
            showOverlay: false,
            showDeletePopUp: false,
            showEditPopUp: false,
            goToAddCarScreen: false,
            nominatedToDeleteItem: null,
            nominateToEditItem: null,
            loading: false,
            loadingMessage: '',
            permission: userStore.findPermission(permissionId.car),
            idSwipeOpened: -1,
            cars: [],
            isFabVisible: true,
        };
    }

    componentDidMount() {
        waitForData(()=>{
            if(!this.state.permission){
                this.state.permission= userStore.findPermission(permissionId.car);
            }
            this.getCars();
        });
    }

    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'ماشین های من' ,
        };

        return (
            <MobileLayout style={{padding:0}} title={`ماشین های من`}>


                <View style={{flex: 1, backgroundColor: '#F5F1F1'}}>
                    <Toolbar customStyle={toolbarStyle}/>
                    {/* <NavigationEvents onWillFocus={payload => {
                        if (payload.action.type === 'Navigation/BACK') {
                            this.getCars();
                        }
                    }}/>*/}
                    <AndroidBackButton
                        onPress={() => {
                            if (
                                this.state.goToAddCarScreen ||
                                this.state.showEditPopUp
                            ) {
                                this.setState({
                                    goToAddCarScreen: false,
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
                        loading={this.state.loading}
                        style={{}}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.cars}
                        extraData={this.state.idSwipeOpened}
                        onScroll={this.onScrollFab}
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: '#D5CBCB',
                                }}
                            />
                        )}
                        ListEmptyComponent={
                            <View
                                style={{
                                    height: global.height - 90,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: this.state.cars.length > 0 ? bgScreen : bgEmpty
                                }}>
                                <Image
                                    source={images.es_accounts}
                                    style={{width: global.width, height: (global.width / 100) * 62}}
                                />
                                {this.state.permission && this.state.permission.writeAccess &&
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
                                        شما هنوز ماشین(های) خود را ثبت نکرده اید.
                                    </Text>

                                    <View style={{marginTop: 30}}>
                                        <Fab
                                            onPress={() => this.goToAddCarScreen()}
                                            icon={images.ic_AddCar}
                                            title={"افزودن ماشین"}
                                        />
                                    </View>
                                </View>
                                }


                            </View>
                        }
                        renderItem={({item, index}) => (
                            <CarItem
                                item={item}
                                index={index}
                                permission={this.state.permission}
                                onSwipeRemove={item => this.showDeletePopUp(item)}
                                navigateToEdit={item => this.goToEditCar(item)}
                                onOpenSwipe={id => this.onOpenSwipe(id)}
                                idSwipeOpened={this.state.idSwipeOpened}
                            />
                        )}
                    />

                    {this.state.cars.length > 0 && this.state.isFabVisible && this.state.permission && this.state.permission.writeAccess && (
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
                                onPress={() => this.goToAddCarScreen()}
                                icon={images.ic_AddCar}
                            />

                        </View>

                    )}

                    {this.state.showDeletePopUp && (
                        <AlertMessage
                            onModal
                            visible={this.state.showDeletePopUp}
                            title="حذف ماشین"
                            message={
                                'آیا از حذف ماشین ' + this.state.nominatedToDeleteItem.BrandName + ' مطمئن هستید؟'
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
        Router.back();
    }

    onOpenSwipe(index) {
        this.setState({idSwipeOpened: index});
    }

    async getCars() {
        Keyboard.dismiss();
        this.setState({loading: true, loadingMessage: 'در حال دریافت ...'});
        await getUnitCarQuery(userStore.UnitID)
            .then(result => {
                this.setState({loading: false, cars: result});
            })
            .catch(e => {
                this.setState({loading: false});
            });
    }

    async onSaveNewCar(item) {
        Keyboard.dismiss();
        this.setState({loading: true, loadingMessage: 'در حال ذخیره ...'});

        await addCarQuery(item).then(() => {
            this.dismissAll();
            this.getCars()
        }).catch(e => this.setState({loading: false}));

    }

    async onConfirmDelete() {
        this.setState({loading: true, loadingMessage: 'در حال حذف ...', showDeletePopUp: false});
        const {ID} = this.state.nominatedToDeleteItem;
        await addCarQuery({
            ID: ID,
            isDisabled: true,
            BuildingID: userStore.BuildingID,
            UnitID: userStore.UnitID,
            RoleID:userStore.RoleID,
            CreatedUnitID: userStore.UnitID,
        })
            .then(() => {
                this.setState({loading: false});
                this.getCars();
            })
            .catch(e => {
               // Toast.show('remove Failed!!!', Toast.LONG);
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

    goToEditCar(item) {
        navigation.navigate('/car/AddCar', {
            item: item,
            onSave: (item) => this.onSaveNewCar(item)
        });
    }

    goToAddCarScreen() {
        Router.push({
            pathname: '/car/AddCar',

        })
       /* this.props.navigation.navigate('AddCar', {
            onSave: (item) => this.onSaveNewCar(item)
        });*/

    }

    dismissAll() {
        this.setState({
            showOverlay: false,
            showDeletePopUp: false,
            showEditPopUp: false,
            goToAddCarScreen: false,
            nominatedToDeleteItem: null,
            nominateToEditItem: null,
        });
    }

    onScrollFab = event => {
        const fabStatus = onScrollFab(event, this._listViewOffset);
        this._listViewOffset = fabStatus.currentOffset;
        if (fabStatus.isFabVisible !== this.state.isFabVisible) {
            // LayoutAnimation.configureNext(fabStatus.customLayoutLinear);
            this.setState({isFabVisible: fabStatus.isFabVisible});
        }
    };
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
