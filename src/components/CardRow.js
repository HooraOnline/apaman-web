import React, {PureComponent} from 'react';
import {Image, Platform, Text, View} from '../react-native';
import {borderSeparate, primaryDark, subTextItem} from '../constants/colors';

export default class CardRow extends PureComponent {
    render() {
        const {style,titleStyle,valueStyle,icon, title, data, dataComponent, noBorder = false} = this.props;
        return (
            <View
                style={[{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    paddingBottom: noBorder ? 0 : 8,
                    borderBottomWidth: noBorder ? 0 : 1,
                    borderBottomColor: borderSeparate,
                },style]}>
                <View style={{flexDirection: 'row'}}>
                    {icon && (
                        <Image
                            source={icon}
                            style={{height: 17, width: 17, tintColor: primaryDark}}
                        />
                    )}

                    <Text
                        style={[{
                            color: subTextItem,
                            fontFamily:
                                Platform.OS === 'ios'
                                    ? 'IRANYekanFaNum-Bold'
                                    : 'IRANYekanBold(FaNum)',
                            fontSize: 12,
                        },titleStyle]}>
                        {title}
                    </Text>
                </View>

                {(dataComponent || data) && (
                    <View>
                        {dataComponent ? (
                            dataComponent
                        ) : (
                            <Text style={valueStyle}>{data ? data : ''}</Text>
                        )}
                    </View>
                )}
            </View>
        );
    }
}
