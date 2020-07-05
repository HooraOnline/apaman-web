import React, {useState} from 'react';
import {FlatList, IconApp, Image, Platform, ScrollView, Text, TouchableOpacity, View} from '../react-native';
import {
    CardMasked,
    CardRow,
    ImageComponent,
    LineCustom,
    Overlay,
    ShowDateTime,
    ShowPrice,
    TransactionCard,
} from './index';
import {bgSuccessLight, bgWhite, fab, overlayColor, subTextItem, success} from '../constants/colors';
import images from "../../public/static/assets/images";

export default function TransactionDetailDialog({visible, item, onDismiss}) {
    const [state, setState] = useState({showFullImage: false});
    if (visible) {
        if (state.showFullImage) {
            return (
                <Overlay
                    catchTouch={true}
                    onPress={() => setState({showFullImage: false})}
                    close={() => setState({showFullImage: false})}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <ImageComponent image={item.Image} iHeight={global.height - 100} iWidth={global.width - 50} resizeMode="contain"/>
                    </View>
                </Overlay>
            );
        } else {
            return (
                <Overlay catchTouch={true} onPress={onDismiss}>
                    <ScrollView style={{marginHorizontal: 24, flexGrow: 0}}>
                        <View
                            style={{
                                alignItems: 'center',
                                backgroundColor: 'white',
                                paddingBottom: 16,
                                borderTopStartRadius: 20,
                                borderTopEndRadius: 20,
                            }}>
                            <View style={{flexDirection: 'row',width:'100%'}}>
                                <TouchableOpacity
                                    style={{flex: 0.1, paddingStart: 16, paddingTop: 16}}
                                    onPress={onDismiss}>
                                    <IconApp
                                        source={'apic_close'}
                                        style={{
                                            tintColor: subTextItem,
                                            width: 24,
                                            height: 24
                                        }}
                                    />
                                </TouchableOpacity>

                                <View style={{flex: 1, marginTop: 16}}>
                                    <Text style={{
                                        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                        fontSize: 20,
                                        textAlign: 'center',
                                    }}>تراکنش</Text>
                                </View>
                                <View style={{flex: 0.1}}/>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    // justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 8,
                                    borderRadius: 20,
                                    backgroundColor: bgSuccessLight,
                                    paddingStart: 4,
                                    paddingEnd: 8,
                                    paddingVertical: 4,
                                }}>
                                <IconApp
                                    source={'apic_done_circle'}
                                    style={{
                                        height: 20,
                                        width: 20,
                                        tintColor: success,
                                        marginEnd: 4,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-Medium'
                                                : 'IRANYekanMedium',
                                        fontSize: 14,
                                        color: success,
                                    }}>  {'پرداخت شده'} . {item.PaymentTypeName}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{}}>
                            {/*Border Dashed & halfCircle*/}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: bgWhite,
                                    // marginVertical: 8,
                                }}>
                                <View style={{width:18,height:18,backgroundColor:'rgb(0,0,0,0.6)',borderRadius:9,marginStart:-9}}/>
                                <View style={{flex: 1, backgroundColor: 'white'}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            marginHorizontal: 7,
                                        }}>
                                        <LineCustom color={subTextItem}/>
                                    </View>
                                </View>
                                <View style={{width:18,height:18,backgroundColor:'rgb(0,0,0,0.6)',borderRadius:9,marginEnd:-9}}/>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    // alignItems: 'center',
                                    paddingBottom: 16,
                                    paddingHorizontal: 24,
                                    backgroundColor: 'white',
                                    borderBottomEndRadius: 20,
                                    borderBottomStartRadius: 20,
                                }}>
                                <CardRow
                                    title="مبلغ پرداخت"
                                    dataComponent={
                                        <ShowPrice
                                            price={item.TotalPrice}
                                        />
                                    }
                                />

                                <CardRow
                                    title="تاریخ پرداخت"
                                    dataComponent={
                                        <ShowDateTime
                                            time={item.PaidDatetime}
                                            showTime
                                            fontFamily={Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)'}
                                        />
                                    }
                                />
                                {item.PaymentTypeID == 2 && (
                                    <View>
                                        {!!item.CardNo && (
                                            <CardRow
                                                title="از کارت"
                                                dataComponent={
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                        }}>
                                                        <CardMasked cardNumber={item.CardNo}/>
                                                        <Image
                                                            source={images.ic_bankAnsar}
                                                            style={{
                                                                marginStart: 8,
                                                                height: 21,
                                                                width: 21,
                                                                // tintColor: fab,
                                                            }}
                                                        />
                                                    </View>
                                                }
                                            />
                                        )}
                                        <CardRow
                                            title="شناسه پرداخت"
                                            data={item.Numbers}
                                        />
                                        {item.Image && (
                                            <CardRow
                                                title="تصویر رسید کارت"
                                                noBorder={(!item.Description && item.items.length === 0)}
                                                dataComponent={
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setState({showFullImage: true});
                                                        }}
                                                        style={{flex: 1}}>
                                                        <ImageComponent image={item.Image}/>
                                                    </TouchableOpacity>
                                                }
                                            />
                                        )}
                                    </View>
                                )}

                                {!!item.ChequeName && (
                                    <View>
                                        <CardRow
                                            title="بانک"
                                            dataComponent={
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
                                                            fontSize: 12,
                                                        }}>
                                                        {item.BankName}
                                                    </Text>
                                                    <Image
                                                        source={images[item.Icon]}
                                                        style={{
                                                            marginStart: 8,
                                                            height: 21,
                                                            width: 21,
                                                            tintColor: fab,
                                                        }}
                                                    />
                                                </View>
                                            }
                                        />
                                        <CardRow
                                            title="صاحب حساب"
                                            data={item.ChequeName}
                                        />
                                        <CardRow
                                            title="شماره چک"
                                            data={item.Numbers}
                                        />
                                        <CardRow
                                            title="تاریخ چک"
                                            dataComponent={
                                                <ShowDateTime
                                                    time={item.ChequeDate}
                                                    fontFamily={Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)'}
                                                />
                                            }
                                        />
                                        {item.Image && (
                                            <CardRow
                                                title="تصویر چک"
                                                noBorder={(!item.Description && item.items.length === 0)}
                                                dataComponent={
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setState({showFullImage: true});
                                                        }}
                                                        style={{flex: 1}}>
                                                        <ImageComponent image={item.Image}/>
                                                    </TouchableOpacity>
                                                }
                                            />
                                        )}
                                    </View>
                                )}
                                {!!item.Description && (
                                    <View style={{flex: 1, alignItems: 'flex-start', padding: 8}}>
                                        <Text style={{fontSize: 12}}>
                                            {item.Description}
                                        </Text>
                                    </View>

                                )}

                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={item.items}
                                    renderItem={({item}) => (
                                        <TransactionCard
                                            isTransaction
                                            item={item}
                                        />
                                    )}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </Overlay>
            );
        }

    } else {
        return <View/>;
    }
}
