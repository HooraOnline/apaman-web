import React, {PureComponent} from 'react';
import {Image, StyleSheet, TouchableOpacity, View,TouchableWithoutFeedback} from '../react-native';
import { overlayColor, primaryDark} from '../constants/colors';
import images from "public/static/assets/images";


export default class Overlay extends PureComponent {
    render() {
        const {onPress, catchTouch, close = null, fill = {...StyleSheet.absoluteFillObject}} = this.props;
        return (
            <TouchableOpacity
                // pointerEvents="box-none"
                onPress={onPress}
                style={[fill, {
                    backgroundColor: 'rgb(0,0,0,0.6)',
                    flex: 1,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                    position:'absolute',
                    top:0,
                    bottom:0,
                    left:0,
                    right:0,
                }]}>

                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    <TouchableWithoutFeedback >
                        {close && (
                            <TouchableOpacity
                                onPress={close}
                                style={{flex: 1,position: 'absolute', top: 8, elevation: 1, padding: 16, backgroundColor: 'rgba(255,255,255,.3)', borderRadius: 50}}
                            >
                                <Image
                                    source={images.ic_close}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        //tintColor: 'white',
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                        <View
                            style={{
                                flex: 1,
                                ...StyleSheet.absoluteFillObject,
                            }}
                            pointerEvents={catchTouch ? 'auto' : 'box-none'}
                        />
                        <View style={{minWidth: width}}>{this.props.children}</View>
                    </TouchableWithoutFeedback>

                </View>

            </TouchableOpacity>


        );
    }
}
