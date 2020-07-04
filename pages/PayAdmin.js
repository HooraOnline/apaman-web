import React, {PureComponent} from 'react';
import {FlatList, Icon, IconApp, Image, Keyboard, Platform, StyleSheet, Text, View} from '../src/react-native';

import {AndroidBackButton, CardUnitInfo, IOSSwipeCard, LoadingPopUp, SnakePopup, Toolbar} from '../src/components';
import images from "../public/static/assets/images";
import {
    bgEmpty,
    bgScreen,
    bgSuccessLight,
    primaryDark,
    subTextItem,
    success,
    successLight,
    textDisabled,
    textRed,
    textRedLight,
} from '../src/constants/colors';

import {globalState, persistStore, userStore} from '../src/stores';
import {permissionId} from '../src/constants/values';
import {searchUserQuery} from '../src/network/Queries';
import {compare2sort, mapNumbersToEnglish, navigation, waitForData} from '../src/utils';
import accounting from 'accounting';
//import {NavigationEvents} from 'react-navigation';
//import Communications from 'react-native-communications';
import MobileLayout from "../src/components/layouts/MobileLayout";
import Router from "next/router";



class UserCard extends PureComponent {
    constructor() {
        super();

        this.state = {
            isOpen: false,
        };
    }

    render() {
        const {style,item, onPress} = this.props;
        return (
            <IOSSwipeCard
                index={this.props.index}
                onItemPress={() => onPress(item)}
                style={style}
                moreLabel={'تماس'}
                onMore={() => this.props.onCallPressed(this.props.item)}
                moreIcon={images.ic_call}
                moreColor="#1CC4AD"

                onClose={() => this.setState({isOpen: true})}
                onOpen={id => {
                    this.props.onOpenSwipe(id);
                    this.setState({isOpen: false});
                }}
                idSwipeOpened={this.props.idSwipeOpened}>
                <CardUnitInfo
                  //  openable
                    isOpen={this.state.isOpen}
                    unitNumber={item.UnitNumber}
                    floorNumber={item.FloorNumber}
                    area={item.Area}>
                    <View
                        style={{
                            paddingVertical: 18,
                            // alignItems: 'center',
                            // justifyContent: 'center'
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekanFaNum-Bold'
                                            : 'IRANYekanBold(FaNum)',
                                    fontSize: 18,
                                    alignSelf: 'flex-start',
                                    flex: 1,
                                }}>
                                {item.Name}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: textDisabled,
                                }}>
                                {item.RoleName}
                            </Text>
                        </View>
                        {item.UnitBalance != 0 ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 8,
                                    borderRadius: 10,
                                    backgroundColor: item.UnitBalance < 0 ? bgEmpty : bgSuccessLight,
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                <Text
                                    style={{
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekanFaNum-Bold'
                                                : 'IRANYekanBold(FaNum)',
                                        fontSize: 14,
                                        alignSelf: 'flex-start',
                                        color: item.UnitBalance < 0 ? textRed : success,
                                    }}>
                                    {accounting.formatMoney(item.UnitBalance.replace('-', ''), '', 0, ',')}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekanFaNum-Bold'
                                                : 'IRANYekanBold(FaNum)',
                                        fontSize: 10,
                                        color: item.UnitBalance < 0 ? textRedLight : successLight,
                                    }}>
                                    {' ' + userStore.CurrencyID}
                                </Text>
                            </View>
                        ) : (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    marginTop: 8,
                                    borderRadius: 10,
                                    backgroundColor: bgScreen,
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                }}>
                                <IconApp
                                    name={'apic_done_circle'}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: subTextItem,
                                        marginEnd: 8,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-Medium'
                                                : 'IRANYekanMedium',
                                        fontSize: 14,
                                        paddingTop:3,
                                        color: subTextItem,
                                    }}>
                                    پرداخت شده
                                </Text>
                            </View>
                        )}
                    </View>
                </CardUnitInfo>
            </IOSSwipeCard>
        );
    }
}

export default class PayAdmin extends PureComponent {
    constructor() {
        super();
        console.warn('^^^^^^^ PayAdmin constructor');
        this.users = [];

        this.state = {
            showOverlay: false,
            showEditPopUp: false,
            showAddSuggestionPopup: false,
            nominatedToDeleteItem: null,
            nominateToEditItem: null,

            permission: userStore.findPermission(permissionId.pay),
            type: true,
            loading: false,
            loadingMessage: '',
            users: [],
            user: null,

            sortIsAvailable: true,
            searchIsAvailable: true,
            sortDirectionDesc: true,
            searchTypeSelected: true,

            showSearchType: false,
            showSortType: false,
            sortItem: null,
            searchItem: searchItems[0],

            calListSelected: [],
            showCallList: false
        };
    }

    async componentDidMount() {

        waitForData(()=>{

            this.getUsers();
        });

    }

    async getUsers(mobile = null, name = null, unitNumber = null) {
        this.setState({loading: true, loadingMessage: 'در حال دریافت ...'});
        await searchUserQuery(mobile, name, unitNumber)
            .then(result => {
                console.log('this.users+++++',this.users);
                this.users = result;
                this.setState({users: result});
            })
            .catch(e => null)
            .finally(() => this.setState({loading: false}));
    }

    changeSearchType(item) {
        this.setState({searchItem: item},
            () => this.search(this.state.searchText));
    }

    search(text) {
        if (text) {
            text = mapNumbersToEnglish(text);
            this.setState({searchText: text});
            let key = this.state.searchItem ? this.state.searchItem.codeName : ''; //Object.keys(this.state.searchItem)[0];
            const searchedProcess = this.users.filter(item => {
                const itemData = `${item[key]}`;
                return (this.state.searchItem.Name === 'مالک' ? (item.RoleID == 2 || item.RoleName === 'مالک و ساکن') :
                        this.state.searchItem.Name === 'ساکن' ? item.RoleID == 3 : true
                ) && itemData.indexOf(text) > -1;
            });
            // //ToDo NewSearch
            /*const searchedProcess = this.users.filter(item => item[this.state.searchItem.codeName] === this.state.searchItem.codeName)
                        .filter(item => item[this.state.searchItem.codeName].indexOf(text) > -1);*/
            this.setState({users: searchedProcess});
        } else {
            this.setState({users: this.users, searchText: ''});
        }
    }

    changeSort(item) {
        this.setState({sortItem: item});
        this.sort(item);
    }

    sort(item) {
        let arraySortProcess = this.state.users;
        arraySortProcess.sort(compare2sort(item.codeName));
        if (item.isDescending) {
            arraySortProcess.reverse();
        }
        this.setState({users: arraySortProcess});
        this.forceUpdate();
    }

    render() {
        console.warn('^^^^^^^ PayAdmin render', this.users.length);
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'ساکنین',
            search: {
                onPressType: () => this.setState({showSearchType: true}),
                onTextChange: text => this.search(text),
                typeName: this.state.searchItem.Name,
            },
            sort: {
                onPress: () => this.setState({showSortType: true}),
            },
        };
        return (
            <MobileLayout style={{padding:0,}} title={`ساکنین`}
              header={<Toolbar ref='refToolbar' customStyle={toolbarStyle}/>}

            >
                <View style={{flex: 1, backgroundColor: bgScreen,marginTop:10,}}>
                    <AndroidBackButton
                        onPress={() => {
                            if (this.state.loading) {
                                return true;
                            } else if (this.state.showOverlay) {
                                this.setState({
                                    showOverlay: false,
                                    showEditPopUp: false,
                                    showAddSuggestionPopup: false,
                                    nominatedToDeleteItem: null,
                                    nominateToEditItem: null,
                                });
                            } else {
                                this.onBackPress();
                            }
                            return true;
                        }}
                    />

                    {/*<NavigationEvents onWillFocus={payload => {
                        if (payload.action.type === 'Navigation/BACK') {
                            this.getUsers()
                                .then(() => {
                                    if (this.refs.refToolbar.state.showSearch) {
                                        this.search(this.refs.refToolbar.state.searchText)
                                    } else if (this.refs.refToolbar.state.isSort) {
                                        this.sort(this.state.sortItem)

                                    }
                                });
                        }
                    }}
                    />*/}

                    <SnakePopup
                        visible={this.state.showSearchType}
                        toolbarTitle="جستجو بر اساس"
                        items={searchItems}
                        onItemSelected={item => {
                            this.changeSearchType(item);
                            this.setState({showSearchType: false});
                        }}
                        onClose={() => this.setState({showSearchType: false})}
                        fromTop={60}
                    />

                    <SnakePopup
                        visible={this.state.showSortType}
                        toolbarTitle="مرتب سازی بر اساس"
                        items={sortItems}
                        onItemSelected={item => {
                            this.changeSort(item);
                            this.setState({showSortType: false});
                        }}
                        onClose={() => this.setState({showSortType: false})}
                        fromTop={60}
                    />

                    <View style={{flex: 1, backgroundColor: '#f5f1f1', marginEnd: 16}}>
                        <FlatList
                            keyboardDismissMode={'on-drag'}
                            onScroll={() => Keyboard.dismiss()}
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.users}
                            extraData={this.state.users}
                            renderItem={({item, index}) => (
                                <UserCard
                                    index={index}
                                    style={{margin:10}}
                                    item={item}
                                    onPress={item => {
                                        navigation.navigate('/PayAnnounce', {
                                            adminForPayUser: item,

                                        });
                                     //   this.props.navigation.navigate('PayAnnounce', {adminForPayUser: item});
                                    }}
                                    onOpenSwipe={id => this.setState({idSwipeOpened: id})}
                                    idSwipeOpened={this.state.idSwipeOpened}
                                    onCallPressed={item => this.callHandler(item)}
                                />
                            )}
                        />
                    </View>

                    <SnakePopup
                        fromTop={60}
                        visible={this.state.showCallList}
                        toolbarTitle="شماره های تماس"
                        items={this.state.calListSelected}
                        onItemSelected={item => {
                            //Communications.phonecall(item.TelNo, true);
                            this.setState({showCallList: false});
                        }}
                        onClose={() => this.setState({showCallList: false})}
                        itemComponent={item => (
                            <View style={{flexDirection: 'row', marginHorizontal: 16, alignItems: 'center'}}>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{padding: 13}}>
                                    {item.TelNo}
                                </Text>
                                <IconApp
                                    name={item.TelNo.startsWith('09') ? 'apic_Phone' : 'apic_call'}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: subTextItem,
                                    }}
                                />
                            </View>
                        )}
                    />

                    <LoadingPopUp
                        visible={this.state.loading}
                        message={this.state.loadingMessage}
                    />
                </View>
            </MobileLayout>

        );
    }

    onBackPress() {
        Router.back();
    }

    callHandler(item) {
        const telData = item.TelData ? JSON.parse(item.TelData) : [];
        if (telData.length > 0) {
            telData.unshift({TelNo: item.Mobile});
            this.setState({showCallList: true, calListSelected: telData});
        } else {
           // Communications.phonecall(item.Mobile, true);
        }
    }
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    rowTitle: {
        color: primaryDark,
        fontSize: 17,
        flex: 1,
    },
});

const sortItems = [
    {Name: ' شماره واحد(کم به زیاد)', codeName: 'UnitNumber', isDescending: false},
    {Name: ' شماره واحد(زیاد به کم)', codeName: 'UnitNumber', isDescending: true},
    {Name: 'مساحت(کم به زیاد)', codeName: 'Area', isDescending: false},
    {Name: 'مساحت(زیاد به کم)', codeName: 'Area', isDescending: true},
    {Name: 'بدهکار', codeName: 'UnitBalance', isDescending: false},
];

const searchItems = [
    {Name: 'مالک', codeName: 'Name'},
    {Name: 'ساکن', codeName: 'Name'},
    {Name: 'شماره واحد', codeName: 'UnitNumber'},
    {Name: 'مساحت', codeName: 'Area'},
];
