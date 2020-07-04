import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,

    Modal} from '../react-native';

import {
    bgScreen,
    bgSuccess,
    bgSuccessLight, bgWhite, borderLight,
    goldDark,
    goldLight,
    overlayColor,
    primaryDark,
    subTextItem,
    success,
} from '../constants/colors';
import {CardMasked,
    CardRow,
    LineCustom,
    ShowDateTime,
    ShowPrice,
    Overlay
} from './index';

import images from "public/static/assets/images";


export default function DetailDialog({width,visible, title, subTitle, price, remaining, status, statusText, items, footer, onDismiss, onConfirm,style}) {
    if (visible) {
        return (
            <Overlay
                animationType="fade"
                transparent={true}
                visible={visible}
                presentationStyle="overFullScreen"
                onPress={onDismiss}
                dialogWidth={width}
            >
                <View

                   >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <View style={[{ marginBottom: status === 2 ? 81 : 0},style]}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={items}
                                ListHeaderComponent={
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            backgroundColor: 'white',
                                            paddingBottom: 16,
                                            borderTopStartRadius: 20,
                                            borderTopEndRadius: 20,
                                        }}>
                                        <View style={{width:'100%',flexDirection: 'row'}}>
                                            <TouchableOpacity
                                                style={{flex: 0.1, paddingStart: 16, paddingTop: 16}}
                                                onPress={onDismiss}>
                                                <Image
                                                    source={images.ic_close}
                                                    style={{
                                                        //tintColor: subTextItem,
                                                        width: 24,
                                                        height: 24
                                                    }}
                                                />
                                            </TouchableOpacity>

                                            <View style={{flex: 1, marginTop: 16}}>
                                                <Text style={[styles.title]}>{title}</Text>
                                            </View>
                                            <View style={{flex: 0.1}}/>
                                        </View>

                                        <Text style={[styles.subTitle]}>{subTitle}</Text>
                                        <ShowPrice
                                            fontSize={18}
                                            fontSizeCurrency={12}
                                            price={price}
                                        />
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                // justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop: 8,
                                                borderRadius: 20,
                                                backgroundColor: status === 1 ? bgSuccessLight : goldLight,
                                                paddingStart: 4,
                                                paddingEnd: 8,
                                                paddingVertical: 4,
                                            }}>
                                            <Image
                                                source={status === 1 ? images.ic_circleDone : images.ic_error}
                                                style={{
                                                    height: 20,
                                                    width: 20,
                                                    //tintColor: status === 1 ? success : goldDark,
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
                                                    color: status === 1 ? success : goldDark,
                                                }}>
                                                {statusText}
                                            </Text>
                                        </View>
                                    </View>
                                }
                                style={{
                                    flexGrow: 0,
                                    marginHorizontal: 24,
                                }}
                                renderItem={({item, index}) => (
                                    <View style={{}}>
                                        {/*Border Dashed & halfCircle*/}
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                 backgroundColor: bgWhite,
                                                // marginVertical: 8,
                                            }}>
                                           {/* <Image source={images.halfCircle} style={{height: 18, width: 10,tintColor:overlayColor}}/>*/}
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

                                           {/* <Image
                                                source={images.halfCircle}
                                                style={{transform: [{rotate: '180deg'}], height: 18, width: 10,tintColor:borderLight}}
                                            />*/}
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                // alignItems: 'center',
                                                paddingBottom: 16,
                                                paddingHorizontal: 24,
                                                backgroundColor: 'white',
                                                borderBottomEndRadius: items.length-1 === index ? 20 : 0,
                                                borderBottomStartRadius: items.length-1 === index ? 20 : 0
                                            }}>
                                            <CardRow
                                                title="نوع پرداخت"
                                                data={item.PaymentTypeName}
                                            />
                                            {!!item.TotalPrice && (
                                                <CardRow
                                                    title="مبلغ پرداخت"
                                                    dataComponent={
                                                        <ShowPrice
                                                            price={item.TotalPrice}
                                                        />
                                                    }
                                                />
                                            )}
                                            {!!item.LastPayDate && (
                                                <CardRow
                                                    title="مهلت پرداخت"
                                                    dataComponent={
                                                        <ShowDateTime
                                                            time={item.LastPayDate}
                                                            fontFamily={Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)'}
                                                        />
                                                    }
                                                />
                                            )}
                                            {!!item.PaidDatetime && (
                                                <CardRow
                                                    title="تاریخ پرداخت"
                                                    noBorder={item.PaymentTypeID == 3 && !item.Description}
                                                    dataComponent={
                                                        <ShowDateTime
                                                            time={item.PaidDatetime}
                                                            showTime
                                                            fontFamily={Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)'}
                                                        />
                                                    }
                                                />
                                            )}
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
                                            {!!item.AccountName && item.PaymentTypeID == 2 && (
                                                <CardRow
                                                    title="به حساب"
                                                    dataComponent={
                                                        <View style={{flexDirection: 'row'}}>
                                                            <Text
                                                                style={{}}>{item.AccountName}</Text>
                                                            <Image
                                                                source={images[item.Icon]}
                                                                style={{
                                                                    marginStart: 8,
                                                                    height: 24,
                                                                    width: 24,
                                                                }}
                                                            />
                                                        </View>
                                                    }
                                                />

                                            )}
                                            {!!item.BankReference && (
                                                <CardRow
                                                    title="شماره پیگیری"
                                                    noBorder={!item.Description}
                                                    data={item.BankReference}
                                                />
                                            )}
                                            {!!item.ChequeNo && (
                                                <CardRow
                                                    title="شماره چک"
                                                    data={item.ChequeNo}
                                                />
                                            )}
                                            {!!item.ChequeDate && (
                                                <CardRow
                                                    title="تاریخ چک"
                                                    noBorder={!item.Description}
                                                    dataComponent={
                                                        <ShowDateTime
                                                            time={item.ChequeDate}
                                                            fontFamily={Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)'}
                                                        />
                                                    }
                                                />
                                            )}
                                            {!!item.Description && (
                                                <Text style={{fontSize: 12, textAlign: 'center'}}>
                                                    {item.Description}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                    {(onConfirm && status === 2) && (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                start: 0,
                                end: 0,
                                flexDirection: 'row',
                                backgroundColor: 'white',
                                borderTopStartRadius: 20,
                                borderTopEndRadius: 20,
                                padding: 16,
                                marginTop: 4
                            }}>
                            <ShowPrice
                                style={{flex: 1}}
                                fontSize={20}
                                fontSizeCurrency={12}
                                price={remaining}
                            />
                            <TouchableOpacity
                                style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: bgSuccess,
                                    borderRadius: 10,
                                    marginTop: 8,
                                }}
                                onPress={onConfirm}>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekanFaNum-Bold'
                                                : 'IRANYekanBold(FaNum)',
                                        fontSize: 16,
                                        marginStart: 24,
                                        marginEnd: 8,
                                    }}>
                                    پرداخت
                                </Text>
                                <Image
                                    source={images.ic_left}
                                    style={{
                                        tintColor: 'white',
                                        width: 24,
                                        height: 24,
                                        marginEnd: 8,
                                        marginVertical: 8,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Overlay>
        );
    } else {
        return <View/>;
    }
}

const styles = StyleSheet.create({
    btn: {
        paddingVertical: 6,
        paddingHorizontal: 20,
    },
    title: {
        fontFamily:
            Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        fontSize: 20,
        textAlign: 'center',
    },
    costTitle: {
        fontFamily:
            Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',
        fontSize: 18,
    },
    costPrice: {
        fontFamily:
            Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        fontSize: 32,
        color: primaryDark,
        marginEnd: 4,
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 14,
        color: subTextItem,
    },
    footer: {
        flexDirection: 'row',
        backgroundColor: bgScreen,
        // overflow: 'hidden',
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
        paddingHorizontal: 24,
    },
});
