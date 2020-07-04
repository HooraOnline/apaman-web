import React, {Component} from 'react';
import {Image, View} from '../react-native';

import images from "../../public/static/assets/images";
import {placeholderTextColor, primaryDark} from '../constants/colors';
import FloatingLabelTextInput from './FloatingLabelTextInput';


export default class SearchBox extends Component {
    constructor() {
        super();
        this.state = {
            searchText: '',
        };
    }

    render() {
        const {placeHolder} = this.props;
        return (

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
            >
                <Image
                    source={images.searchIcon}
                    style={{height: 17, width: 17, tintColor: primaryDark, marginStart: 7, marginEnd: 7}}
                />
                <FloatingLabelTextInput
                    ref="textInput"
                    multiline={false}
                    keyboardType="default"
                    returnKeyType="done"
                    floatingLabelEnable={false}
                    tintColor={placeholderTextColor}
                    textInputStyle={{
                        fontSize: 14,
                        color: 'black',
                        flexGrow: 1,
                        textAlign: 'right',
                    }}
                    underlineSize={1}
                    style={{flex: 1, marginEnd: 7, marginStart: 7}}
                    placeholder={placeHolder}
                    onChangeText={text => this.setState({searchText: text})}
                    highlightColor={primaryDark}
                    value={this.state.searchText}
                    onSubmitEditing={() => Keyboard.dismiss()}
                />
            </View>
        );
    }
}
