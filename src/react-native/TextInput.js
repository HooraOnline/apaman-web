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
        fullWidth=true,
    } = props;

    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return(
        <View style={{flex:1,flexDirection:'row'}}>
            {numberOfLines>1?(
                    <textarea {...props}  style={style} className={classes.main}
                           ref={ref}
                           inputProps={{
                               maxLength: maxLength,
                               style: textInputStyle,
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
                )
                :(
                    <input {...props}  style={style} className={classes.main}

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






