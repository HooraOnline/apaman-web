import React, {PureComponent} from 'react';
import {Image, Text, TouchableOpacity, View} from '../react-native';
import {fab, textItem} from '../constants/colors';
//import Fab from '@material-ui/core/Fab';
export default class Fab extends PureComponent {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    render() {
        const {bgColor = fab, onPress, icon, iconColor = textItem, title = null} = this.props;
        const animatedStyle = {
            transform: [{scale: this.animatedValue}],
        };
        return (

                <TouchableOpacity
                    onPress={onPress}
                    style={[animatedStyle, {
                        paddingVertical: 16,
                        paddingHorizontal: title ? 24 : 16,
                        backgroundColor: bgColor,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        borderRadius: 32,
                    }]}
                >
                    <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            source={icon}
                            style={{height: 24, width: 24, tintColor: iconColor}}
                        />
                        {title &&
                        <Text style={{
                            marginStart: 16,
                            fontSize: 16,
                            color: '#5D4A4A',
                            fontFamily: 'IRANYekan-ExtraBold',
                        }}>{title}</Text>
                        }
                    </View>
                </TouchableOpacity>

        );
    }
}
