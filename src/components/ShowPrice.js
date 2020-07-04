import React from 'react';
import {Platform, Text, View} from '../react-native';
import {border, textItem} from '../constants/colors';
import accounting from 'accounting';
import {userStore} from '../stores';

export default function ShowPrice({
                                      price = 0,
                                      showCurrency = true,
                                      color = textItem,
                                      colorCurrency = border,
                                      fontSizeCurrency = 10,
                                      fontFamilyCurrency = Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                      fontSize = 14,
                                      fontFamily = Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                      isColumn = false,
                                      style,
                                      priceStyle,
                                  }) {
    return (
        <View
            style={[style, {
                flexDirection: isColumn ? 'column' : 'row',
                alignItems: 'center',
            }]}>
            <Text
                style={[priceStyle, {
                    fontFamily: fontFamily,
                    color: color,
                    fontSize: fontSize,
                    writingDirection: 'ltr',
                }]}>
                {accounting.formatMoney(price, '', 0, ',')}
            </Text>
            {showCurrency && (
                <Text
                    style={{
                        fontFamily: fontFamilyCurrency,
                        fontSize: fontSizeCurrency,
                        color: colorCurrency,
                        marginStart: 4,
                        alignSelf: isColumn ? 'flex-end' : 'center',
                    }}>
                    {userStore.CurrencyID}
                </Text>
            )}
        </View>
    );
}
