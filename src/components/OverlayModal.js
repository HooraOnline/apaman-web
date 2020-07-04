import React, {Component} from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from '../react-native';

import {overlayColor, primaryDark, transparent} from '../constants/colors';

export default class OverlayModal extends Component {
    render() {
        const {visible = false, onOutPress, catchTouch,onClose,style,dialogWidth=350} = this.props;
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onClose={onOutPress}
                presentationStyle="overFullScreen"
                onRequestClose={onOutPress}
                dialogWidth={dialogWidth}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: transparent,
                }}>
                    <TouchableWithoutFeedback
                        onPress={onOutPress}>
                        <View
                            style={{
                                flex: 1,

                                ...StyleSheet.absoluteFillObject,
                            }}
                            pointerEvents={catchTouch ? 'auto' : 'box-none'}
                        />
                    </TouchableWithoutFeedback>
                    <KeyboardAvoidingView
                        behavior='position'
                        enabled={Platform.OS === 'ios'}
                    >
                        <View
                            style={[{
                                backgroundColor: 'white',
                                borderRadius: 4,
                                //width:  global.width - (global.width / 5),
                                flexDirection: 'column',
                            },style]}
                        >
                            {this.props.children}
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        );
    }
}
