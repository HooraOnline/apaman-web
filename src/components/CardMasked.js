import React from 'react';
import {Platform, Text, View} from '../react-native';
import {cardMask} from '../utils'

export default function CardMasked({cardNumber}) {
    if (cardNumber.length === 19) {
        return (
            <View style={{flexDirection: 'row'}}>
                <Text
                    style={{
                        fontFamily:
                            Platform.OS === 'ios'
                                ? 'IRANYekanFaNum-Bold'
                                : 'IRANYekanBold(FaNum)',
                        fontSize: 12,
                    }}>{cardMask(cardNumber)}</Text>
            </View>
        );
    } else {
        return (
            <Text
                style={{
                    fontFamily:
                        Platform.OS === 'ios'
                            ? 'IRANYekanFaNum-Bold'
                            : 'IRANYekanBold(FaNum)',
                    fontSize: 12,
                }}>{cardNumber}</Text>
        );
    }

}
