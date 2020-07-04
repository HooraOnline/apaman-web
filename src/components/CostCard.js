import React, {PureComponent} from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from '../react-native';

import {
    bgItem,
    bgSuccess,
    subTextItem,
    textItem,
    primaryDark,
    border,
    bgColor,
    bgScreen,
    transparent,
    /*borderRed*/
} from '../constants/colors';
import {userStore} from '../stores';

import images from "../../public/static/assets/images";

import accounting from 'accounting';


export default class CostCard extends PureComponent {
    constructor() {
        super();
        this.state = {
            costSelected: false,
        };
    }

    render() {
        const {
            CostTypeName,
            CostClassName,
            RoleName,
            TotalPrice,
            StartDate,
            EndDate,
            BillNumber,
            Icon,
            HasAnnounced,
            PeriodName,
            HasInstallment,
            ParentID
        } = this.props.cost;
        const {writeAccess} = this.props;
        return (
            <TouchableOpacity
                onPress={() => this.props.navigateToEdit(this.props.cost)}
                disabled={!writeAccess}
                style={{
                    flexDirection: 'row',
                    marginHorizontal: 24,
                    //marginVertical: 8,
                    justifyContent: 'center',
                    // alignItems: 'center',
                    paddingHorizontal: 16,
                    // paddingVertical: 8,
                    backgroundColor: bgItem,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                    borderRadius: 10,
                    borderWidth: ParentID ? 1 : 0,
                    borderColor: primaryDark //CHANGE TO BORDER RED
                }}
            >
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View
                        style={{
                            backgroundColor:Icon ? transparent : bgScreen,
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding:4,
                            borderRadius: 32,
                            alignSelf: 'center',
                        }}>
                        <Image
                            source={Icon ? images[Icon] : images.th_coin}
                            style={{
                                height:Icon ? 32 : 24,
                                // width:24,
                                aspectRatio: 1,
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <View style={{paddingHorizontal: 10}}>
                        <Text
                            style={{
                                marginTop: 10,
                                color: textItem,
                                fontSize: 16,
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                            }}
                        >{CostTypeName}</Text>
                        <Text
                            style={{
                                color: subTextItem,
                                fontSize: 12,
                                marginBottom: 10,
                            }}
                        >{CostClassName} </Text>
                    </View>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: (HasAnnounced || HasInstallment) ? 'flex-start' : 'center'}}>
                    {(HasAnnounced || HasInstallment) && (
                        <View style={{flexDirection: 'row'}}>
                            {HasAnnounced && (
                                <View
                                    style={{
                                        borderBottomStartRadius: 10,
                                        borderBottomEndRadius: 10,
                                        padding: 4,
                                        backgroundColor: bgSuccess,
                                        marginEnd: 4
                                    }}>
                                    <Image
                                        source={images.ic_broadcast}
                                        style={{
                                            tintColor: 'white',
                                            width: 16, height: 16
                                        }}
                                    />
                                </View>
                            )}
                            {HasInstallment && (
                                <View
                                    style={{
                                        borderBottomStartRadius: 10,
                                        borderBottomEndRadius: 10,
                                        padding: 4,
                                        backgroundColor: primaryDark,
                                    }}>
                                    <Image
                                        source={images.ic_Installments}
                                        style={{tintColor: 'white', width: 16, height: 16}}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                    <View style={{flexDirection: 'row'}}>
                        <Text
                            style={{
                                color: textItem,
                                fontSize: 18,
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                marginEnd: 4,
                            }}
                        >{accounting.formatMoney(TotalPrice, '', 0, ',')}</Text>
                        <Text
                            style={{
                                color: subTextItem,
                                fontSize: 12,
                                alignSelf: 'center',
                            }}
                        >{userStore.CurrencyID}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        );
    }

    onSelectCost() {
    }
}

