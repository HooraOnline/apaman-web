import React, {PureComponent, createRef } from 'react';
import {
    Alert,
    Animated,
    Image,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAwareScrollView, IconApp, ScrollView,
} from '../src/react-native';
import {observer} from 'mobx-react';
import {
    AlertMessage,
    AndroidBackButton,
    CardUnitInfo, ImageSelector,
    ListDialogPopUp,
    LoadingPopUp,
    Overlay,
    PersianCalendarPickerPopup,
    SelectTypePhoto,
    SwitchTextMulti,
    Toolbar,

} from '../src/components';
import images from "public/static/assets/images";
import {
    bgScreen,
    border, borderLight,
    borderSeparate,
    drawerItem,
    fab,
    lightRed,
    placeholderTextColor,
    primaryDark,
    subTextItem,
    textDisabled,
    textItem,
    textItemBlack, textRed,

} from '../src/constants/colors';

import {globalState, persistStore, userStore} from '../src/stores';
import {
    getBankListQuery,
    getBuildingAccountQuery,
    getPaymentType,
    setPaymentManuallyQuery,
    updatePaymentManuallyQuery,
} from '../src/network/Queries';

import {
    cardFormat,
    getFileDownloadURL,
    getTabWidth,
    inputNumberValidation,
    mapNumbersToEnglish,
    uploadFile,
    navigation, waitForData, showMassage, showWarning, formatMoney,
} from '../src/utils';

import accounting from 'accounting';
import FloatingLabelTextInput from '../src/components/FloatingLabelTextInput';
//import ImagePicker from 'react-native-image-crop-picker';
//import Permissions from 'react-native-permissions';
//import {PanGestureHandler} from 'react-native-gesture-handler';
import MobileLayout from "../src/components/layouts/MobileLayout";
import Router from "next/router";

const jMoment = require('moment-jalaali');


const CARD_TYPE = 0;
const CASH_TYPE = 1;
const CHECK_TYPE = 2;

@observer
export default class ManualPay extends PureComponent {

    constructor(props) {
        super(props);

        this.localImage = true;
        this.myRef = React.createRef();
        this.state = {
            animatedSwipeClose: new Animated.Value(0),
            swipeClosePositionY: 0,

            type: CARD_TYPE,
            facilityList: [],
            payType: [],
            cardNumber: null,
            bankRef: null,

            cardNumberValidation: true,
            bankRefValidation: true,
            payTypeSelectedValidation: true,
            accListSelectedValidation: true,

            currentPriceValidation: true,

            imageReceipt: null,
            showTypePhoto: false,

            bankList: [],

            checkDate: null,
            checkDateValidation: true,

            checkName: null,
            checkNameValidation: true,

            checkNo: null,
            checkNoValidation: true,

            checkImageValidation: true,
        };

    }

    componentDidMount() {
        this.payInfo =navigation.getParam('payInfo', null);
        this.item = this.payInfo.Transaction;

        console.warn('%%%%%%%%%%%%%%%%%%%% ManualPay user:', this.payInfo);
        if (this.item) {
            this.localImage = false;
            this.state.currentPrice= this.payInfo.Mandeh;
            this.state.type = this.item.PaymentTypeID === '2' ? CARD_TYPE : this.item.PaymentTypeID === '3' ? CASH_TYPE : CHECK_TYPE;
            this.state.description = this.item.Description;
            this.state.cardNumber = this.item.CardNo;
            this.state.accListSelected = this.state.facilityList.filter(facility => facility.ID !== item.Area);
            this.state.bankRef = this.item.Numbers;
            this.state.imageReceipt = this.item.Image;
            this.state.imageName = this.item.Image;
            if (this.state.type == CHECK_TYPE) {
                this.state.checkName = this.item.ChequeName;
                this.state.checkDate = this.item.ChequeDate;
                this.state.checkNo = this.item.Numbers;
            }
            this.state.ChequeBankID = this.item.ChequeBankID;
        }
        this.setState({currentPrice:this.state.currentPrice});
        waitForData(()=>this.getAdminPayQueryNeed()); //waitForData has used for handling page refresh errors
    }

    render() {
        if(!this.payInfo){
            return <Text> loading ...</Text>;
        }
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_close,
            },
            title: this.payInfo.Title,
            subTitle: jMoment(this.payInfo.LastPayDate ? this.payInfo.LastPayDate : new Date()).format('jYYYY/jM/jD'),
        };

        return (
            <MobileLayout style={{padding:0}} title={this.payInfo.Title}
                  header={<Toolbar customStyle={toolbarStyle}/>}
                  footer={
                      <TouchableOpacity
                          onPress={() => this.adminPayment()}
                          style={{
                              position: 'absolute',
                              bottom:0,
                              left:0,
                              right:0,
                              padding:4,
                              backgroundColor: primaryDark,
                          }}
                      >
                          <Text style={{
                              fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                              fontSize: 16,
                              color:  'white',
                              paddingVertical: 10,
                              textAlign: 'center',
                          }}>ذخیره</Text>
                      </TouchableOpacity>
                  }
            >

                <View style={{flex: 1, backgroundColor: bgScreen,paddingBottom:40}}>

                   {/* <AndroidBackButton
                        onPress={() => {
                            if (this.state.showFullImage) {
                                this.setState({showFullImage: false});
                                return true;
                            }
                            this.onBackPress();
                            return true;
                        }}
                    />*/}

                    <View style={{flex: 1,position:'relative',}}>
                        <ScrollView>
                            <CardUnitInfo   style={{borderWidth:1,borderColor: borderLight,marginTop: 24,marginHorizontal: 8,}} bgColor={bgScreen} unitNumber={this.payInfo.user.UnitNumber} floorNumber={this.payInfo.user.FloorNumber} area={this.payInfo.user.Area}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{justifyContent: 'center'}}>
                                        <Text style={{
                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                            fontSize: 18,
                                            alignSelf: 'flex-start',
                                        }}>{this.payInfo.user.Name}</Text>
                                        <Text style={{
                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                            fontSize: 12,
                                            color: border,
                                        }}>{this.payInfo.user.RoleName}
                                        </Text>
                                    </View>
                                </View>
                            </CardUnitInfo>


                            <View
                                style={{
                                    marginStart: 4,
                                    marginEnd: 24,
                                    paddingBottom: 24,
                                }}
                            >
                                <View
                                    style={{
                                        marginVertical: 24,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginStart: 20,
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text style={{fontSize: 12, color: drawerItem}}>مبلغ</Text>
                                    <View style={{flex:1, flexDirection: 'row', marginStart: 48, marginEnd: 24}}>
                                        {this.item?(
                                            <Text>{formatMoney(this.state.currentPrice, '', 0, ',')}</Text>
                                        ):(
                                           /* <FloatingLabelTextInput
                                                placeholder="0"
                                                onChangeText={text => {
                                                    this.setState({
                                                        currentPrice2: text,

                                                    });
                                                }}
                                                maxLength={3}
                                                value={this.state.currentPrice2}
                                            />*/
                                            <FloatingLabelTextInput
                                                placeholder="0"
                                                onChangeText={text => {
                                                    this.setState({
                                                        currentPrice: inputNumberValidation(text, this.state.currentPrice),
                                                        currentPriceValidation: true,
                                                    });
                                                }}
                                                numberOfLines={1}
                                                tintColor={
                                                    this.state.currentPriceValidation ? placeholderTextColor : lightRed
                                                }
                                                textInputStyle={{
                                                    fontWeight: 'normal',
                                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                                    fontSize: 19,
                                                    color: textItem,
                                                    paddingStart: 4,
                                                    paddingTop: 1,
                                                    paddingBottom: 3,
                                                    textAlign: 'left',
                                                }}
                                                underlineSize={1}
                                                style={{flex: 1,}}
                                                multiline={false}
                                                maxLength={17}
                                                keyboardType="number-pad"
                                                returnKeyType="done"
                                                unit={userStore.CurrencyID}
                                                value={formatMoney(this.state.currentPrice)}
                                            />
                                        )

                                        }

                                      {/*  <Text
                                            style={{
                                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                                fontSize: 12,
                                                color: border,
                                                marginStart: 4,
                                                alignSelf: 'center',
                                            }}>
                                            {userStore.CurrencyID}
                                        </Text>*/}
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        marginStart: 20,
                                    }}
                                >
                                    <SwitchTextMulti
                                        activeIndex={this.state.type}
                                        onActivate={val => {
                                            this.setState({type: val, imageReceipt: null});
                                            //this.isValid();
                                        }}
                                        data={['کارت', 'نقد', 'چک']}
                                        backgroundActive={primaryDark}
                                        backgroundInactive={'#fff'}
                                        itemWidth={getTabWidth(global.width || 700, 3)}
                                        activeTextStyle={{
                                            paddingVertical: 6,
                                        }}
                                        inactiveTextStyle={{
                                            paddingVertical: 6,
                                        }}
                                    />
                                </View>

                                {this.state.type === CARD_TYPE && (
                                    <View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginStart: 20,
                                                marginTop: 24,
                                            }}
                                        >
                                            <Text style={{flex: .4, fontSize: 12, color: drawerItem}}>از کارت</Text>
                                            {/*<IconApp
                                                source={'apic_dropdown'}
                                                style={{
                                                    marginHorizontal: 8,
                                                    height: 21,
                                                    width: 21,
                                                    tintColor: fab
                                                }}
                                            />*/}
                                            <FloatingLabelTextInput
                                                ref={(input) => {
                                                    this.StaticMKTextFieldInput = input;
                                                }}
                                                editable={true}

                                                multiline={false}
                                                maxLength={19}
                                                keyboardType='number-pad'
                                                returnKeyType='done'
                                                numberOfLines={1}
                                                tintColor={this.state.cardNumberValidation ? placeholderTextColor : lightRed}
                                                textInputStyle={{
                                                    fontWeight: 'normal',
                                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                                    color: textItem,
                                                    fontSize: 12,
                                                    paddingStart: 4,
                                                    paddingTop: 1,
                                                    paddingBottom: 3,
                                                    textAlign: 'right',
                                                }}
                                                underlineSize={1}
                                                placeholder={'شماره کارت'}
                                                style={{flex: 1}}
                                                onChangeText={text =>
                                                    this.setState({
                                                        cardNumber: cardFormat(inputNumberValidation(text, this.state.cardNumber, /[\d-]+$/)),
                                                        cardNumberValidation: true,
                                                    })
                                                }
                                                highlightColor={primaryDark}
                                                value={this.state.cardNumber}
                                            />
                                            {/*<View style={{
                                                position: 'absolute',
                                                end: 0,
                                                bottom: 7,
                                            }}>
                                                <IconApp
                                                    source={'apic_edit'}
                                                    style={{
                                                        height: 24,
                                                        width: 24,
                                                        tintColor: subTextItem,
                                                    }}
                                                />
                                            </View>*/}
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 24,
                                            }}
                                        >
                                            <Image
                                                source={images.ic_important}
                                                style={{marginEnd: 4, height: 16, width: 16}}
                                            />
                                            <Text style={{flex: .4, fontSize: 12, color: drawerItem}}>به</Text>
                                            <ListDialogPopUp
                                                title='انتخاب حساب'
                                                snake
                                                items={this.state.facilityList}
                                                validation={this.state.accListSelectedValidation}
                                                selectedItem={this.state.accListSelected}
                                                onValueChange={item => this.setState({
                                                    accListSelected: item,
                                                    accListSelectedValidation: true,
                                                })}
                                                hasBorderBottom={false}
                                                selectedItemCustom={
                                                    this.state.accListSelected ? (
                                                        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between',padding:10}}>

                                                            <View style={{flex:1}} >
                                                                <Text style={{
                                                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                                                    color: textItemBlack,
                                                                    marginBottom: 4,
                                                                }}>
                                                                    {this.state.accListSelected.AccountName}
                                                                </Text>
                                                                {!!this.state.accListSelected.CardNo ? (
                                                                    <Text style={{
                                                                        fontFamily: Platform.OS === 'ios' ? 'OCR-A BT' : 'OCR-a',
                                                                        fontSize: 12,
                                                                    }}>
                                                                        {this.state.accListSelected.CardNo}
                                                                    </Text>
                                                                ) : !!this.state.accListSelected.AccountNo ? (
                                                                    <Text style={{fontSize: 12}}>
                                                                        {this.state.accListSelected.AccountNo}
                                                                    </Text>
                                                                ) : !!this.state.accListSelected.ShebaNo ? (
                                                                    <Text style={{fontSize: 12}}>
                                                                        {this.state.accListSelected.ShebaNo}
                                                                    </Text>
                                                                ) : (<View/>)}
                                                            </View>
                                                            <IconApp
                                                                source={'appic_dropdown'}

                                                                style={{
                                                                    marginHorizontal: 8,
                                                                    marginVertical: 19,
                                                                    height: 24,
                                                                    width: 24,
                                                                    tintColor: fab,
                                                                }}
                                                            />
                                                        </View>

                                                    ) : (
                                                        <View style={{flex:1,flexDirection:'row',justifyContent: 'center',paddingVertical: 8,paddingStart:8,paddingTop:13}} >
                                                            <Text style={{
                                                                flex:1,
                                                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                                                color: subTextItem,
                                                                fontSize: 14,
                                                            }}>
                                                                حساب خود را انتخاب نمایید
                                                            </Text>
                                                           {/* <IconApp
                                                                source={'apic_dropdown'}
                                                                style={{
                                                                    flex:0,
                                                                    height: 24,
                                                                    width: 24,
                                                                    tintColor: fab,
                                                                }}
                                                            />*/}
                                                        </View>

                                                    )

                                                }
                                                itemComponent={item => (

                                                    <View
                                                        style={{
                                                            marginTop: 16,
                                                            padding: 16,
                                                            backgroundColor: bgScreen,
                                                            borderRadius: 10,
                                                            borderWidth: 1,
                                                            borderColor: borderSeparate,
                                                        }}>

                                                        <View style={{flexDirection: 'row'}}>
                                                            <Image
                                                                source={images[item.Icon]}
                                                                style={{
                                                                    marginEnd: 4,
                                                                    height: 32,
                                                                    width: 32,
                                                                }}
                                                            />
                                                            <Text style={{
                                                                flex: 1,
                                                                fontFamily: Platform.OS === 'ios' ? 'IRANYekan-Black' : 'IRANYekanBlack',
                                                            }}>
                                                                {item.BankName}
                                                            </Text>
                                                            <View>
                                                                <Text style={{
                                                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                                                    color: textItemBlack,
                                                                }}>
                                                                    {item.AccountName}
                                                                </Text>
                                                                {item.IsGateway && (
                                                                    <Text style={{
                                                                        fontFamily: Platform.OS === 'ios' ? 'IRANYekan-Medium' : 'IRANYekanMedium',
                                                                    }}>درگاه</Text>
                                                                )}
                                                            </View>
                                                        </View>

                                                        {!!item.CardNo && (
                                                            <Text style={{
                                                                fontFamily: Platform.OS === 'ios' ? 'OCR-A BT' : 'OCR-a',
                                                                color: textItemBlack,
                                                                fontSize: 20,
                                                                marginTop: 16,
                                                                textAlign: 'center',
                                                                letterSpacing: 2,
                                                            }}>
                                                                {item.CardNo}
                                                            </Text>
                                                        )}

                                                        {!!item.AccountNo && (
                                                            <Text style={{
                                                                color: textItemBlack,
                                                                marginTop: 4,
                                                                textAlign: 'center',
                                                                letterSpacing: 2,
                                                            }}>
                                                                {item.AccountNo}
                                                            </Text>
                                                        )}


                                                        {!!item.ShebaNo && (
                                                            <Text style={{
                                                                color: textItemBlack,
                                                                marginTop: 4,
                                                                textAlign: 'center',
                                                                letterSpacing: 2,
                                                            }}>
                                                                {item.ShebaNo}
                                                            </Text>
                                                        )}

                                                    </View>
                                                )}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 24,
                                            }}
                                        >
                                            <Image
                                                source={images.ic_important}
                                                style={{marginEnd: 4, height: 16, width: 16}}
                                            />
                                            <Text style={{flex: .4, fontSize: 12, color: drawerItem}}>شناسه پرداخت</Text>
                                            <FloatingLabelTextInput
                                                ref={(input) => {
                                                    this.StaticMKTextFieldInput = input;
                                                }}
                                                editable={true}
                                                multiline={false}
                                                maxLength={19}
                                                keyboardType='number-pad'
                                                returnKeyType='done'
                                                numberOfLines={1}
                                                tintColor={this.state.bankRefValidation ? placeholderTextColor : lightRed}
                                                textInputStyle={{
                                                    fontWeight: 'normal',
                                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                                    color: textItem,
                                                    fontSize: 14,
                                                    paddingStart: 4,
                                                    paddingTop: 1,
                                                    paddingBottom: 3,
                                                    textAlign: 'right',
                                                }}
                                                underlineSize={1}
                                                placeholder='شناسه پرداخت را وارد نمایید'
                                                style={{flex: 1}}
                                                onChangeText={text => this.setState({bankRef: inputNumberValidation(text, this.state.bankRef)})}
                                                highlightColor={primaryDark}
                                                value={this.state.bankRef}
                                            />
                                        </View>
                                    </View>
                                )}

                                {this.state.type === CHECK_TYPE && (
                                    <View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 24,
                                            }}
                                        >
                                            <Image
                                                source={images.ic_important}
                                                style={{marginEnd: 4, height: 16, width: 16}}
                                            />
                                            <Text style={{flex: .4, fontSize: 12, color: drawerItem}}>تاریخ چک</Text>
                                            <View style={{flex: 1}}>
                                                <PersianCalendarPickerPopup
                                                    showToday
                                                    validation={this.state.checkDateValidation}
                                                    selectedDate={this.state.checkDate}
                                                    onValueChange={date =>
                                                        this.setState({
                                                            checkDate: date,
                                                            checkDateValidation: true,
                                                        })
                                                    }
                                                    defaultTitle='تاریخ چک'
                                                />
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 24,
                                            }}
                                        >
                                            <Image
                                                source={images.ic_important}
                                                style={{marginEnd: 4, height: 16, width: 16}}
                                            />
                                            <Text style={{flex: .4, fontSize: 12, color: drawerItem}}>شماره چک</Text>

                                            <FloatingLabelTextInput
                                                editable={true}
                                                multiline={false}
                                                maxLength={19}
                                                keyboardType='numeric'
                                                returnKeyType='done'
                                                numberOfLines={1}
                                                tintColor={this.state.checkNoValidation ? placeholderTextColor : lightRed}
                                                textInputStyle={{
                                                    fontWeight: 'normal',
                                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                                    color: textItem,
                                                    fontSize: 12,
                                                    paddingStart: 4,
                                                    paddingTop: 1,
                                                    paddingBottom: 3,
                                                    textAlign: 'right',
                                                }}
                                                underlineSize={1}
                                                placeholder={'شماره چک را بنویسید'}
                                                style={{flex: 1}}
                                                onChangeText={text =>{
                                                    this.setState({
                                                        checkNo: text,
                                                        checkNoValidation: true,
                                                    })
                                                }}
                                                highlightColor={primaryDark}
                                                value={this.state.checkNo}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 24,
                                            }}
                                        >
                                            <Image
                                                source={images.ic_important}
                                                style={{marginEnd: 4, height: 16, width: 16}}
                                            />
                                            <Text style={{flex: .4, fontSize: 12, color: drawerItem}}>صاحب حساب</Text>

                                            <FloatingLabelTextInput
                                                editable={true}
                                                multiline={false}
                                                maxLength={19}
                                                keyboardType='default'
                                                returnKeyType='done'
                                                numberOfLines={1}
                                                tintColor={this.state.checkNameValidation ? placeholderTextColor : lightRed}
                                                textInputStyle={{
                                                    fontWeight: 'normal',
                                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                                    color: textItem,
                                                    fontSize: 12,
                                                    paddingStart: 4,
                                                    paddingTop: 1,
                                                    paddingBottom: 3,
                                                    textAlign: 'right',
                                                }}
                                                underlineSize={1}
                                                placeholder={'نام صاحب حساب چک را بنویسید'}
                                                style={{flex: 1}}
                                                onChangeText={text =>
                                                    this.setState({
                                                        checkName: text,
                                                        checkNameValidation: true,
                                                    })
                                                }
                                                highlightColor={primaryDark}
                                                value={this.state.checkName}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 24,
                                            }}
                                        >
                                            <Image
                                                source={images.ic_important}
                                                style={{marginEnd: 4, height: 16, width: 16}}
                                            />
                                            <Text style={{flex: .4, fontSize: 12, color: drawerItem}}>بانک</Text>

                                            <ListDialogPopUp
                                                title='انتخاب بانک'
                                                selectedItemCustom={
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            marginHorizontal: 8,
                                                            marginVertical: 8,
                                                        }}>
                                                        {this.state.bankSelected && (
                                                            <Image
                                                                source={images[this.state.bankSelected.Icon]}
                                                                style={{height: 24, width: 24, marginEnd: 8}}
                                                            />
                                                        )}

                                                        <Text
                                                            style={{
                                                                fontFamily:
                                                                    Platform.OS === 'ios'
                                                                        ? 'IRANYekanFaNum-Bold'
                                                                        : 'IRANYekanBold(FaNum)',
                                                            }}>
                                                            {this.state.bankSelected
                                                                ? this.state.bankSelected.Name
                                                                : 'انتخاب بانک'}
                                                        </Text>
                                                    </View>
                                                }
                                                itemComponent={item => (
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            paddingHorizontal: 8,
                                                            alignItems: 'center',
                                                            borderBottomWidth: 0.5,
                                                            borderColor: borderSeparate,
                                                        }}>
                                                        <Image
                                                            source={images[item.Icon]}
                                                            style={{
                                                                marginHorizontal: 8,
                                                                marginVertical: 8,
                                                                height: 24,
                                                                width: 24,
                                                            }}
                                                        />
                                                        <Text style={{paddingVertical: 16}}>
                                                            {item.Name}
                                                        </Text>

                                                    </View>
                                                )}
                                                snake
                                                validation={this.state.bankSelectedValidation}
                                                items={this.state.bankList}
                                                selectedItem={this.state.bankSelected}
                                                onValueChange={item => this.setState({
                                                    bankSelected: item,
                                                    bankSelectedValidation: true,
                                                })}
                                            />
                                        </View>
                                    </View>
                                )}

                                {(this.state.type === CARD_TYPE || this.state.type === CHECK_TYPE) && (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            // alignItems: 'center',
                                            marginStart: this.state.type === CHECK_TYPE ? 0 : 20,
                                            marginTop: 24,
                                        }}
                                    >
                                        {this.state.type === CHECK_TYPE && (
                                            <Image
                                                source={images.ic_important}
                                                style={{marginEnd: 4, height: 16, width: 16, marginTop: 4}}
                                            />
                                        )}
                                        <Text style={{
                                            flex: .4,
                                            fontSize: 12,
                                            color: drawerItem,
                                        }}> تصویر {this.state.type === CHECK_TYPE ? 'چک' : 'رسید'}</Text>


                                        <View

                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                //alignItems: 'center',

                                            }}
                                        >
                                        <div ref={this.myRef} >
                                            <ImageSelector
                                                style={{
                                                    //flex: 1,
                                                    justifyContent: 'center',
                                                    //alignItems: 'center',
                                                    borderColor: this.state.checkImageValidation ? subTextItem : lightRed,
                                                    borderWidth: 1,
                                                    borderStyle: this.state.imageReceipt ? 'solid' : 'dashed',
                                                    borderRadius: 10,
                                                    height:this.state.imageReceipt? global.width/2:100, }}
                                                canUpload={true}
                                                imageStyle={{borderRadius:this.bRedius}}
                                                image= {this.state.imageReceipt} //{'1587814870896.jpg'}
                                                //noImage={images.bg_addphoto}
                                                hideDeleteBtn={false}
                                                onUplodedFile={(fileName)=>{
                                                    this.setState({imageReceipt: fileName});
                                                }}
                                                onRemoveImage={(fileName)=>{
                                                    this.setState({imageReceipt: null});
                                                }}
                                                onSelectFile={(formData,file0,url,filebase64)=>{
                                                    this.setState({imageReceipt: url});
                                                }}
                                                SelectBtn={
                                                    <View style={{ flexDirection: 'row',  padding: 7, alignItems: 'center', borderWidth: 1, borderRadius: 40, borderColor: borderLight }}>
                                                        <IconApp
                                                            source={'apic_AddPhoto'}
                                                            style={{
                                                                tintColor: textItem,
                                                                height: 24, width: 24 }}
                                                        />
                                                        <Text style={{
                                                            color: border,
                                                            fontSize: 14,
                                                            paddingHorizontal: 5,
                                                            fontFamily: Platform.OS === 'ios'
                                                                ? 'IRANYekanFaNum-Bold'
                                                                : 'IRANYekanBold(FaNum)',
                                                        }}>افزودن تصویر </Text>
                                                    </View>
                                                }

                                                selectBtnStyle={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 150,
                                                    height: 40,
                                                    position: 'absolute',
                                                    top:this.state.imageSelectorBtnTop,
                                                    left:this.state.imageSelectorBtnLeft
                                                }}
                                                renderContent={(image, progress) => {
                                                   setTimeout(()=> this.setState({
                                                       imageSelectorBtnLeft:this.myRef.current?(this.myRef.current.offsetWidth/2)-75:120,
                                                       imageSelectorBtnTop:this.myRef.current?(this.myRef.current.offsetHeight/2)-20:60,
                                                   }),0)

                                                    return (
                                                        <TouchableOpacity
                                                            style={{
                                                                flex: 2,
                                                                shadowColor: '#000',
                                                                shadowOffset: {width: 0, height: 1},
                                                                shadowOpacity: 0.5,
                                                                // marginBottom: 4,
                                                            }}
                                                            activeOpacity={0.4}
                                                            onPress={()=>{}}
                                                        >
                                                            <View
                                                                style={{
                                                                    width: global.width / 2,
                                                                    flex: 1,
                                                                    justifyContent: 'flex-end',

                                                                }}

                                                            >
                                                                <Text style={{
                                                                    color: '#000',
                                                                    fontSize: 18,
                                                                    marginStart: 24,
                                                                    marginBottom: 34,

                                                                }}>  </Text>

                                                            </View>
                                                        </TouchableOpacity>
                                                    )

                                                }}


                                            >
                                            </ImageSelector>
                                        </div>
                                        </View>
                                    </View>
                                )}


                                <View
                                    style={{
                                        flexDirection: 'row',
                                        // alignItems: 'center',
                                        marginStart: 20,
                                        marginTop: 24,
                                    }}
                                >
                                    <Text style={{flex: .4, fontSize: 12, color: drawerItem}}>توضیحات</Text>
                                    <TextInput
                                        placeholder="توضیحات خود را بنویسید..."
                                        placeholderTextColor={subTextItem}
                                        style={styles.textInput}
                                        multiline={true}
                                        onChangeText={text => this.setState({description: text})}
                                        returnKeyType="done"
                                        value={this.state.description}
                                        numberOfLines={4}
                                    />
                                </View>
                            </View>
                        </ScrollView>


                    </View>

                    <SelectTypePhoto
                        visible={this.state.showTypePhoto}
                        onCameraPress={() => this.onPhotoSelector(true)}
                        onGalleryPress={() => this.onPhotoSelector(false)}
                        onDismiss={() => this.setState({showTypePhoto: false})}
                    />

                    {this.state.showFullImage && (
                        <Overlay
                            catchTouch={true}
                            onPress={() => this.setState({showFullImage: false})}
                            close={() => this.setState({showFullImage: false})}
                        >

                           {/* <PanGestureHandler
                                maxPointers={1}
                                onGestureEvent={event => this.animateSwipe(event.nativeEvent.translationY)}
                                onHandlerStateChange={event => {
                                    if (event.nativeEvent.translationY !== 0 && (event.nativeEvent.translationY > 200 || event.nativeEvent.translationY < 200)) {
                                        this.setState({showFullImage: false}, () => this.animateSwipe(0));
                                    }
                                }}
                                style={{justifyContent: 'center'}}

                            >*/}
                                <Animated.View
                                    style={{
                                        // flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        transform: [{translateY: this.state.animatedSwipeClose}],
                                    }}>
                                    <Image
                                        source={this.localImage ? {uri: this.state.imageReceipt} : {
                                            uri: getFileDownloadURL(this.state.imageReceipt),
                                            headers: {Authorization: 'Bearer ' + persistStore.token},
                                        }}

                                        style={{height: height - 100, width: width - 100, borderRadius: 10}}
                                        resizeMode="contain"
                                    />
                                </Animated.View>
                           {/* </PanGestureHandler>*/}
                        </Overlay>
                    )}

                    <LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage}/>
                </View>

            </MobileLayout>
        );
    }



    onBackPress() {
        Router.back();
    }


    isValid() {
        if(!this.state.currentPrice){
            return 'مبلغ را وارد کنید.';
        }
        const price = Number(mapNumbersToEnglish(accounting.unformat(this.state.currentPrice)));
        if(price<1000){
            return 'حداقل مبلغ ۱۰۰۰ تومان.';

        }
        if (this.state.type === CARD_TYPE) {
            if (!this.state.cardNumber) {
                // this.setState({bankRefValidation: false});
                return 'شماره کارت را وارد کنید';
            }
            if (!this.state.accListSelected) {
                // this.setState({accListSelectedValidation: false});
                return 'حساب مقصد را انتخاب کنید.';
            }
            if (!this.state.bankRef) {
                // this.setState({bankRefValidation: false});
                return 'شناسه پرداخت را وارد کنید.';
            }

        }
        if (this.state.type === CHECK_TYPE) {
            if (!this.state.checkDate) {
                // this.setState({accListSelectedValidation: false});
                return 'تاریخ چک را انتخاب کنید.';
            }
            if (!this.state.checkNo) {
                // this.setState({bankRefValidation: false});
                return 'شمار چک را بنویسید.';
            }
            if (!this.state.checkName) {
                // this.setState({bankRefValidation: false});
                return 'نام صاحب حساب را بنویسید. ';
            }

            if (!this.state.bankSelected) {
                // this.setState({bankRefValidation: false});
                return 'بانک را انتخاب کنید.';
            }
            if (!this.state.imageReceipt) {
                // this.setState({bankRefValidation: false});
                return 'تصویر چک را انتخاب کنید.';
            }
        }
        return false;
    }


    getAdminPayQueryNeed() {
        globalState.showBgLoading();
      /*  getPaymentType()
            .then(result => this.setState({payType: result}))
            .catch(e => {
                globalState.hideBgLoading();
                globalState.showToastCard();
            });*/
        getBuildingAccountQuery()
            .then(result => {

                this.setState({facilityList: result});
                if (this.item && this.item.BuildingAccountID) {
                    this.state.accListSelected = result.find(BuildingAccount => BuildingAccount.ID === this.item.BuildingAccountID);
                }

            })
            .catch(e => {
                globalState.hideBgLoading();
                globalState.showToastCard();
            });
        getBankListQuery()
            .then(result => {
                this.setState({bankList: result});
                if (this.item && this.item.ChequeBankID) {
                    this.state.bankSelected = result.find(bank => bank.ID === this.item.ChequeBankID);
                }
            })
            .catch(e => {
                globalState.hideBgLoading();
                globalState.showToastCard();

            })
            .finally(() => globalState.hideBgLoading());
    }

    async adminPayment() {
        Keyboard.dismiss();
        let msg=this.isValid();
        if(msg){
            showWarning(msg);
            return ;
        }
        if (this.state.type === CARD_TYPE) {
            if (!this.state.accListSelected) {
                this.setState({accListSelectedValidation: false});
                return;
            }
            if (!this.state.bankRef) {
                this.setState({bankRefValidation: false});
                return;
            }
        }

        if (this.state.type === CHECK_TYPE ) {
            if (!this.state.checkDate) {
                this.setState({checkDateValidation: false});
                return;
            }
            if (!this.state.checkNo) {
                this.setState({checkNoValidation: false});
                return;
            }
            if (!this.state.checkName) {
                this.setState({checkNameValidation: false});
                return;
            }
            if (!this.state.bankSelected) {
                this.setState({bankSelectedValidation: false});
                return;
            }
            if (!this.state.imageReceipt) {
                this.setState({checkImageValidation: false});
                return;
            }
        }
        const price = Number(mapNumbersToEnglish(accounting.unformat(this.state.currentPrice)));

        if (price < 1000) {
            //this.setState({currentPriceValidation: false});
            showWarning('مبلغ نمی تواند کمتر 1000 تومان باشد')
            return;
        }

        this.setState({loading: true, loadingMessage: 'در حال بررسی و ثبت ...'});
        let paymentInfo = {
            // AnnounceDetailID: this.payInfo.AnnounceDetailID,
            PaymentTypeID: this.state.type === CARD_TYPE ? 2 : this.state.type === CHECK_TYPE ? 4 : 3, // card: 2, cash: 3, check: 4
            Description: this.state.description,

            BuildingID: this.payInfo.user.BuildingID,
            UnitID: this.payInfo.user.UnitID,
            UserID: this.payInfo.user.UserID,

            RoleID: userStore.RoleID,
            CallerBuildingID: userStore.BuildingID,
            CallerUnitID: userStore.UnitID,

        };
        if (this.state.type === CARD_TYPE) {
            paymentInfo = Object.assign(paymentInfo, {
                BuildingAccountID: this.state.accListSelected.ID,
                BankReference: mapNumbersToEnglish(this.state.bankRef),
                CardNo: this.state.cardNumber,
                Image: this.state.imageName ? this.state.imageName : null,
            });
        }
        if (this.state.type === CHECK_TYPE) {
            paymentInfo = Object.assign(paymentInfo, {
                ChequeDate: this.state.checkDate,
                ChequeBankID: this.state.bankSelected.ID,
                ChequeName: this.state.checkName,
                ChequeNo: mapNumbersToEnglish(this.state.checkNo),
                Image: this.state.imageName,
            });
        }
        if (this.item) {
            paymentInfo.ID = this.item.PaymentID;
            paymentInfo.CallerRoleID = userStore.RoleID;
            await updatePaymentManuallyQuery(paymentInfo)
                .then(() => {
                    this.onBackPress();
                })
                .catch(e => {
                    globalState.showToastCard();
                })
                .finally(() => this.setState({loading: false}));
        } else {
            paymentInfo.TotalPrice= price;
            await setPaymentManuallyQuery(paymentInfo)
                .then(() => this.onBackPress())
                .catch(e => {
                    globalState.showToastCard();
                })
                .finally(() => this.setState({loading: false}));
        }


    }

}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        paddingHorizontal: 4,
        borderColor: subTextItem,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 14,
        textAlignVertical: 'top',
        textAlign: 'right',
        padding: 8,
        height: 110,
    },
    buttonIn: {
        flex: 1,
        borderWidth: 0.5,
        alignItems: 'center',
        borderRadius: 4,
        height: 33,
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7,
    },

    multiSwitchItem: {
        flex: 1,
        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
        fontSize: 14,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    multiSwitchItemActive: {
        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        fontSize: 16,
    },

});
