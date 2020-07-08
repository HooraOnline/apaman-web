import React, {Component, PureComponent} from 'react';
import MainContent from "./home/MainContent";
import {userStore, persistStore, globalState} from "../src/stores";
import {permissionId} from '../src/constants/values';
import Router from "next/router";
import MobileLayout from "../src/components/layouts/MobileLayout";
import {DropDownList,Toolbar,CardUnitInfo,PopupBase,ImageSelector} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {deviceWide, doDelay, getTabWidth, logger} from "../src/utils";
import images from "../public/static/assets/images";
import PopupState, {bindTrigger, bindPopover} from 'material-ui-popup-state';
import {getUserBalance} from "../src/network/Queries";
import {
    bgItemRed,
    bgScreen,
    bgWhite,
    textItemRed,
    borderSeparate,
    border,
    primary,
    primaryDark, bgEmpty,

} from "../src/constants/colors";
import accounting from "accounting";
import {View, TouchableOpacity, Text, FlatList, Image, Platform,} from "../src/react-native";
import NavigationBottomMain from "../src/components/NavigationBottomMain";

import {observer} from "mobx-react";
import {fa} from "../src/language/fa";

import Notifications from "./Notifications";

const HOME_TYPE = 1;//'HOME';
const PHONE_BOOK_TYPE = 'PHONE_BOOK';
const NOTIFICATION_TYPE = 2;//'NOTIFICATION_TYPE';
const NearMe_TYPE = 0;//'NearMe_TYPE';
let deepLink = null;



@observer
class Nearme extends PureComponent {
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


@observer
export default class Main extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {
            selected: HOME_TYPE,
            showAccountSelect: false,
            loadingBalance: false,
            showPasswordChangePopUp: false,
            anchorEl: null,
            isWide:false,
            forms:[]
        };
    }


    checkUserNotRefreshPage = () => {
       /* if (!userStore.RoleID) {
            Router.push('/Main');
        }*/
    }

    manageMenuVisible=()=>{
        let isWide=deviceWide();
        globalState.showMenu=globalState.showMenu==false?false:isWide;
        this.setState({isWide:isWide,showMenu:isWide?globalState.showMenu:false});
     }


    hasChangedPassword(accounts) {
        accounts.forEach((account) => {
            if (account.hasChangedPassword) {
                return true;
            }
        });
        return false;
    }

    hidePasswordChangePopUp() {
        this.setState({
            showPasswordChangePopUp: false,
        }, () => {
            if (accountsStore.accounts.length && persistStore.selected === 0) {
                this.selecetRole(true);
            }
        });
    }

    selecetRole(status) {
        this.setState({showAccountSelect: status}, () => {
            if (status) {
                this.getBalance();
            }
        });

    }

    async getBalance() {
        this.setState({loadingBalance: true});
        getUserBalance()
            .then(result => {
                logger('********* getUserBalance success result:', result);
                this.updateBalance(result);
            })
            .catch(e => {
                logger('********* getUserBalance catch e:', e);
                this.setState({loadingBalance: false});
                // Toast.show(e.errMessage, Toast.LONG);
            });
    }

    updateBalance(newBalance) {
        accountsStore.accounts = accountsStore.accounts.map(function (item) {
            if (item.UnitID) {
                const target = newBalance.find(obj => obj.UnitID === item.UnitID);
                item.UnitBalance = target.UnitBalance;
                return item;
            } else {
                return item;
            }
        });
        this.setState({loadingBalance: false});
    }

    onRoleSelected(item) {
        persistStore.selected = item.ID;
        userStore.setUser(item);
        userStore.setUnitBalance(item.UnitBalance);
        this.costPermission = userStore.findPermission(permissionId.costCalculation);
        this.payAnnouncePermissioin = userStore.findPermission(userStore.RoleID === 1 ? permissionId.manualPay : permissionId.pay);
        console.info('%%%%%%%%%%% onRoleSelected item selected: ', item);
        this.setState({showAccountSelect:false});
        this.initDrawer && this.initDrawer();
        this.loadForms()
    }

    async getAllNotifications() {
        // this.showLoading();
        globalState.showBgLoading();
        getAllNotification()
            .then(result => this.setState({notifications: result}))
            .catch(e => globalState.showToastCard())
            .finally(() => globalState.hideBgLoading());
    }

    onPressMenu() {

        //this.props.navigation.openDrawer();
        globalState.showMenu=!globalState.showMenu;
       /* if(this.state.isWide){
            globalState.showMenu=!globalState.showMenu;
            this.setState({showMenu:globalState.showMenu});
        }else{
            this.setState({showMenu:!this.state.showMenu});
        }*/
    }

    async onPressAccount() {
        this.selecetRole(!this.state.showAccountSelect);
        // this.setState({showAccountSelect: true});
        this.setState({showMenu:false});
    }

    onTouchMove= touchStartEvent =>{
        console.log(touchStartEvent);
        if(touchStartEvent.targetTouches[0] ){
            if(this.difWidth && this.difHeight){
                let difX=this.difWidth-touchStartEvent.targetTouches[0].clientX;
                let difY=this.difHeight-touchStartEvent.targetTouches[0].clientY;
                if(difX<-20) globalState.showMenu=false;
                if(difX>20) globalState.showMenu=true;
                this.difWidth=null;
            }else{
                this.difWidth=touchStartEvent.targetTouches[0].clientX;
                this.difHeight=touchStartEvent.targetTouches[0].clientY;
            }
        }
    }

    componentDidMount() {
        this.checkUserNotRefreshPage();
        setTimeout(() => this.setState({roleId: userStore.RoleID}), 100);
        this.manageMenuVisible();
        this.loadForms();
    }

    loadForms(){
        doDelay(20)
            .then(()=>{

                this.userHomePagesForms=userStore.Form.filter(item=>item.showOnHomePage==1);
                const form1= this.userHomePagesForms.find(f=>f.homePageSortNumber==1);
                const form2= this.userHomePagesForms.find(f=>f.homePageSortNumber==2);
                const form3= this.userHomePagesForms.find(f=>f.homePageSortNumber==3);
                const form4= this.userHomePagesForms.find(f=>f.homePageSortNumber==4);
                this.state.forms=[];
                if(form1){
                    this.state.forms.push({formId:form1.formID,persianName:form1.persianName,formName:form1.formName,destination:form1.destination});
                }
                if(form2){
                    this.state.forms.push({formId:form2.formID,persianName:form2.persianName,formName:form2.formName,destination:form2.destination});
                }
                if(form3){
                    this.state.forms.push({formId:form3.formID,persianName:form3.persianName,formName:form3.formName,destination:form3.destination});
                }
                if(form4){
                    this.state.forms.push({formId:form4.formID,persianName:form4.persianName,formName:form4.formName,destination:form4.destination});
                }6

                this.setState({forms:this.state.forms})
                console.log('all==============', this.userHomePagesForms);
            })
    }
    render() {
        //const { height, width } = useWindowDimensions();
        const toolbarStyle = {
            start: {
                onPress: () => this.onPressMenu(),
                content: globalState.showMenu?images.ic_home :images.ic_menu,
            },
            main: {
                onPress:
                    accountsStore.accounts.length > 1
                        ? this.onPressAccount.bind(this)
                        : null,
                title: userStore.RoleName,
                subTitle: userStore.BuildingName + userStore.UnitNumber,
            },
        };

        const open = Boolean(this.state.anchorEl);
        const PopperId = open ? 'simple-popper' : undefined;
        const {children}=this.props;


        return (
            <MobileLayout title={`صفحه اصلی`}  onRef={(initDrawer)=>this.initDrawer=initDrawer}  style={{margin:0}}
             header={<Toolbar
                 customStyle={toolbarStyle}
                 isExpand={this.state.showAccountSelect }
             />}
            footer={
                <View
                    style={{
                        height: 85,
                        // width: width,
                        padding: 16,
                        backgroundColor:bgScreen
                    }}
                >
                    <NavigationBottomMain
                        activeIndex={this.state.selected}
                        onActivate={val => {
                            /*  if (val === NOTIFICATION_TYPE) {
                                  setTimeout(() => this.getAllNotifications(), 100)
                              }*/
                            this.setState({selected: val, imageReceipt: null});

                            // this.checkValidation();
                        }}
                        data={[
                            {title: 'نزدیک من', icon: images.ic_alldone},
                            {title: 'صفحه اصلی', icon: images.ic_home},
                            {title: 'رخدادها', icon: images.ic_broadcast},
                        ]}
                        backgroundActive={primaryDark}
                        backgroundInactive={'#fff'}
                        itemWidth={getTabWidth(global.width, 3, 18)}
                        activeTextStyle={{}}
                        inactiveTextStyle={{}}
                    />
                </View>
            }
            >
                <View
                    onTouchMove={this.onTouchMove}
                    style={{flex: 1,paddingVertical:2,}}>
                    {this.state.selected === HOME_TYPE ? (
                        <MainContent forms={this.state.forms} isAdmin={userStore.RoleID == 1}/>

                    ) : this.state.selected === NearMe_TYPE ? (
                        <Nearme/>

                    ) : (
                        <Notifications
                            items={this.state.notifications}
                            refreshNotif={newNotif => this.setState({notifications: newNotif})}
                        />

                    )}
                </View>
                <PopupBase
                    opener={this.item}
                   /* top={0}*/
                    visible={this.state.showAccountSelect}
                    onClose={()=>this.setState({showAccountSelect:false})}
                    style={{marginTop:65,height:'93%',opacity:1}}
                    contentStyle={{opacity:1, width:global.width,backgroundColor:bgWhite,paddingBottom:5, borderBottomRightRadius: 16,borderBottomLeftRadius:16,borderColor:bgWhite}}>
                    {accountsStore.accounts.map((item,index) => {
                            return (
                                <div onClick={() => this.onRoleSelected(item)} style={{cursor: "pointer", paddingRight:0,paddingLeft:0,justifyContent:'center' }} >
                                    <div id={'seperator'} style={{
                                        height: index?1:0,
                                        backgroundColor: borderSeparate,
                                        marginHorizontal: 0,
                                        width:'100%',


                                    }}/>
                                    <CardUnitInfo
                                        isMain={false}
                                        unitNumber={item.UnitNumber}
                                        floorNumber={item.FloorNumber}
                                        area={item.Area}
                                    >
                                        <View style={{
                                            paddingVertical:8,
                                            justifyContent:'center',
                                        }}>
                                            <View style={{
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                margin: 0,
                                                justifyContent:'center',

                                            }}>
                                                <span style={{fontSize: 14,fontWeight:800}} >{item.RoleName}</span>
                                                <span style={{
                                                    color: '#8a7e7e',
                                                    fontSize: 12,
                                                    textAlign: 'left',
                                                    flex: 1,
                                                }}

                                                >{item.BuildingName}</span>
                                            </View>
                                            {this.state.loadingBalance && (
                                                <span style={{
                                                    color: '#8a7e7e',
                                                    fontSize: 10,
                                                    textAlign: 'left',
                                                    flex: 1,
                                                }}>بارگذاری ...</span>
                                            )}
                                            {item.UnitBalance && item.UnitBalance != 0 && (
                                                <div
                                                    style={{
                                                        flexDirection: 'row',
                                                        backgroundColor: bgItemRed,
                                                        padding: 8,
                                                        borderRadius: 5,
                                                        height: 35,
                                                    }}>
                                                                    <span
                                                                        style={{
                                                                            color: item.UnitBalance < 0 ? textItemRed : 'black',
                                                                            fontSize: 12,
                                                                            writingDirection: 'ltr',
                                                                        }}>
                                                                        {accounting.formatMoney(item.UnitBalance.replace('-', ''), '', 0, ',')}
                                                                    </span>
                                                    <span
                                                        style={{
                                                            color:
                                                                item.UnitBalance < 0 ? textItemRed : 'black',
                                                            fontSize: 12,
                                                        }}>
                                                                        {' '}
                                                        {item.CurrencyID}{' '}
                                                                     </span>
                                                </div>
                                            )}
                                        </View>
                                    </CardUnitInfo>
                                </div>
                            )
                        }
                    )}
                </PopupBase>

            </MobileLayout>


        )
    }

}


