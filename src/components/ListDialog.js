import React, {PureComponent} from 'react';
import {FlatList, Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from '../react-native';

import {borderSeparate} from '../constants/colors';
import {Overlay} from './index';
import Dialog from "@material-ui/core/Dialog";


export default class ListDialog extends PureComponent {

    render() {
        const {
            visible,
            title,
            items,
            itemComponent,
            fieldItem,
            onDismiss,
        } = this.props;

        return (
            <Modal
                visible={visible}
                onClose={onDismiss}
            >

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            marginHorizontal: 24,
                            width:'95%',
                            paddingVertical: 16,
                            borderRadius: 10,
                            marginTop:70,
                            maxWidth:300,

                        }}>

                        <View
                            style={{
                                alignItems: 'center',
                                marginBottom: 14,
                            }}>
                            <Text style={[styles.title]}>{title}</Text>
                        </View>
                        {/*<View
                            style={{flex: 1, justifyContent: 'center', marginHorizontal: 14}}>
                            <LineCustom
                                color={subTextItem}
                            />
                        </View>*/}
                        <FlatList
                            style={{flexGrow: 0}}
                            keyExtractor={(item, index) => index.toString()}
                            data={items}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    onPress={this.select.bind(this, item)}
                                    style={{
                                        borderBottomWidth: 1,
                                        borderColor: borderSeparate,
                                        marginHorizontal: 24,
                                    }}>
                                    {itemComponent ? (
                                        itemComponent(item)
                                    ) : (
                                        <View>
                                            <Text style={[styles.text]}>{fieldItem ? item[fieldItem] : item.Name}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                        />

                    </View>

            </Modal>
        );
    }

    select(item) {
        this.props.onValueChange(item);
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
    },
    text: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        paddingVertical: 14,
        textAlign: 'center'
    },
});

