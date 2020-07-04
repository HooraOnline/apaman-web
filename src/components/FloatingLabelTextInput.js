import React, {PureComponent} from 'react';
import {bool, number, string} from 'prop-types';
import {border, borderLight, primaryDark} from '../constants/colors';

import {Text, View, Animated, StyleSheet, Image, TouchableOpacity} from "../react-native";
import {Input ,FormControl } from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";

import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import images from "../../public/static/assets/images";
import Platform from "../react-native/Platform";


class Underline extends PureComponent {
    static propTypes = {
        underlineEnabled: bool,
        underlineAniDur: number,
    };

    static defaultProps = {
        underlineEnabled: true,
        underlineAniDur: 200,
    };

    constructor(props) {
        super(props);
        this.animatedLeft = new Animated.Value(0);
        this.animatedLineLength = new Animated.Value(0);
        this.state = {
            lineLength: 0,
        };
    }

    // update the length of stretched underline
    updateLineLength(lineLength, cb) {
        this.setState({lineLength}, cb);
    }

    // stretch the line, from center
    aniStretchUnderline() {
        this.animatedLeft.setValue(this.state.lineLength / 2);
        Animated.parallel([
            Animated.timing(this.animatedLeft, {
                toValue: 0,
                duration: this.props.underlineAniDur,
            }),
            Animated.timing(this.animatedLineLength, {
                toValue: this.state.lineLength,
                duration: this.props.underlineAniDur,
            }),
        ]).start();
    }

    // collapse the the line to a single point at center
    aniShrinkUnderline() {
        if (!this.props.underlineEnabled) {
            return [];
        }

        Animated.parallel([
            Animated.timing(this.animatedLeft, {
                toValue: this.state.lineLength / 2,
                duration: this.props.underlineAniDur,
            }),
            Animated.timing(this.animatedLineLength, {
                toValue: 0,
                duration: this.props.underlineAniDur,
            }),
        ]).start();
    }

    // the colorful forefront line, animation enabled
    renderUnderline() {
        return this.props.underlineEnabled && (
            <Animated.View
                style={{
                    //position: 'absolute',
                    backgroundColor: this.props.highlightColor ,
                    height: this.props.underlineSize,
                    left: 0,//this.animatedLeft,
                    width:'100%',// this.animatedLineLength,

                }}
            >

            </Animated.View>);
    }

    render() {
        return (
            <View pointerEvents="none"
                  style={{
                      // top: -this.props.underlineSize,
                      marginTop:0,
                      height: this.props.underlineSize,
                  }}
            >
                <View  // the default silver border
                    style={{
                        //position: 'absolute',
                        backgroundColor: this.props.tintColor,
                        height: this.props.underlineSize,
                        width:'100%',// this.state.lineLength,
                    }}
                />
                {this.renderUnderline()}
            </View>
        );
    }
}

export default class FloatingLabelTextInput extends PureComponent {
    static propTypes = {
        value: string.isRequired,
        underlineSize: number,
        tintColor: string,
        labelColor: string,

    };

    static defaultProps = {
        underlineSize: 1,
        tintColor: primaryDark,
        labelColor: border,
    };

    constructor(props) {
        super(props);
        this.position = new Animated.Value(props.value ? 1 : 0);
        this.fontSize = 10;
        this.state = {
            isFieldActive: false,
            isFocused: false,
        };
    }

    componentDidMount() {
        this.fontSize = this.props.textInputStyle && this.props.textInputStyle.fontSize ? this.props.textInputStyle.fontSize : 14;
        this.props.refInput ? this.props.refInput(this.refs.txtInput) : {};
        //
        // this._handleFocus();
        // this._handleBlur()
    }

    componentDidUpdate() {
        if (!this.state.isFieldActive) {
            this._handleAnimate(!!this.props.value);
        }
    }

    _handleAnimate(state) {
        Animated.timing(this.position, {
            toValue: state ? 1 : 0,
            duration: 150,
        }).start();
    }

    _handleFocus = () => {
        this.refs.underline.aniStretchUnderline();
        this.setState({isFocused: true});
        if (!this.state.isFieldActive) {
            this.setState({isFieldActive: true});
            this._handleAnimate(true);
        }
        this.props.onFocus && this.props.onFocus();
    };

    _handleBlur = () => {
        this.refs.underline.aniShrinkUnderline();
        this.setState({isFocused: false});
        if (this.state.isFieldActive && !this.props.value) {
            this.setState({isFieldActive: false});
            this._handleAnimate(false);
        }
    };

    _returnAnimatedTitleStyles = () => {
        return {
            bottom: this.position.interpolate({
                inputRange: [0, 1],
                outputRange: [this.props.labelMarginButtom || 6, this.fontSize + 15],
            }),
            fontSize: this.state.isFieldActive || !!this.props.value ? this.props.labelActiveFontSize || 12 : this.props.labelFontSize || 14,
            color: this.state.isFocused ? this.props.highlightColor : this.props.labelColor,
        };
    };

    render() {
        const {style,autoFocus, textInputStyle, placeholder,keyboardType, tintColor, highlightColor, underlineSize, underlineEnabled, floatingLabelAniDuration, floatingLabelEnable, type,maxLength=1000000,numberOfLines,onChangeText,adornment} = this.props;
        let props=this.props;
        let pKeyboardType=type || 'string';
        if(keyboardType=='number-pad') pKeyboardType='number'
        return (
            <View style={{flexDirection:'row', justifyContent: 'flex-end',flex:1}}>
                {
                    this.props.label &&
                    <Text style={this.props.laberStyle}>{this.props.label}</Text>
                }

                <View style={[{flex:1},]}>

                    <FormControl  style={style} >
                        {floatingLabelEnable &&(
                            <InputLabel style={{}} htmlFor="standard-adornment-password">{placeholder}</InputLabel>
                        )}
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Input
                                {...props}
                                endAdornment={
                                    <InputAdornment position="end"  >
                                        {this.props.Adornment}
                                    </InputAdornment>
                                }

                                style={{}}
                                // className={classes.main}
                                fullWidth={true}


                                inputProps={{
                                    maxLength: maxLength,
                                    style: textInputStyle
                                }}
                                type={pKeyboardType}
                                //value={value}
                                autoFocus={autoFocus}
                                rows={numberOfLines}
                                //multiline={multiline}
                                //label={label}
                                disableUnderline={true}
                                //returnKeyType={returnKeyType}
                                floatingLabelEnable={floatingLabelEnable}
                                highlightColor={highlightColor}
                                underlineSize={underlineSize}
                                onChange={event => {
                                    let text=event.target.value;
                                    if(text && text.length>maxLength){
                                        return;
                                    }
                                    onChangeText && onChangeText(text,event)
                                }}


                                ref='txtInput'
                                {...this.props}
                                placeholder={floatingLabelEnable ? '' : placeholder}
                                underlineColorAndroid='transparent'
                                //onFocus={this._handleFocus}
                                onBlur={this._handleBlur}
                                onLayout={event => {
                                    let {x, y, width, height} = event.nativeEvent.layout;
                                    this.refs.underline.updateLineLength(width);
                                }}
                            />
                            {adornment?adornment: <Text style={{
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                fontSize: 12,
                                color: border,
                                marginStart: 4,
                                alignSelf: 'center',
                            }}>{this.props.unit}</Text>}
                        </View>


                    </FormControl>

                    <Underline
                        ref="underline"
                        underlineEnabled={underlineEnabled}
                        underlineSize={underlineSize}
                        underlineAniDur={floatingLabelAniDuration}
                        highlightColor={highlightColor}
                        tintColor={tintColor}
                    />

                </View>
                <style jsx global>{`
                     .MuiInput-underline:before{
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom:1px solid ${borderLight};
                    position: absolute;
                    transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                    pointer-events: none;
                }
                .MuiInput-underline:after{
                   // left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom:0px solid;
                    position: absolute;
                    transform: scaleX(0);
                    transition: transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
                    pointer-events: none
                }
            `}</style>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        // flex: 1,

    },
    textInput: {},
    labelStyles: {
        position: 'absolute',
        left: 3,
    },
});





/*

import React from 'react';
import {borderLight} from "../constants/colors";
import {Text, View} from "../react-native";
import {TextField} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
export default function TextInput(props) {
    let {
        style={},
        ref,
        value,
        autoFocus,
        placeholder,
        placeholderTextColor,
        numberOfLines,
        label,
        multiline,
        onChangeText,
        maxLength,
        floatingLabelEnable,
        returnKeyType,
        textInputStyle,
        underlineSize,
        highlightColor,
        unit,
        unitStyle={fontSize:12,color:borderLight}
    } = props;
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return(
        <View style={{flex:1,flexDirection:'row'}}>
            <TextField {...props}  style={style} className={classes.main}
                       style={style}
                       ref={ref}
                       inputProps={{
                           maxLength: maxLength,
                           style: textInputStyle
                       }}

                       value={value}
                       autoFocus={autoFocus}
                       placeholder={placeholder}
                       rows={numberOfLines}
                       multiline={multiline}
                       label={label}
                       disableUnderline={true}
                       returnKeyType={returnKeyType}
                       floatingLabelEnable={floatingLabelEnable}
                       highlightColor={highlightColor}
                       underlineSize={underlineSize}
                       onChange={event => {
                           let text=event.target.value;
                           onChangeText && onChangeText(text,event)
                       }}
            />
            {
                unit &&(
                    /!* <Text style={unitStyle}>{unit}</Text>*!/
                    <Text style={[{
                        fontSize: 10,
                        color: borderLight,
                        textAlign: 'left',
                        position: 'absolute',
                        left: 30,
                    },unitStyle]}>
                        {unit}
                    </Text>

                )
            }
            <style jsx global>{`
                     .MuiInput-underline:before{
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom:1px solid ${borderLight};
                    position: absolute;
                    transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                    pointer-events: none;
                }
                .MuiInput-underline:after{
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom:0px solid;
                    position: absolute;
                    transform: scaleX(0);
                    transition: transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
                    pointer-events: none
                }
            `}</style>
        </View>
    );
}
const styles = {
    main: {

    },
}



*/
