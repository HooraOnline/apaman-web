import React, {PureComponent} from 'react';
import {FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from '../react-native';

import {borderSeparate} from '../constants/colors';
import {Overlay} from './index';


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

        if (visible) {
            return (
                <Overlay catchTouch onPress={onDismiss}>
                    <View
                        style={{
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            marginHorizontal: 24,
                            paddingVertical: 16,
                            borderRadius: 10,
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
                </Overlay>
            );
        } else {
            return <View/>;
        }
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

