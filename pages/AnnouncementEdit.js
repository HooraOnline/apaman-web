import {FlatList, Image, Platform, StyleSheet, Text, View,ScrollView} from '../src/react-native';
import React, {PureComponent} from 'react';
import {
    AndroidBackButton,
    CardUnitInfo, Fab,
    LoadingPopUp,
    ShowDateTime,
    ShowPrice,
    SnakePopup,
    Toolbar
} from '../src/components';
import images from "../public/static/assets/images";
import {getAnnouncementWithId, getDetailCalculatePaymentQuery, getDetailPaymentQuery} from '../src/network/Queries';
import {
    bgScreen,
    bgSuccess, bgWhite,
    border,
    borderSeparate,
    drawerItem,
    fab,
    goldDark, gray,
    primaryDark,
    subTextItem,
    success, textDisabled,
    textItem,
    textRedLight,
} from '../src/constants/colors';

import IOSSwipeCard from "../src/components/IOSSwipeCard";
import {globalState, userStore} from "../src/stores";
import {showMassage, navigation, waitForData} from "../src/utils";
import accounting from "accounting";
import MobileLayout from "../src/components/layouts/MobileLayout";
export default class AnnouncementEdit extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingMessage: '',
            unitsAnnounce: [],
            paymentDetailList:[],
            showPaymentDetail:false,
        };
    }

    componentDidMount() {
        this.announcement = navigation.getParam('announcement', null);
        this.type = navigation.getParam('type', null);

        this.state.deadline = this.announcement.LastPayDate;
        this.state.description = this.announcement.Title;
        this.state.number = this.announcement.RecordNumber;
        waitForData(()=>this.getAnnouncementList());

    }

    async getAnnouncementList() {
        this.showLoading();
        await getAnnouncementWithId(this.announcement.ID)
            .then(result => {
                console.log('############',result);
                this.setState({unitsAnnounce: result})
            })
            .catch(e => this.setState({unitsAnnounce: []}))
            .finally(() => this.hideLoading());
    }
    async showDetails(item) {
        console.log(item);
        globalState.showBgLoading();
        await getDetailPaymentQuery(item.AnnounceDetailID, item.UserID, item.UnitID)
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


    showLoading(message = 'در حال دریافت اطلاعات...') {
        this.setState({loading: true, loadingMessage: message});
    }

    hideLoading() {
        this.setState({loading: false});
    }

    onBackPressed() {
        navigation.goBack();
    }

    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPressed.bind(this),
                content: images.ic_back,
            },
            title: 'جزئیات اعلان',
        };
        if(!this.announcement){
            return null;
        }

        return (
            <MobileLayout style={{padding:0}} title={'جزئیات اعلان'}
                          header={ <Toolbar customStyle={toolbarStyle}/>}
            >
                <View style={[styles.scene]}>

                    <AndroidBackButton
                        onPress={() => {
                            this.onBackPressed();
                            return true;
                        }}
                    />

                    <ScrollView>
                        <View
                            style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginTop: 24,
                            }}>
                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-ExtraBold'
                                            : 'IRANYekanExtraBold',
                                    fontSize: 16,
                                }}>
                                {this.announcement.Title}
                            </Text>

                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 12, color: drawerItem}}>
                                    {this.announcement.CostClassName}
                                </Text>
                                {this.announcement.CostClassID === '1' && (
                                    <Text style={{fontSize: 12, color: drawerItem}}>
                                        {this.announcement.IsDefault ? ' شارژ ' : ' هزینه '}
                                    </Text>
                                )}
                                {this.announcement.PeriodName && (
                                    <Text style={{fontSize: 12, color: drawerItem}}>
                                        - {this.announcement.PeriodName}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View
                            style={{
                                marginHorizontal: 24,
                                marginVertical: 16,
                                paddingBottom: 16,
                                borderBottomWidth: 2,
                                borderColor: borderSeparate,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{
                                        color: border,
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-Medium'
                                                : 'IRANYekanMedium',
                                    }}>
                                    مهلت پرداخت
                                </Text>
                                <ShowDateTime
                                    time={this.announcement.LastPayDate}
                                    fontSize={14}
                                    color={border}
                                    fontFamily={
                                        Platform.OS === 'ios'
                                            ? 'IRANYekanFaNum-Bold'
                                            : 'IRANYekanBold(FaNum)'
                                    }
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 8,
                                }}>
                                <Text
                                    style={{
                                        color: border,
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-Medium'
                                                : 'IRANYekanMedium',
                                    }}>
                                    جمع کل
                                </Text>
                                <ShowPrice
                                    color={border}
                                    fontSizeCurrency={12}
                                    price={this.state.unitsAnnounce.reduce(
                                        (a, b) => a + (parseInt(b.Price, 10) || 0),
                                        0,
                                    )}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 8,
                                }}>
                                <Text
                                    style={{
                                        color: border,
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-Medium'
                                                : 'IRANYekanMedium',
                                    }}>
                                    مانده
                                </Text>
                                <ShowPrice
                                    color={border}
                                    fontSizeCurrency={12}
                                    price={this.state.unitsAnnounce.reduce(
                                        (a, b) => a + (parseInt(b.Mandeh, 10) || 0),
                                        0,
                                    )}
                                />
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginHorizontal: 24,
                                marginTop: 10,
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
                            {this.state.unitsAnnounce.length > 0 && (
                                <Text
                                    style={{
                                        fontSize: 12,
                                    }}>
                                    {this.announcement.TotalPeopleNumberPaid}/
                                    {this.announcement.TotalPeopleNumber}
                                </Text>
                            )}
                        </View>

                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.unitsAnnounce}
                            extraData={this.state.unitsAnnounce}
                            renderItem={({item,index}) => (
                                <IOSSwipeCard
                                    //noPadding
                                    style={{marginHorizontal:24}}
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
                                            style={{marginHorizontal:-44,}}
                                            area={item.Area}>

                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    // paddingVertical: 18,
                                                    // alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    paddingEnd:30,
                                                }}>
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
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
                                                <View
                                                    style={{
                                                        alignItems: 'flex-end',
                                                        transform: [{translateY: item.HasPaid != 0 ? -14 : 0}],
                                                        justifyContent: item.HasPaid != 0 ? 'flex-start' : 'center',
                                                    }}>
                                                    {item.HasPaid != 0 && (
                                                        <View style={{flexDirection: 'row'}}>
                                                            {item.HasPaid == 2 && (
                                                                <ShowPrice
                                                                    priceStyle={{
                                                                        textDecorationLine: 'line-through',
                                                                        textDecorationStyle: 'double',
                                                                    }}
                                                                    style={{
                                                                        marginEnd: 8,
                                                                        marginTop: 8,
                                                                    }}
                                                                    color={textRedLight}
                                                                    colorCurrency={textRedLight}
                                                                    fontSize={12}
                                                                    price={item.Price}
                                                                />
                                                            )}
                                                            <View style={[styles.iconDode, {
                                                                backgroundColor: item.HasPaid == 1 ? bgSuccess : fab,
                                                                padding: item.HasPaid == 1 ? 0 : 5,
                                                                marginTop:-15,
                                                            }]}>
                                                                <Image
                                                                    source={item.HasPaid == 1 ? images.ic_done : images.ic_error}
                                                                    style={{
                                                                        tintColor: item.HasPaid == 1 ? 'white' : goldDark,
                                                                        width: item.HasPaid == 1 ? 24 : 16,
                                                                        height: item.HasPaid == 1 ? 24 : 16,
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    )}
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginEnd: 16,
                                                    }}>
                                                        <ShowPrice
                                                            colorCurrency={textItem}
                                                            fontSizeCurrency={12}
                                                            price={item.HasPaid === 2 ? item.Mandeh : item.Price}
                                                        />
                                                    </View>
                                                </View>
                                                {/*<View
                                            style={{
                                                alignItems: 'flex-end',
                                                transform: [{translateY: item.HasPaid ? -12 : 0}],
                                            }}>
                                            {item.HasPaid && (
                                                <View style={[styles.iconDode]}>
                                                    <Image
                                                        source={images.ic_done}
                                                        style={{tintColor: 'white', width: 24, height: 24}}
                                                    />
                                                </View>
                                            )}
                                            <ShowPrice
                                                price={item.Price}
                                                colorCurrency={textItem}
                                                fontSizeCurrency={12}
                                            />
                                        </View>*/}
                                            </View>
                                        </CardUnitInfo>



                                </IOSSwipeCard>

                            )}
                        />
                    </ScrollView>

                    <LoadingPopUp
                        visible={this.state.loading}
                        message={this.state.loadingMessage}
                    />
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
                </View>
            </MobileLayout>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
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
    iconDode: {
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        marginEnd: 16,
    },
});
