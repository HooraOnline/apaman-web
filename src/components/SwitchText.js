import React, {PureComponent} from 'react';
import {Animated, Platform, StyleSheet, Text, TouchableWithoutFeedback, View} from '../react-native';

import {borderSeparate, textDisabled} from '../constants/colors';


export default class SwitchText extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {

        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.width = this.myRef.current.clientWidth;

    }

    handleSwitch(value) {

        const {
            onValueChange,
            disabled,
        } = this.props;
        if (disabled) {
            return;
        }
        onValueChange && onValueChange(!value);
    };


    render() {
        const {value, activeText, inactiveText, backgroundActive, backgroundInactive, activeTextStyle, inactiveTextStyle, big} = this.props;

        const right=value==1?0:this.width/2;

        return (
            <div ref={this.myRef} style={{flex: 1}}>
                <TouchableWithoutFeedback
                    onPress={() => this.handleSwitch(value)}
                >
                    <View
                        style={
                            {
                                backgroundColor: backgroundInactive,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                minHeight: this.props.height ? this.props.height : 24,
                                borderWidth: 1,
                                borderColor: borderSeparate,
                                borderRadius: 100,
                                position: 'relative',
                            }}
                    >
                        <Animated.View
                            style={
                                {
                                    position: 'absolute',
                                    backgroundColor: backgroundActive,
                                    height: '100%',
                                    width: this.width/2,
                                    right: right,
                                    borderRadius: 100,
                                }}>
                        </Animated.View>
                        <View
                            style={[styles.item,{width:this.width/2,zIndex:2}]}>
                            <Text
                                style={[styles.text, {
                                    color: value ? 'white' : textDisabled,
                                    fontFamily: value?'IRANYekanFaNum-Bold':'IRANYekanFaNum',
                                    fontSize: big ? value ? 16 : 14 : 14,
                                }, activeTextStyle]}>{activeText}</Text>

                        </View>
                        <View
                            style={[styles.item,{width:this.width/2,zIndex:2}]}>
                            <Text
                                style={[styles.text, {
                                    color: value ? textDisabled : 'white',
                                    fontFamily: !value ? 'IRANYekanFaNum-Bold':'IRANYekanFaNum',
                                    fontSize: big ? !value ? 16 : 14 : 14,
                                }, inactiveTextStyle]}>{inactiveText}</Text>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </div>
        );
    }

}


const styles = StyleSheet.create({
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
});
