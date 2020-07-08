import React, {PureComponent} from 'react';
import {
    FlatList, Icon, IconApp,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    //LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from '../src/react-native';
import {observer} from 'mobx-react';
import {
    AlertMessage,
    AndroidBackButton,
    DetailDialog,
    Fab,
    IOSSwipeCard,
    LoadingPopUp, ShowDateTime,
    ShowPrice,
    SnakePopup,
    Toolbar,
    TransactionCard,
    TransactionDetailDialog,
    TransactionDialog,
} from '../src/components';
import {waitForData,doDelay} from '../src/utils';
import images from "../public/static/assets/images";
import {
    bgEmpty,
    bgItem,
    bgScreen,
    bgToolbarInfo, bgWhite, border, borderSeparate,
    fab,
    primaryDark,
    subTextItem,
    textDisabled,
    textRed,
    textRedLight,
    toolbarItem,
} from '../src/constants/colors';
import {globalState, persistStore, userStore} from '../src/stores';
import {permissionId} from '../src/constants/values';
import {
    deletePaymentQuery,
    getBuildingAccountQuery,
    getDetailPaymentQuery,
    getForPaymentDetailQuery,
    getForPaymentQuery,
    getPaymentType,
    getTransaction,
    setPaymentQuery,
} from '../src/network/Queries';
//import Communications from 'react-native-communications';
//import {NavigationEvents} from 'react-navigation';
import {onScrollFab, showMassage,navigation} from '../src/utils';
import MobileLayout from "../src/components/layouts/MobileLayout";
import accounting from "accounting";
import Router from "next/router";

const FILTER_ALL = 'all',
    FILTER__PAYABLE = 'payable',
    FILTER__PAID = 'paid',
    FILTER__TRANSACTION = 'transaction';

@observer
class PayAnnounce extends PureComponent {
   constructor(props) {
        super(props);
        this.pageTitle = 'پرداخت هزینه';
        this.forPayment = [];
        this.payTransaction = [];
        this.payableLength = 0;
        this.filterScrollView = null;
        this.state = {
            showOverlay: false,
            showEditPopUp: false,
            nominatedToDeleteItem: null,

            showDetail: false,
            nominateToDetailItem: null,

            showTransactionDetail: false,
            nominateTransactionDetailItem: null,

            nominateToDetailPayItem: null,

            type: true,
            loading: false,
            loadingMessage: '',
            forPayment: [],
            nominatedToPay: null,
            accListSelected: null,
            payTypeSelected: null,
            payType: [],
            accList: [],
            description: null,
            payTypeSelectedValidation: true,
            accListSelectedValidation: true,
            cardNumberValidation: true,
            cardNumber: null,
            bankRef: null,

            payState: FILTER_ALL, // Payable & Paid & transaction

            nominateToDetailPay: null,
            showTransactionDialog: false,

            isFabVisible: true,

            calListSelected: [],
            showCallList: false,
            showPaymentDetail:false,
            paymentDetailList:[],

        };
        this.hideAdminPayPopupIos = false;
    }

    async componentDidMount() {
        waitForData(()=>{
            this.user =  navigation.getParam('adminForPayUser', null);
            if (this.user) {
                this.pageTitle = this.user.Name;
            }
            this.state.permission= userStore.findPermission(this.user ? permissionId.manualPay : permissionId.pay) ||{};
            this.setState({permission:this.state.permission});
            this.init();
        })
    }

    async init() {
        await this.getPayments().then(() => {
            globalState.showBgLoading();
            const transactionData = {
                CallerRoleID: userStore.RoleID,
                CallerBuildingID: userStore.BuildingID,
                CallerUnitID: userStore.UnitID,

                BuildingID: this.user ? this.user.BuildingID : userStore.BuildingID,
                UnitID: this.user ? this.user.UnitID : userStore.UnitID,
                UserID: this.user ? this.user.UserID : userStore.userID,

                Offset: 1,
                Lenght: 10,
            };

            getTransaction(transactionData)
                .then(result => {
                    this.payTransaction = result;
                    this.changeFilter(this.state.payState);
                })
                .catch(e => globalState.showToastCard())
                .finally(() => globalState.hideBgLoading());
        });

        if (this.user) {
            this.getAdminPayQueryNeed();
        }
    }

    changeFilter(type) {
        this.setState({idSwipeOpened: -1});
        if (type === FILTER_ALL) {
            //this.filterScrollView.scrollTo({x: Platform.OS === 'ios' ? 0 : global.width, animated: true});
            this.setState({payState: type, forPayment: this.forPayment}); //.concat(this.payTransaction)
        } else if (type === FILTER__PAYABLE) {
            //this.filterScrollView.scrollTo({x: global.width / 2, animated: true});
            this.setState({
                payState: type,
                forPayment: this.forPayment.filter(o => o.HasPaid == 0 || o.HasPaid == 2),
            });
        } else if (type === FILTER__PAID) {
            //this.filterScrollView.scrollTo({x: global.width / 2, animated: true});
            this.setState({
                payState: type,
                forPayment: this.forPayment.filter(o => o.HasPaid == 1),
            });
        } else if (type === FILTER__TRANSACTION) {
            //this.filterScrollView.scrollTo({x: Platform.OS === 'ios' ? global.width : 0, animated: true});
            this.setState({
                payState: type,
                forPayment: this.payTransaction,
            });
        }
    }

    editTransaction(transaction) {
        if(transaction.PaymentTypeID==1){
            return;
        }
        const payInfo = {
            Title: 'ویرایش تراکنش',
            Mandeh: transaction.TotalPrice,
            Transaction: transaction,
        };
        navigation.navigate('/ManualPay', {payInfo: Object.assign(payInfo, {user: this.user})});
    }
    showTransactionRemoveDialog(item){
        console.log(item);
        this.selectedItem=item;
        this.setState({showDeletePopUp:true})
    }
    async onConfirmTransactionDelete(){
        this.setState({loading: true, loadingMessage: 'در حال حذف ...', showDeletePopUp: false});
        const id = this.selectedItem.PaymentID;
        await deletePaymentQuery({ID:id})
            .then(() =>this.init())
            .catch(e => {

            })
            .finally(() => {
                this.setState({loading: false});
                globalState.showToastCard();
            });
    }
    async showDetails(item) {
        console.log(item);
        console.log(this.user);
        const userId =this.user?this.user.UserID:userStore.userID;
        const unitId =this.user?this.user.UnitID:userStore.UnitID;
        globalState.showBgLoading();
        await getDetailPaymentQuery(item.AnnounceDetailID, userId, unitId)
            .then((result) => {
                console.log(result);
                if(result.length==0){
                    showMassage('جزئیات ندارد',"پیام ",'error');
                    return
                }
                this.setState({paymentDetailList:result,PaymentDetailTitle:item.Title, showPaymentDetail:true})
            })
            .catch(e => globalState.showToastCard())
            .finally(() => globalState.hideBgLoading());
    }

    render() {

        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: this.pageTitle,
            subTitle: this.user ? this.user.RoleName : null,
            end: this.user
                ? {
                    itemComponent: (
                        <View
                            style={{
                                marginEnd: 16,
                                borderWidth: 1,
                                borderRadius: 10,
                                backgroundColor: bgToolbarInfo,
                                borderColor: textRed,
                            }}>
                            <View
                                style={{
                                    marginHorizontal: 4,
                                    borderBottomWidth: 0.5,
                                    borderColor: textRedLight,
                                }}>
                                <Text style={{color: toolbarItem, textAlign: 'center'}}>
                                    {this.user.UnitNumber}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    marginVertical: 4,
                                }}>
                                <View
                                    style={{
                                        width: 33,
                                        borderEndWidth: 1,
                                        borderColor: textRedLight,
                                    }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: toolbarItem,
                                        }}>
                                        {this.user.FloorNumber}
                                    </Text>
                                </View>
                                <View style={{width: 33}}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: toolbarItem,
                                        }}>
                                        {this.user.Area}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ),
                } : {
                    itemComponent: (
                        <View style={{marginEnd: 16}}>
                            <ShowPrice
                                color={toolbarItem}
                                colorCurrency={toolbarItem}
                                price={userStore.UnitBalance}
                            />
                        </View>
                    ),
                },
            actionList: this.user ? [
                {
                    onPress: () => {
                        this.callHandler(this.user);
                    },
                    icon: images.ic_call,
                },
            ] : null,
        };

        return (
            <MobileLayout child={this} style={{padding:0}} title={ this.pageTitle}
              header={
                  <View>
                      <Toolbar customStyle={toolbarStyle}/>
                      <ScrollView
                          ref={ref => this.filterScrollView = ref}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={{
                              flexGrow: 0,
                              backgroundColor: bgScreen,
                              elevation: 4,
                              shadowColor: '#000',
                              shadowOffset: {width: 0, height: 1},
                              shadowOpacity: 0.5,
                          }}
                          contentContainerStyle={{
                              paddingStart: 8,
                              marginHorizontal: 8,
                              marginBottom: 8,
                              // justifyContent: 'center',
                              // alignItems: 'center',
                              // borderBottomEndRadius: 10,
                              // borderBottomStartRadius: 10,
                          }}
                      >
                          <View style={{flex: 1, flexDirection: 'row', paddingTop: 8, backgroundColor: bgScreen}}>
                              <TouchableOpacity
                                  onPress={() => this.changeFilter(FILTER_ALL)}
                                  disabled={this.state.payState === FILTER_ALL}
                                  style={[styles.btnFilter, {
                                      backgroundColor: this.state.payState === FILTER_ALL ? primaryDark : bgScreen,
                                      borderWidth: this.state.payState === FILTER_ALL ? 0 : 1,
                                  }]}>
                                  <Text
                                      style={[styles.txtBtnFilter, {
                                          fontFamily: this.state.payState === FILTER_ALL
                                              ? Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold'
                                              : Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                          color: this.state.payState === FILTER_ALL ? 'white' : subTextItem,
                                      }]}>
                                      همه
                                  </Text>
                              </TouchableOpacity>
                              <View
                                  style={[styles.btnFilter, {
                                      backgroundColor: this.state.payState === FILTER__PAYABLE ? primaryDark : bgScreen,
                                      borderWidth: this.state.payState === FILTER__PAYABLE ? 0 : 1,
                                      position:'relative'
                                  }]}>
                                  <TouchableOpacity
                                      onPress={() => this.changeFilter(FILTER__PAYABLE)}
                                      disabled={this.state.payState === FILTER__PAYABLE}
                                      style={{}}>
                                      <Text
                                          style={[styles.txtBtnFilter, {
                                              fontFamily: this.state.payState === FILTER__PAYABLE
                                                  ? Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold'
                                                  : Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                              color: this.state.payState === FILTER__PAYABLE ? 'white' : subTextItem,
                                          }]}>
                                          پرداخت نشده
                                      </Text>
                                  </TouchableOpacity>
                                  {this.payableLength > 0 && (
                                      <View
                                          style={{
                                              backgroundColor: fab,
                                              width: 20,
                                              height: 20,
                                              borderRadius: 12,
                                              position: 'absolute',
                                              top: -7,
                                              end: -6,
                                              justifyContent: 'center',
                                              alignItems:'center',
                                              // alignSelf: 'flex-end'
                                          }}>
                                          <Text
                                              style={{
                                                  fontFamily:
                                                      Platform.OS === 'ios'
                                                          ? 'IRANYekanFaNum-Bold'
                                                          : 'IRANYekanBold(FaNum)',
                                                  fontSize: 12,
                                                  paddingTop:2,
                                                  textAlign: 'center',
                                                  color:bgWhite,
                                                  transform: [{translateY: -1}],
                                              }}>
                                              {this.payableLength}
                                          </Text>
                                      </View>
                                  )}
                              </View>
                              <TouchableOpacity
                                  onPress={() => this.changeFilter(FILTER__PAID)}
                                  disabled={this.state.payState === FILTER__PAID}
                                  style={[styles.btnFilter, {
                                      backgroundColor: this.state.payState === FILTER__PAID ? primaryDark : bgScreen,
                                      borderWidth: this.state.payState === FILTER__PAID ? 0 : 1,
                                  }]}>
                                  <Text
                                      style={[styles.txtBtnFilter, {
                                          fontFamily: this.state.payState === FILTER__PAID
                                              ? Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold'
                                              : Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                          color: this.state.payState === FILTER__PAID ? 'white' : subTextItem,
                                      }]}>
                                      پرداخت شده
                                  </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                  onPress={() => this.changeFilter(FILTER__TRANSACTION)}
                                  disabled={this.state.payState === FILTER__TRANSACTION}
                                  style={[styles.btnFilter, {
                                      backgroundColor: this.state.payState === FILTER__TRANSACTION ? primaryDark : bgScreen,
                                      borderWidth: this.state.payState === FILTER__TRANSACTION ? 0 : 1,
                                  }]}>
                                  <Text
                                      style={[styles.txtBtnFilter, {
                                          fontFamily: this.state.payState === FILTER__TRANSACTION
                                              ? Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold'
                                              : Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                          color: this.state.payState === FILTER__TRANSACTION ? 'white' : subTextItem,
                                      }]}>
                                      تراکنش ها
                                  </Text>
                              </TouchableOpacity>
                          </View>
                      </ScrollView>
                  </View>

              }
              footer= {this.state.forPayment.length > 0 && this.state.isFabVisible && this.state.permission.writeAccess && (
                  <View
                      pointerEvents="box-none"
                      style={{
                          ...StyleSheet.absoluteFillObject,
                          alignItems: 'flex-end',
                          justifyContent: 'flex-end',
                          flex: 1,
                          marginEnd: 16,
                          marginBottom: 24,
                      }}
                  >
                      <Fab
                          onPress={this.goToPayManual.bind(this)}
                          icon={images.ic_add}
                      />
                  </View>
              )}


            >
            <View
                style={{
                    flex: 1,
                    marginTop:50,
                    backgroundColor:
                        this.state.forPayment.length > 0 ? bgScreen : bgEmpty,
                }}>

                <AndroidBackButton
                    onPress={() => {
                        if (this.state.loading) {
                            return true;
                        } else if (this.state.showTransactionDialog) {
                            this.setState({showTransactionDialog: false});
                        } else if (this.state.showTransactionDetail) {
                            this.setState({showTransactionDetail: false});
                        } else if (this.state.showOverlay) {
                            this.setState({
                                showOverlay: false,
                                showEditPopUp: false,
                                nominatedToDeleteItem: null,
                                nominateToEditItem: null,
                            });
                        } else {
                            this.onBackPress();
                        }
                        return true;
                    }}
                />
              {/*  <NavigationEvents onWillFocus={payload => {
                    if (payload.action.type === 'Navigation/BACK') {
                        this.init();
                    }
                }}/>*/}

                <FlatList
                    ListEmptyComponent={
                        <View
                            style={{
                                height: global.height - 170,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                source={images.es_bills}
                                style={{width: global.width, height: (global.width / 100) * 62}}
                            />
                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-ExtraBold'
                                            : 'IRANYekanExtraBold',
                                    fontSize: 18,
                                    textAlign: 'center',
                                    marginTop: 8,
                                }}>
                                {
                                    this.state.payState === FILTER_ALL ? 'هنوز هزینه ای اعلام نشده است!'
                                        : this.state.payState === FILTER__PAYABLE ? 'هنوز هزینه ای برای پرداخت وجود ندارد!'
                                        : this.state.payState === FILTER__PAID ? 'هنوز پرداختی صورت نگرفته است!'
                                            : 'هنوز تراکنشی صورت نگرفته است!'
                                }
                            </Text>

                            <View style={{marginTop: 24}}>
                                <Fab
                                    onPress={this.goToPayManual.bind(this)}
                                    icon={images.ic_add}
                                    title={'افزایش موجودی'}
                                />
                            </View>
                        </View>
                    }
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.forPayment}
                    onScroll={this.onScrollFab}
                    extraData={this.state.forPayment}
                    renderItem={({item, index}) => (
                        <IOSSwipeCard
                            //noPadding
                            style={{
                                marginHorizontal: 24
                            }}
                            //disabled={ this.state.payState!=FILTER__TRANSACTION}
                            index={index}
                            permission={this.state.permission}
                            onDelete={this.state.payState == FILTER__TRANSACTION && item.PaymentTypeID !== "1" ? () =>this.showTransactionRemoveDialog(item)  : null}
                            onEdit={this.state.payState == FILTER__TRANSACTION && item.PaymentTypeID !== "1" ? () => this.editTransaction(item) : null}
                            onMore={this.state.payState !== FILTER__TRANSACTION?() => this.showDetails(item):null}
                            editColor={item.PaymentTypeID == "1" ? textDisabled : '#1CC4AD'}
                            editCorner={true}
                            moreIcon={images.ic_IDcard}
                            moreLabel={'جزئیات'}
                            moreDisabled={true}
                            onClose={() => {
                                this.setState({isOpen: true});
                            }}
                            onOpen={id => {
                                this.setState({isOpen: false, idSwipeOpened: id});
                            }}
                            idSwipeOpened={this.state.idSwipeOpened}
                        >
                            <TransactionCard
                                item={item}
                                style={{
                                    marginHorizontal: 0,
                                    marginTop: 12,
                                    marginBottom: 8.3,
                                }}
                                onPress={item => {
                                    const status = parseInt(item.HasPaid);

                                    if (status === 0) {
                                        !!this.user
                                            ? navigation.navigate('/ManualPay', {
                                                payInfo: Object.assign(item, {user: this.user}),
                                            })
                                            : this.setState({nominateToDetailPay: item, showTransactionDialog: true});
                                    } else {
                                        this.showDetail(item);
                                    }
                                }}
                            />
                        </IOSSwipeCard>
                    )}
                />


                {this.state.showTransactionDialog && (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        style={{...StyleSheet.absoluteFillObject, flex: 1}}>
                        <TransactionDialog
                            visible={this.state.showTransactionDialog}
                            item={this.state.nominateToDetailPay}
                            onConfirm={newPrice => this.payment(newPrice, this.state.nominateToDetailPay)}
                            onDismiss={() => this.setState({showTransactionDialog: false})}
                        />
                    </KeyboardAvoidingView>
                )}


                {this.state.showDetail && (
                    <DetailDialog
                        style={{width:(global.width>500?500:global.width-20)-30}}
                        width={global.width>500?500:global.width-20}
                        visible={this.state.showDetail}
                        title={this.state.nominateToDetailItem.Title}
                        subTitle={this.state.nominateToDetailItem.CostClassName
                        + (this.state.nominateToDetailItem.CostClassID == 1 ? this.state.nominateToDetailItem.IsDefault ? ' شارژ' : ' هزینه' : '')
                        + (this.state.nominateToDetailItem.PeriodName ? ' . ' + this.state.nominateToDetailItem.PeriodName : '')}//ToDo get from Object
                        price={this.state.nominateToDetailItem.Price}
                        remaining={this.state.nominateToDetailItem.Mandeh}
                        status={parseInt(this.state.nominateToDetailItem.HasPaid)}
                        statusText={
                            this.state.nominateToDetailItem.HasPaid == 1 ? 'پرداخت شده' : 'کامل پرداخت نشده'
                        }
                        items={this.state.nominateToDetailItem.items}
                        onDismiss={() => this.setState({showDetail: false})}
                        onConfirm={() => {
                            this.setState({
                                showDetail: false,
                            });
                            !!this.user
                                ? navigation.navigate('/ManualPay', {
                                    payInfo: Object.assign(this.state.nominateToDetailItem, {user: this.user}),
                                })
                                : this.setState({
                                    showDetail: false,
                                    nominateToDetailPay: this.state.nominateToDetailItem,
                                    showTransactionDialog: true,
                                });
                        }}
                    />
                )}

                {this.state.showTransactionDetail && (
                    <TransactionDetailDialog
                        visible={this.state.showTransactionDetail}
                        item={this.state.nominateTransactionDetailItem}
                        onDismiss={() => this.setState({showTransactionDetail: false})}
                    />
                )}

                <SnakePopup
                    visible={this.state.showCallList}
                    toolbarTitle="شماره های تماس"
                    items={this.state.calListSelected}
                    fromTop={50}
                    onItemSelected={item => {
                       // Communications.phonecall(item.TelNo, true);
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
                                source={item.TelNo.startsWith('09') ? 'apic_Phone' : 'apic_call'}
                                style={{
                                    height: 24,
                                    width: 24,
                                    tintColor: subTextItem,
                                }}
                            />
                        </View>
                    )}
                />
                <SnakePopup
                    visible={this.state.showPaymentDetail}
                    maxHeight={global.height - 70}
                    containerStyle={{paddingBottom:18}}
                    toolbarTitle={"صورتحساب " + this.state.PaymentDetailTitle + (this.user?' '+this.user.Name:'')}
                    items={this.state.paymentDetailList}
                    fromTop={50}
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
                {this.state.showDeletePopUp && (
                    <AlertMessage
                        visible={this.state.showDeletePopUp}
                        title="حذف زمان بندی"
                        message={
                            'آیا از حذف ' + 'این تراکنش' + ' مطمئن هستید؟'
                        }
                        onConfirm={() => {
                            this.setState({showDeletePopUp: false});
                            this.onConfirmTransactionDelete();
                        }}
                        onDismiss={() => this.setState({showDeletePopUp: false})}
                        confirmTitle="بله"
                        dismissTitle="خیر"
                    />
                )}
                <LoadingPopUp
                    visible={this.state.loading}
                    message={this.state.loadingMessage}
                />
            </View>
            </MobileLayout>
        );
    }

    onScrollFab = (event) => {
        const fabStatus = onScrollFab(event, this._listViewOffset);
        this._listViewOffset = fabStatus.currentOffset;
        if (fabStatus.isFabVisible !== this.state.isFabVisible) {
           // LayoutAnimation.configureNext(fabStatus.customLayoutLinear);
            this.setState({isFabVisible: fabStatus.isFabVisible});
        }
    };

    goToPayManual() {
        const item = {
            Title: 'افزایش موجودی',
            Price: 0,
        };
        if (this.user) {
            navigation.navigate('/ManualPay', {payInfo: Object.assign(item, {user: this.user})});
        } else {
            this.setState({nominateToDetailPay: item, showTransactionDialog: true});
        }
    }


    async showDetail(item) {
        if (item.hasOwnProperty('AnnounceDetailID')) {
            this.setState({loading: true, loadingMessage: 'در حال دریافت جزئیات ...'});
            await getForPaymentDetailQuery(this.user ? 20 : 14, item.AnnounceDetailID)
                .then(result => {
                    //navigation.navigate('/ManualPay', {payInfo: Object.assign(item, {user: this.user})})
                    item = Object.assign(item, {items: result});
                    console.warn('############### showDetail items: ', item);

                    this.setState({
                        nominateToDetailItem: item,
                        showDetail: true,
                    });
                })
                .catch(e => globalState.showToastCard())
                .finally(() => this.setState({loading: false}));
        } else {
            item = Object.assign(item, {items: item.Detail ? JSON.parse(item.Detail) : []});
            console.warn('############### showDetail Transaction item: ', item);
            this.setState({
                nominateTransactionDetailItem: item,
                showTransactionDetail: true,
            });
        }

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
            //Communications.phonecall(item.Mobile, true);
        }
    }

    checkValidation() {
        Keyboard.dismiss();
        if (!this.state.payTypeSelected) {
            this.setState({payTypeSelectedValidation: false});
            return;
        } else if (
            this.state.payTypeSelected.ID == 2 &&
            !this.state.accListSelected
        ) {
            //==
            this.setState({accListSelectedValidation: false});
            return;
        } else if (
            (this.state.payTypeSelected.ID == 2 && !this.state.cardNumber) ||
            (this.state.payTypeSelected.ID == 2 &&
                this.state.cardNumber.split('-').join('').length !== 16)
        ) {
            //==
            this.setState({cardNumberValidation: false});
            return;
        }

        this.payment(this.state.nominatedToPay);
    }

    getAdminPayQueryNeed() {
        getPaymentType()
            .then(result => this.setState({payType: result}))
            .catch(e => globalState.showToastCard());
        getBuildingAccountQuery()
            .then(result => this.setState({facilityList: result}))
            .catch(e => globalState.showToastCard());
    }

    async payment(newPrice, item) {

        Keyboard.dismiss();
        this.setState({loading: true, loadingMessage: 'در حال بررسی و ثبت ...', showTransactionDialog: false});

        const paymentInfo = {
            // AnnounceDetailID: item.AnnounceDetailID,
            BankGatewayID: 1,
            PaymentTypeID: 1,
            TotalPrice: newPrice,

            Description: null, //ToDo when get Descrioption!?
            RoleID: userStore.RoleID,
            BuildingID: userStore.BuildingID,
            UnitID: userStore.UnitID,

            CallerBuildingID: userStore.BuildingID,
            CallerUnitID: userStore.UnitID,
        };
        debugger
        await setPaymentQuery(paymentInfo)
            .then(result => {
                console.log(result);
                if(result.length==0){
                    showMassage("پیام","لیست خالی است","error")
                    return;
                }
                console.warn('&&&&&&&&&&&&&&&&&&&& setPaymentQuery result: ', result);
                persistStore.paymentId = result[0].PaymentID;
                global.WebBackScreenName='PayAnnounce';
                Communications.web(result[0].payRequestResult.urlPay + result[0].payRequestResult.tokenPay);
            })
            .catch(e => {
                globalState.showToastCard();
                // Toast.show(e.errMessage, Toast.LONG);
                console.warn('&&&&&&&&&&&&&&&&&&&& setPaymentQuery catch: ', e);
            })
            .finally(() => this.setState({loading: false}));
    }

    async getPayments() {
        Keyboard.dismiss();
        this.setState({loading: true, loadingMessage: 'در حال دریافت ...'});
        if (this.user) { //AdminPay
            await getForPaymentQuery(20, this.user.UserID, this.user.UnitID)
                .then(result => {
                    this.forPayment = result;
                    this.payableLength = result.filter(o => o.HasPaid == 0 || o.HasPaid == 2).length;
                    this.changeFilter(this.state.payState);
                })
                .catch(e => globalState.showToastCard())
                .finally(() => this.setState({loading: false}));
        } else {
            await getForPaymentQuery(14)
                .then(result => {
                    this.forPayment = result;
                    this.payableLength = result.filter(o => o.HasPaid == 0 || o.HasPaid == 2).length;
                    this.changeFilter(this.state.payState);
                })
                .catch(e => globalState.showToastCard())
                .finally(() => this.setState({loading: false}));
        } // userPay --> getWay
    }

    dismissAll() {
        this.setState({
            showOverlay: false,
            showEditPopUp: false,
            nominatedToDeleteItem: null,
            nominateToEditItem: null,
        });
    }
}

export default PayAnnounce;

const styles = StyleSheet.create({
    textInput: {
        paddingHorizontal: 4,
        borderWidth: 0.5,
        height: 120,
        borderRadius: 2,
        fontSize: 14,
        textAlignVertical: 'top',
        marginTop: 32,
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
    btnFilter: {
        flex: 1,
        minWidth: 100,
        marginEnd: 8,
        borderRadius: 8,
        borderColor: subTextItem,
        alignItems: 'center',
    },
    txtBtnFilter: {
        fontSize: 12,
        paddingVertical: 6,
    },
});
