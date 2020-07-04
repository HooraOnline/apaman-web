import React from 'react';
import {Platform, Text, View} from '../react-native';
import {textItem} from '../constants/colors';

const jMoment = require('moment-jalaali');
//import fa from "moment/src/locale/fa";
//jMoment.locale("fa", fa);
jMoment.loadPersian();
jMoment.loadPersian({dialect: 'persian-modern'})
jMoment.loadPersian({usePersianDigits: true})
export default function ShowDateTime({
                                         time = new Date(),
                                         showTime = false,
                                         color = textItem,
                                         fontSize = 12,
                                         fontFamily = Platform.OS === 'ios'
                                             ? 'IRANYekanFaNum'
                                             : 'IRANYekanRegular(FaNum)',
                                         dotSize = 4,
                                         format='jYYYY/jM/jD'
                                     }) {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {showTime && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                        style={{
                            color: color,
                            fontSize: fontSize,
                            fontFamily: fontFamily,
                        }}>

                        {jMoment.utc(time ? time : new Date()).format('HH:mm')}
                    </Text>

                    <View
                        style={{
                            width: dotSize,
                            height: dotSize,
                            borderRadius: 2,
                            backgroundColor: color,
                            marginHorizontal: 8,
                            marginTop: 8,
                        }}
                    />
                </View>
            )}
            <Text
                style={{
                    color: color,
                    fontSize: fontSize,
                    fontFamily: fontFamily,
                }}>
                {jMoment(time ? time : new Date()).format(format)}
            </Text>
        </View>
    );
}
