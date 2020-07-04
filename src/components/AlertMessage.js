import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from '../react-native';

import {drawerItem, overlayColor, primaryDark} from '../constants/colors';
import Modal from '@material-ui/core/Modal';
import {Overlay} from './index';

export default class AlertMessage extends PureComponent {

    render() {
        const {
            visible,
            title,
            message,
            onConfirm,
            onDismiss,
            onFinish,
            confirmTitle,
            dismissTitle = 'انصراف',
            onModal = false,
            children,
            style
        } = this.props;


        if (onModal) {
            return (
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={visible}
                    onClose={onDismiss}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: overlayColor,
                        height:'100%'
                    }}>
                        <Content
                            title={title}
                            message={message}
                            onDismiss={onDismiss}
                            dismissTitle={dismissTitle}
                            onConfirm={onConfirm}
                            confirmTitle={confirmTitle}
                            children={children}
                            style={style}
                        />
                    </View>
                </Modal>
            );
        } else if (visible) {
            return (
                <Overlay catchTouch={true} onPress={onDismiss}>
                    <Content
                        title={title}
                        message={message}
                        onDismiss={onDismiss}
                        dismissTitle={dismissTitle}
                        onConfirm={onConfirm}
                        confirmTitle={confirmTitle}
                        children={children}
                    />

                </Overlay>
            );
        } else {
            return <View/>;
        }
    }
}

function Content({title, message, onDismiss, dismissTitle, onConfirm, confirmTitle,children,style}) {
    return (
        <View
            style={[{
                backgroundColor: 'white',
                paddingHorizontal: 24,
                // width: minWidth,
                minHeight: 77,
                borderRadius: 10,
                paddingTop: 21,
                paddingBottom: 13,
                marginHorizontal: 24,
            },style]}
        >
            {title? (
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={[styles.title]}>{title}</Text>
                </View>
            ):null}
            {message &&(
                <Text style={[styles.message]}>
                    {message}
                </Text>
            )}

            {
                children
            }
            <View style={{flexDirection: 'row', marginTop: 24, justifyContent: 'flex-end'}}>

                <TouchableOpacity style={[styles.btn]} onPress={onDismiss}>
                    <Text>{dismissTitle}</Text>
                </TouchableOpacity>
                {confirmTitle && (
                    <TouchableOpacity style={[styles.btn]} onPress={onConfirm}>
                        <Text style={{color: primaryDark}}>{confirmTitle}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    btn: {
        paddingVertical: 6,
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: 'IRANYekanFaNum-Bold',
        fontSize: 20,
        marginVertical: 8,
        alignSelf: 'flex-start',
    },
    message: {
        alignSelf: 'flex-start',
        marginTop: 16,
        fontSize: 16,
        color: drawerItem,
    }
});

