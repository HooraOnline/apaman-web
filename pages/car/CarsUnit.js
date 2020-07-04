import React, {PureComponent} from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
} from "../../src/react-native";
import {observer} from 'mobx-react';
import Router from "next/router";
import {
    LoadingPopUp,
    Toolbar
} from '../../src/components';
import images from "../../public/static/assets/images";
import {bgEmpty, bgScreen, border, drawerItem, gray, primaryDark} from '../../src/constants/colors';
import { getUnitCarQuery} from '../../src/network/Queries';

import {globalState, userStore} from '../../src/stores';
import {permissionId} from '../../src/constants/values';
import MobileLayout from "../../src/components/layouts/MobileLayout";
const BORDER_RADIUS = 20;

import { useRouter } from 'next/router'
import persistStore from "../../src/stores/PersistStore";
import {waitForData} from "../../src/utils";
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

            <View style={{
                flexDirection: 'column',
                padding: 24,
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderColor: gray
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
        );
    }
}

@observer
export default class CarsUnit extends PureComponent {
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

        this.UnitID =Router.query.UnitID;
        this.UnitNumber =Router.query.UnitNumber ;
        this.UserName = Router.query.UserName;
        //this.UserName = this.props.navigation.getParam('UserName', null);
        waitForData(()=>this.getCars());

    }

    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title:'ماشین های '+ this.UserName,
        };

        return (
            <MobileLayout style={{padding:0}} title={`ماشین های کاربر`}>
                <View style={{flex: 1, backgroundColor: '#F5F1F1'}}>
                    <Toolbar customStyle={toolbarStyle}/>
                   {/* <NavigationEvents onWillFocus={payload => {
                        if (payload.action.type === 'Navigation/BACK') {
                            this.getCars();
                        }
                    }}/>*/}
                    {/*<AndroidBackButton
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
                    />*/}

                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.cars}
                        extraData={this.state.idSwipeOpened}
                        onScroll={this.onScrollFab}
                        loading={this.state.loading}
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



                            </View>
                        }
                        renderItem={({item, index}) => (
                            <CarItem
                                item={item}
                            />
                        )}
                    />
                    {/*<LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage}/>*/}

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
        this.setState({loading: true, loadingMessage: 'در حال دریافت ...'});
        await getUnitCarQuery(this.UnitID,true)
            .then(result => {

                console.log(result);
                this.setState({loading: false, cars: result});
            })
            .catch(e => {
                console.log(e);
                this.setState({loading: false});
                globalState.showToastCard()
            });
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
