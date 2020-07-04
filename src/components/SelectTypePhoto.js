import React from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from '../react-native';

import {subTextItem, textItem} from '../constants/colors';
import {Overlay} from './index';
import images from "../../public/static/assets/images";

export default function SelectTypePhoto({
                                            visible,
                                            onCameraPress,
                                            onGalleryPress,
                                            onDismiss,
                                        }) {
    if (visible) {
        return (
            <Overlay catchTouch={true} onPress={onDismiss}>
                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        paddingVertical: 12,
                        marginHorizontal: 40,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderEndWidth: 1,
                                borderEndColor: subTextItem,
                            }}
                            onPress={onCameraPress}>
                            <Image
                                source={images.ic_camera}
                                style={{
                                    tintColor: textItem,
                                    width: 24,
                                    height: 24,
                                    marginEnd: 8,
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-Medium'
                                            : 'IRANYekanMedium',
                                    paddingVertical: 8,
                                }}>
                                با دوربین
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={onGalleryPress}>
                            <Image
                                source={images.ic_gallery}
                                style={{
                                    tintColor: textItem,
                                    width: 24,
                                    height: 24,
                                    marginEnd: 8,
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-Medium'
                                            : 'IRANYekanMedium',
                                    paddingVertical: 8,
                                }}>
                                از گالری
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        );
    } else {
        return <View/>;
    }
}
