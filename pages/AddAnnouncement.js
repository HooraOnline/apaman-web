import React, {PureComponent} from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    //ToastAndroid,
    TouchableOpacity,
    View,
    KeyboardAwareScrollView,
    IconApp
} from '../src/react-native';
import {
    AlertMessage,
    AndroidBackButton,
    CardUnitInfo, Fab,
    FloatingLabelTextInput,
    LineCustom,
    ListDialogPopUp,
    ListMultiSelect,
    LoadingPopUp,
    PersianCalendarPickerPopup, ShowDateTime,
    ShowPrice, SnakePopup,
    SwitchText,
    ToastCard,
    Toolbar,
} from '../src/components';

import {
    addAnnouncements,
    getCostQuery, getDetailCalculatePaymentQuery,
    getForAnnouncementsCalculationHeader,
    getForAnnouncementsDefaultCharge,
    getPeriodQuery,
    getYearQuery,
} from '../src/network/Queries';
import {
    bgScreen, bgWhite, border, borderSeparate,
    drawerItem,
    lightRed,
    placeholderTextColor,
    primaryDark,
    subTextItem,
    textDisabled,
    textItem,
} from '../src/constants/colors';
import images from "public/static/assets/images";
//import Toast from 'react-native-simple-toast';

import jMoment from 'moment-jalaali';
import {globalState, userStore} from '../src/stores';
//import {NavigationEvents} from 'react-navigation';
import {showMassage, navigation, waitForData} from "../src/utils";
import IOSSwipeCard from "../src/components/IOSSwipeCard";
import accounting from "accounting";


import MobileLayout from "../src/components/layouts/MobileLayout";
export default class AddAnnouncement extends PureComponent {
    constructor(props) {
        super(props);
        this.periods = [];



        this.years = [];
        this.periods = [];
        this.fiscalYear = null;
        this.costs = [];

        this.state = {
            type: false,
            calculationTypes: [
                {text: 'ثابت', checked: true},
                {text: 'فرمول', checked: false},
            ],

            costSelectedHeaderIDs: [],

            showAlertPeriod: false,

            periodValidation: true,
            titleValidation: true,
            deadlineValidation: true,
            costSelectedValidation: true,

            unitsIncludesCost: [],

            periodSelected: null,
            title: '',
            deadlineCharge: null,
            minutesNumber: null,

            showAlertClose: false,

            periodsDetail: [],
            paymentDetailList:[],
            showPaymentDetail:false,
        };
    }

    init=()=>{
        this.getQueryNeed()
            .then(() => {
                if (this.type.id === 1) {
                    if (this.fiscalYear) {
                        if (this.fiscalYear.HasPeriod) {
                            let period=this.state.periodsDetail.find(o => o.IsCurrent);
                            if(!period && this.state.periodsDetail[this.state.periodsDetail.length-1])
                                period=this.state.periodsDetail[this.state.periodsDetail.length-1];

                            if(period)
                                this.setState({periodSelected:period }, () => this.setState({deadlineCharge: period.LastPayDate}));

                            this.changeType(!this.fromCost);
                        } else {
                            this.setState({showAlertPeriod: true});
                        }
                    } else {
                        this.setState({showAlertFiscalYear: true});
                    }
                } else {
                    this.setState({title: this.type.id === 2 ? 'هزینه متغیر' : 'درآمد'});
                }
            })
            .catch(e => {
                console.warn('!!!!!!!!!!!!!!! e:', e);
            }).finally(() => this.hideLoading());
    }
    componentDidMount() {
        this.type = navigation.getParam('type');
        this.fromCost = navigation.getParam('fromCost', false);
        waitForData(()=>this.init());

    }

    async getQueryNeed() {
        this.showLoading();
        if (this.type.id === 1) {
            await getYearQuery()
                .then(result => {
                    this.years = result;
                    this.fiscalYear = result.find(o => o.IsDefaultYear === 1); //==
                })
                .catch(e => {
                    throw e;
                })
                .finally(() => {
                    console.info('!!!!!!!!!!!!!!! getYearQuery & getPeriodQuery finally');
                });

            if (this.fiscalYear) {
                await getPeriodQuery(this.fiscalYear.ID)
                    .then(pResult => {
                        this.periods = pResult;
                        this.setState({periodsDetail: pResult.length > 0 ? JSON.parse(pResult[0].Detail) : []});
                    })
                    .catch(e => {
                        throw e;
                    });
            }
        } else {
            getForAnnouncementsCalculationHeader(this.type.id)
                .then(result => this.setState({unitsIncludesCost: result}))
                .catch(e => this.setState({unitsIncludesCost: []}))
                .finally(() => {
                });
            getCostQuery()
                .then(result => {
                    this.costs = result.filter(o => o.CostClassID == this.type.id && !o.HasAnnounced);
                    const costSelected = [];
                    this.costs.map(o => costSelected.push(o.CalculationHeaderID));
                    this.setState({costSelectedHeaderIDs: costSelected});
                })
                .catch(e => globalState.showToastCard())
                .finally(() => this.setState({loading: false}));
        }
    }

    init() {
        this.getQueryNeed()
            .then(() => {
                if (this.type.id === 1) {
                    if (this.fiscalYear) {
                        if (this.fiscalYear.HasPeriod) {
                            this.setState({periodSelected: this.state.periodsDetail.find(o => o.IsCurrent)},
                                () => this.setState({deadlineCharge: this.state.periodSelected.LastPayDate}));
                            this.changeType(true);
                        } else {
                            this.setState({showAlertPeriod: true});
                        }
                    } else {
                        this.setState({showAlertFiscalYear: true});
                    }
                } else {
                    this.setState({title: this.type.id === 2 ? 'هزینه متغیر' : 'درآمد'});
                }
            })
            .catch(e => {
                console.warn('!!!!!!!!!!!!!!! e:', e);
            }).finally(() => this.hideLoading());
    }

    getForAnnouncementsCalculationHeaderWithIds(ids) {
        this.showLoading();
        getForAnnouncementsCalculationHeader(this.type.id, null, ids)
            .then(result => this.setState({unitsIncludesCost: result}))
            .catch(e => this.setState({unitsIncludesCost: []}))
            .finally(() => this.hideLoading());
    }

    async updateStaticAnnouncement(isCharge) {
        this.showLoading();
        if (isCharge) {
            await getForAnnouncementsDefaultCharge(this.state.periodSelected.ID, 13)
                .then(result => this.setState({unitsIncludesCost: result}))
                .catch(e => this.setState({unitsIncludesCost: []}))
                .finally(() => this.hideLoading());
        } else {
            await getForAnnouncementsCalculationHeader(1, this.state.periodSelected.ID)
                .then(result => this.setState({unitsIncludesCost: result}))
                .catch(e => this.setState({unitsIncludesCost: []}))
                .finally(() => this.hideLoading());
        }
    }

    changeType(val) {
        this.setState({
            type: val,
            title: 'شارژ ' + this.state.periodSelected.Name,
        });
        this.updateStaticAnnouncement(val);
    }

    changePeriod(item) {
        console.log(item);
        this.setState(
            {
                deadlineCharge: item.LastPayDate,
                periodSelected: item,
                periodValidation: true,
                title: 'شارژ ' + item.Name,
            },
            () => this.updateStaticAnnouncement(this.state.type),
        );
    }
    async showDetails(item) {
        console.log(item);
        globalState.showBgLoading();
        await getDetailCalculatePaymentQuery(this.state.periodSelected.ID,this.type.id, item.UserID, item.UnitID)
            .then((result) => {
                console.log(result);
                if(result.length==0){
                    showMassage('جزئیات ندارد',"پیام ",'error');
                    return
                }
                this.setState({paymentDetailList:result,PaymentDetailTitle:item.Name, showPaymentDetail:true})
            })
            .catch(e => globalState.showToastCard())
            .finally(() => globalState.hideBgLoading());
    }
    onBackConfirm() {
        Keyboard.dismiss();
        this.setState({showAlertClose: true});
    }

    render() {
        if(!this.type)
            return null ;
        const toolbarStyle = {
            start: {
                onPress: this.onBackConfirm.bind(this),
                content: images.ic_close,
            },
            title: this.type?this.type.title:'...',
        };

        return (
            <MobileLayout style={{padding:0}} title={this.type.title}
                          header={  <Toolbar customStyle={toolbarStyle}/>}
                          footer={
                              <TouchableOpacity
                                  style={{
                                      backgroundColor: this.checkValidation() ? primaryDark : textDisabled,
                                      alignItems: 'center',
                                  }}
                                  disabled={this.state.unitsIncludesCost.length === 0}
                                  onPress={this.submitAnnouncements.bind(this)}>
                                  <Text
                                      style={{
                                          fontFamily:
                                              Platform.OS === 'ios'
                                                  ? 'IRANYekanFaNum-Bold'
                                                  : 'IRANYekanBold(FaNum)',
                                          fontSize: 16,
                                          paddingVertical: 10,
                                          color: this.checkValidation() ? 'white' : subTextItem,
                                      }}>
                                      ثبت
                                  </Text>
                              </TouchableOpacity>
                          }
            >
                <View style={[styles.screen]}>

                    <AndroidBackButton
                        onPress={() => {
                            this.onBackPressed();
                            return true;
                        }}
                    />
                  {/*  <NavigationEvents onWillFocus={payload => {
                        if (payload.action.type === 'Navigation/BACK') {
                            this.init();
                        }
                    }}/>*/}

                    <KeyboardAwareScrollView style={{  marginBottom: 60,}} enableOnAndroid keyboardDismissMode='on-drag'>
                        <View
                            style={{
                                marginHorizontal: 24,
                                marginBottom: 24,
                                flex: 1,
                            }}>
                            {this.type.id === 1 && this.state.periodSelected && (
                                <View
                                    style={{
                                        marginTop: 24,
                                        marginHorizontal: 16,
                                        flexDirection: 'row',
                                    }}>
                                    <SwitchText
                                        value={this.state.type}
                                        onValueChange={val => this.changeType(val)}
                                        activeText={'شارژ'}
                                        inactiveText={'هزینه'}
                                        backgroundActive={primaryDark}
                                        backgroundInactive={'#fff'}
                                        activeTextStyle={{
                                            paddingVertical: 6,
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? 'IRANYekanFaNum-Bold'
                                                    : 'IRANYekanBold(FaNum)',
                                            fontSize: 16,
                                        }}
                                        inactiveTextStyle={{
                                            paddingVertical: 6,
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? 'IRANYekanFaNum-Bold'
                                                    : 'IRANYekanBold(FaNum)',
                                            fontSize: 16,
                                        }}
                                    />
                                </View>
                            )}

                            {this.type.id === 1 && (
                                <View
                                    style={{
                                        marginTop: 24,
                                        flexDirection: 'row',
                                    }}>
                                    <ListDialogPopUp
                                        title={
                                            this.fiscalYear ? ' انتخاب دوره ' + this.fiscalYear.ID : ''
                                        }
                                        snake
                                        items={this.state.periodsDetail}
                                        validation={this.state.periodValidation}
                                        selectedItem={this.state.periodSelected}
                                        onValueChange={item => this.changePeriod(item)}
                                        selectedItemCustom={
                                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                                <IconApp
                                                    source={'apic_Period'}
                                                    style={{
                                                        marginHorizontal: 8,
                                                        marginVertical: 8,
                                                        height: 24,
                                                        width: 24,
                                                        tintColor: subTextItem,
                                                    }}
                                                />
                                                <Text
                                                    style={{
                                                        padding:10,
                                                        fontFamily:
                                                            Platform.OS === 'ios'
                                                                ? 'IRANYekanFaNum-Bold'
                                                                : 'IRANYekanBold(FaNum)',
                                                    }}>
                                                    {this.state.periodSelected
                                                        ? this.state.periodSelected.Name
                                                        : 'انتخاب دوره'}
                                                </Text>
                                            </View>
                                        }
                                        itemComponent={item => (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    paddingHorizontal: 8,
                                                    alignItems: 'center',
                                                }}>
                                                <Text
                                                    style={{
                                                        paddingVertical: 16,
                                                        alignSelf: 'flex-start',
                                                    }}>
                                                    {item.Name}
                                                </Text>

                                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: drawerItem,
                                                        }}>
                                                        از {jMoment(item.StartDate).format('jD jMMMM')} تا{' '}
                                                        {jMoment(item.EndDate).format('jD jMMMM')}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    />

                                </View>
                            )}

                            <View
                                style={{
                                    marginTop: 24,
                                    flexDirection: 'row',
                                    position:'relative',
                                }}>
                                <FloatingLabelTextInput
                                    ref={input => {
                                        this.StaticMKTextFieldInput = input;
                                    }}
                                    editable={true}
                                    multiline={false}
                                    maxLength={70}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.titleValidation ? placeholderTextColor : lightRed
                                    }
                                    textInputStyle={{
                                        fontWeight: 'normal',
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-ExtraBold'
                                                : 'IRANYekanExtraBold',
                                        color: textItem,
                                        fontSize: 16,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        textAlign: 'right',
                                    }}
                                    underlineSize={1}
                                    placeholder={'عنوان'}
                                    style={{flex: 1,}}
                                    onChangeText={text =>
                                        this.setState({
                                            title: text,
                                            titleValidation: true,
                                        })
                                    }
                                    highlightColor={primaryDark}
                                    value={this.state.title}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        end: 0,
                                        bottom: 7,
                                    }}>
                                    <IconApp
                                        source={"apic_edit"}
                                        style={{
                                            height: 24,
                                            width: 24,
                                            tintColor: subTextItem,
                                        }}
                                    />
                                </View>
                            </View>

                            {this.type.id !== 1 && (
                                <View
                                    style={{
                                        marginTop: 24,
                                        flexDirection: 'row',
                                    }}>
                                    <ListMultiSelect
                                        title={this.type.id === 3 ? 'انتخاب درآمد' : 'انتخاب هزینه متغیر'}
                                        fieldItem="CostTypeName"
                                        idItem="CalculationHeaderID"
                                        validation={this.state.costSelectedValidation}
                                        disabled={this.costs.length === 0}
                                        items={this.costs}
                                        selectedIcon={images.ic_nd2_bill}
                                        selectedTitle={(this.state.costSelectedHeaderIDs.length > 0 ? this.state.costSelectedHeaderIDs.length : '')
                                        + (this.type.id === 3 ? ' درآمد انتخاب شده' : ' هزینه انتخاب‌ شده')}
                                        selectedItems={this.state.costSelectedHeaderIDs}
                                        onAccept={selectedItems => {
                                            console.warn('%%%%%%%%%%%%% selectedItems: ', selectedItems);
                                            this.getForAnnouncementsCalculationHeaderWithIds(selectedItems);
                                            this.setState({
                                                costSelectedHeaderIDs: selectedItems,
                                                costSelectedValidation: true,
                                            });
                                        }
                                        }
                                    />
                                </View>
                            )}

                            <View style={{flexDirection: 'row', marginTop: 24, alignItems: 'center'}}>
                                {(this.type.id === 1 || this.type.id === 2) && (
                                    <View
                                        style={{
                                            width: 170,
                                            marginEnd: this.type.id === 2 ? 16 : 0,
                                            justifyContent: 'center',
                                        }}>
                                        <PersianCalendarPickerPopup
                                            showToday
                                            // simple
                                            validation={this.state.deadlineValidation}
                                            selectedDate={this.state.deadlineCharge}
                                            iconColor={subTextItem}
                                            onValueChange={date =>
                                                this.setState({
                                                    deadlineCharge: date,
                                                    deadlineValidation: true,
                                                })
                                            }
                                            defaultTitle="مهلت پرداخت"
                                        />
                                    </View>
                                )}
                                {(this.type.id === 2 || this.type.id === 3) && (
                                    <FloatingLabelTextInput
                                        floatingLabelEnable={false}
                                        editable={true}
                                        multiline={false}
                                        maxLength={70}
                                        keyboardType="numeric"
                                        type={'number'}
                                        returnKeyType="done"
                                        numberOfLines={1}
                                        tintColor={placeholderTextColor}
                                        textInputStyle={{
                                            fontWeight: 'normal',
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? 'IRANYekanFaNum-Bold'
                                                    : 'IRANYekanBold(FaNum)',
                                            color: textItem,
                                            fontSize: 12,
                                            paddingStart: 4,
                                            paddingTop: 1,
                                            paddingBottom: 3,
                                            textAlign: 'right',
                                        }}
                                        style={{flex: 1}}
                                        underlineSize={1}
                                        placeholder="شماره صورت جلسه"
                                        onChangeText={text =>
                                            this.setState({
                                                minutesNumber: text,
                                            })
                                        }
                                        highlightColor={primaryDark}
                                        value={this.state.minutesNumber}
                                    />
                                )}
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginHorizontal: 24,
                                marginTop: 8,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-ExtraBold'
                                            : 'IRANYekanExtraBold',
                                    fontSize: 16,
                                }}>
                                {this.type.id === 3 ? 'دریافت کنندگان' : 'پرداخت کنندگان'}
                            </Text>
                            {this.state.unitsIncludesCost.length > 0 && (
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text
                                        style={{
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? 'IRANYekanFaNum-Light'
                                                    : 'IRANYekanLight(FaNum)',
                                            fontSize: 12,
                                            marginEnd: 10,
                                        }}>
                                        جمع کل
                                    </Text>
                                    <ShowPrice
                                        price={this.state.unitsIncludesCost.reduce(
                                            (a, b) => a + (parseFloat(b.Price) || 0),
                                            0,
                                        )}
                                    />
                                </View>
                            )}
                        </View>

                        <View
                            style={{
                                flex: 1,
                                marginHorizontal: 24,
                                marginVertical: 8,
                            }}>
                            <LineCustom color={subTextItem}/>
                        </View>

                        <FlatList
                            ListEmptyComponent={
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            marginTop: 8,
                                            marginHorizontal: 24,
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? 'IRANYekan-ExtraBold'
                                                    : 'IRANYekanExtraBold',
                                            fontSize: 18,
                                            textAlign: 'center',
                                        }}>
                                        {' '}
                                        برای "{this.state.title}" موردی ثبت نشده است!{' '}
                                    </Text>
                                    <Image
                                        // resizemode='center'
                                        source={images.es_calculator}
                                        style={{width:global.width, height: (global.width / 100) * 43}}
                                    />
                                </View>
                            }
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.unitsIncludesCost}
                            extraData={this.state.unitsIncludesCost}
                            renderItem={({item,index}) => (
                                <IOSSwipeCard
                                    //noPadding
                                    style={{marginHorizontal:24,}}
                                    index={index}
                                    onMore={() => this.showDetails(item)}
                                    moreIcon={images.ic_idCard}
                                    moreLabel={'جزئیات'}
                                    onClose={() => {
                                        this.setState({isOpen: true});
                                    }}
                                    onOpen={id => {
                                        this.setState({isOpen: false, idSwipeOpened: id});
                                    }}
                                    idSwipeOpened={this.state.idSwipeOpened}
                                >
                                    <CardUnitInfo
                                        unitNumber={item.UnitNumber}
                                        floorNumber={item.FloorNumber}
                                        area={item.Area}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                paddingVertical: 18,
                                                alignItems: 'center',
                                                // justifyContent: 'center'
                                            }}>
                                            <View
                                                style={{
                                                    flexDirection: 'column',
                                                    flex: 1,
                                                }}>
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            Platform.OS === 'ios'
                                                                ? 'IRANYekanFaNum-Bold'
                                                                : 'IRANYekanBold(FaNum)',
                                                        alignSelf: 'flex-start',
                                                    }}>
                                                    {item.Name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: drawerItem,
                                                    }}>
                                                    {item.RoleName}
                                                </Text>
                                            </View>
                                            <ShowPrice
                                                price={item.Price}
                                                colorCurrency={drawerItem}
                                                fontSizeCurrency={12}
                                            />
                                        </View>
                                    </CardUnitInfo>

                                </IOSSwipeCard>
                            )}
                        />
                    </KeyboardAwareScrollView>
                    <SnakePopup
                        visible={this.state.showPaymentDetail}
                        maxHeight={global.height - 70}
                        containerStyle={{paddingBottom:18}}
                        toolbarTitle={"صورتحساب " + this.state.PaymentDetailTitle + (this.user?' '+this.user.Name:'')}
                        items={this.state.paymentDetailList}
                        fromTop
                        itemSeparatorComponent = {() => (
                            <View
                                style={ {
                                    height: 0,
                                    backgroundColor: borderSeparate,
                                    marginHorizontal: 16,
                                }}
                            />
                        )}
                        onItemSelected={item => {

                        }}
                        onClose={() => this.setState({showPaymentDetail: false})}
                        ListHeaderComponentStyle={{backgroundColor:border,paddingHorizontal:5, }}
                        ListHeaderComponent={(item)=>{
                            return (
                                <View style={{flexDirection:'row',justifyContent:'space-between',padding:5}}>
                                    <View style={{flex:1, justifyContent:'center'}}>
                                        <Text style={{color:bgWhite}}>تاریخ</Text>
                                    </View>
                                    <View style={{flex:1,justifyContent:'center',}}>
                                        <Text style={{color:bgWhite}}>مبلغ</Text>
                                    </View>

                                    <View style={{flex:0.5, justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{color:bgWhite}}> فرمول</Text>
                                    </View>
                                </View>
                            )
                        }}
                        itemComponent={(item,index) => (
                            <View style={{backgroundColor:index%2?'#fff':'#fff',marginTop:5,marginHorizontal:3,borderWidth:1,borderRadius:10,borderStyle:'dashed',borderColor:borderSeparate,}}>
                                <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:0}}>
                                    <View style={{flex:1, justifyContent:'center',marginStart:5}}>
                                        <ShowDateTime
                                            style={{}}
                                            time={item.CreatedAtDate}
                                            //showTime
                                            fontSize={12}
                                            color={border}
                                            dotSize={2}
                                        />
                                    </View>
                                    <View style={{flex:1,justifyContent:'center'}}>
                                        <Text style={{color:border,fontSize:12}}>{accounting.formatMoney(item.Price, '', 0, ',') + ' ' + userStore.CurrencyID}</Text>
                                    </View>
                                    <View style={{flex:0.5, justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{color:border,fontSize:12}}>{item.CostTypeFormula}</Text>
                                    </View>
                                </View>
                                <View style={{flex: 1, marginBottom:1,padding:7,}}>
                                    <Text style={{color:border,fontSize:10,}}>بابت {item.Name} </Text>
                                </View>
                            </View>

                        )}
                    />

                    <AlertMessage
                        visible={this.state.showAlertPeriod}
                        title="انتخاب دوره"
                        message="برای سال مالی انتخابی دوره ای تعریف نشده، لطفاً دوره مورد نظر را اضافه نمایید"
                        onConfirm={() => this.goToSelectYear()}
                        onDismiss={() => this.closeModalProcessCalcPopup()}
                        confirmTitle="ثبت دوره"
                        // onFinish={() => this.shutdownModal()}
                    />

                    <AlertMessage
                        visible={this.state.showAlertClose}
                        title="خروج از صفحه؟"
                        message="در صورت خروج از صفحه، تغییرات ذخیره نخواهد شد."
                        onConfirm={() => {
                            this.setState({showAlertClose: false}, () => {
                                // if (Platform.OS === 'android') this.onBackPress(); // for onModal
                                this.onBackPressed();
                            });
                        }}
                        onDismiss={() => this.setState({showAlertClose: false})}
                        confirmTitle="خروج"
                        dismissTitle="ادامه"
                        // onFinish={() => this.state.iosShowAlertClose ? this.onBackPress() : {}} //for onModal -> ios
                    />
                    <LoadingPopUp
                        visible={this.state.loading}
                        message={this.state.loadingMessage}
                    />

                    <ToastCard
                        visible={this.state.showNotification}
                        type={this.state.notificationType}
                        onClose={() => this.setState({showNotification: false})}
                    />
                </View>
            </MobileLayout>
        );
    }

    goToSelectYear() {
        this.setState(
            {
                showAlertFiscalYear: false,
                showAlertPeriod: false,
            },
            () => this.navigation.navigate('Years'),
        );
    }

    checkValidation() {
        const fixed = this.type.id === 1 ? !!this.state.periodSelected : true;
        const deadline = this.type.id === 3 ? true : !!this.state.deadlineCharge;
        const isCostSelected = this.type.id === 1 ? true : this.state.costSelectedHeaderIDs.length > 0;
        return (
            fixed &&
            !!this.state.title &&
            deadline &&
            this.state.unitsIncludesCost.length > 0 &&
            isCostSelected
        );
    }

    showDatePicker() {
        this.setState({showDatePickerDialog: true});
    }

    hideDatePicker() {
        this.setState({showDatePickerDialog: false});
    }

    showLoading(message = 'در حال دریافت اطلاعات...') {
        this.setState({loading: true, loadingMessage: message});
    }

    hideLoading() {
        this.setState({loading: false});
    }

    async submitAnnouncements() {
        if (!this.state.title) {
            this.setState({titleValidation: false});
            this.StaticMKTextFieldInput.focus();
            showMassage('پیام','لطفا عنوان را وارد نمایید.','info');
            //Toast.show('لطفا عنوان را وارد نمایید.', ToastAndroid.SHORT);
            return;
        }

        if (this.type.id !== 1) {
            if (this.state.costSelectedHeaderIDs.length === 0) {
                this.setState({costSelectedValidation: false});
                const message =
                    'لطفاً ' +
                    (this.type.id === 2 ? 'هزینه‌ها' : 'درآمد‌ها') +
                    ' را انتخاب نمایید.';
                showMassage('پیام',message,'info');
                //Toast.show(message, ToastAndroid.SHORT);
                return;
            }
        }

        if (this.type.id !== 3 && !this.state.deadlineCharge) {
            this.setState({deadlineValidation: false});
            showMassage('پیام','لطفاً مهلت پرداخت را انتخاب نمایید.','info');
            //Toast.show('لطفاً مهلت پرداخت را انتخاب نمایید.', ToastAndroid.SHORT);
            return;
        }

        this.showLoading();
        const PeriodDetailID =
                this.type.id === 1 ? this.state.periodSelected.ID : null,
            IsDefault = this.type.id === 1 ? (this.state.type ? 1 : 0) : null,
            CalculationHeaderIDs =
                this.type.id !== 1
                    ? '[' + this.state.costSelectedHeaderIDs.toString() + ']'
                    : null,
            RecordNumber = this.type.id !== 1 ? this.state.minutesNumber : null,
            LastPayDate = this.type.id !== 3 ? this.state.deadlineCharge : null;

        const announcement = {
            PeriodDetailID: PeriodDetailID,
            CostClassID: this.type.id,
            IsDefault: IsDefault,
            CalculationHeaderIDs: CalculationHeaderIDs,
            Title: this.state.title,
            RecordNumber: RecordNumber,
            LastPayDate: LastPayDate,
        };

        await addAnnouncements(announcement)
            .then(() => {
                this.onBackPressed();
            })
            .catch(e => globalState.showToastCard())
            .finally(() => this.hideLoading());
    }

    onBackPressed() {
        navigation.goBack();
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: bgScreen,
    },
    buttonIn: {
        borderWidth: 0.5,
        alignItems: 'center',
        borderRadius: 4,
        height: 33,
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7,
    },
});
