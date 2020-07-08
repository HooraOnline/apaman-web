import React, {Component} from 'react';
import {Text, View,ScrollView,} from '../react-native';
import {black, gray, placeholderTextColor, primaryDark,} from '../constants/colors';
import {FloatingLabelTextInput} from '../components';
import accounting from 'accounting';
import {userStore} from '../stores';
import {mapNumbersToEnglish, Platform} from '../utils';
import {CardUnitInfo} from './index';
class UnitTableElement extends Component {
    render() {
        const {
            RowNO, UnitID, UnitNumber, Area, FloorNumber, Price, IsEmpty, OwnerName, TenantName, IsSame,
        } = this.props.item;

        return <View>
            <CardUnitInfo unitNumber={UnitNumber} floorNumber={FloorNumber} area={Area}>
                <View style={{
                    flexDirection: 'column',
                    paddingVertical: 18,
                    flex: 1,
                    width:'100%',
                    alignItems: 'center',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        flex: 1,
                        marginBottom: 19,
                        alignItems: 'center',
                        width:'100%',
                    }}>
                        <Text style={{
                            flex: 1,
                            marginRight: 7,
                            marginLeft: 0,
                            color: black,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            fontSize: 18,
                        }}>
                            {TenantName ? TenantName : OwnerName}
                        </Text>
                        <Text style={{
                            width:70,
                            marginRight: 7,
                            marginLeft: 0,
                            color: gray,
                            fontSize: 11,
                            textAlign: 'left',
                        }}>
                            {IsSame ? 'مالک‌و‌ساکن' : TenantName ? 'ساکن' : 'مالک'}
                        </Text>
                    </View>

                    <View  style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                        width:'100%',
                        justifyContent: 'center',


                    }}>
                        {this.props.writePermission &&
                        <FloatingLabelTextInput
                            ref="textInput"
                            multiline={false}
                            maxLength={13}
                            numberOfLines={1}
                            keyboardType='number-pad'
                            returnKeyType="done"
                            tintColor={gray}
                            textInputStyle={{
                                fontSize: 14,
                                fontFamily:'IRANYekanFaNum',
                                color: black,
                                //textAlign:Platform()=='ios'? 'left':'right',
                            }}
                            underlineSize={1}
                            placeholder={'مبلغ را وارد کنید.' }
                            style={{
                                flex: 5,
                            }}
                            onChangeText={text => {
                                if (text === '') {
                                    text = '0';
                                }
                                text = mapNumbersToEnglish(text);
                                this.props.onValueChanged({
                                    index: this.props.id,
                                    price: parseInt(accounting.unformat(text), 10),
                                });
                            }}
                            highlightColor={primaryDark}
                            value={this.props.price.Price ? accounting.formatMoney(this.props.price.Price, '', 0, ',') : ''}
                            unit={userStore.CurrencyID}
                        />
                        }

                        {/*{this.props.writePermission &&
                        <Text style={{
                            fontSize: 10,
                            color: black,
                            textAlign: 'left',
                            position: 'absolute',
                            end: 7,
                        }}>
                            {userStore.CurrencyID}
                        </Text>
                        }*/}

                        {!this.props.writePermission &&
                        <Text style={{flex: 0.5, marginLeft: 40, marginRight: 30, color: black, textAlign: 'center'}}>
                            {this.props.price.Price ? accounting.formatMoney(this.props.price.Price, '', 0, ',') : '0'} {userStore.CurrencyID}
                        </Text>
                        }

                    </View>
                </View>

            </CardUnitInfo>
        </View>;
    }
}

export default class UnitsTable extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let elements = this.props.items.map((item, index) => {
            return (
                <View style={{margin:16}}>
                    <UnitTableElement
                        key={index}
                        id={index}
                        item={item}
                        price={this.props.prices[index]}
                        color={this.props.redOnEmpty && this.props.prices[index].Price === '' ? 'red' : placeholderTextColor}
                        writePermission={this.props.writePermission}

                        onValueChanged={o => this.props.onPriceEdit(o)}
                    />
                </View>
            )
        });


        return <View style={{flex: 1, backgroundColor: '#f5f1f1', paddingBottom: 12}}>
            <ScrollView
                style={{
                    flex:1,
                    width: '100%',
                }}
            >
                {elements}
            </ScrollView>

        </View>
    }
}
