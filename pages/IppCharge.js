import {
    CheckBox, Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity, TouchableWithoutFeedback,
    View,
} from '../src/react-native';
import React, {Component, PureComponent} from 'react';
import {AndroidBackButton, LoadingPopUp, SnakePopup, Toolbar,FloatingLabelTextInput} from '../src/components';
import {globalState, userStore} from '../src/stores';
import images from '../public/static/assets/images';
import {getAllUnits, setDefaultCharge} from '../src/network/Queries';
import UnitsTable from '../src/components/UnitsTable';
import {bgScreen, overlayColor, primaryDark, success} from '../src/constants/colors';
import {permissionId} from '../src/constants/values';
import {mapNumbersToEnglish, navigation, Platform, showMassage, waitForData} from '../src/utils';
import MobileLayout from "../src/components/layouts/MobileLayout";

import accounting from 'accounting';
import Router from "next/router";
import ToastCard from "../src/components/ToastCard";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";


class AreaElement extends PureComponent {
    render() {
        return <View style={{flex: 1, flexDirection: 'row', paddingBottom:40, marginHorizontal: 16}}>
            <View style={{
                flexDirection: 'row',
                width: 100,
                alignItems: 'center',
                justifyContent: 'center',


            }}>
                <Text style={{fontSize: 12, color: '#8A7E7E'}}>
                    واحدهای {this.props.Area} متری
                </Text>
            </View>

            <FloatingLabelTextInput
                ref="textInput"
                multiline={false}
                maxLength={14}
                numberOfLines={1}
                keyboardType='number-pad'
                returnKeyType="done"
                tintColor={this.props.color}
                textInputStyle={{
                    fontSize: 12,
                    fontFamily:  'IRANYekanFaNum',
                    color: 'black',
                    textAlign: 'right',
                }}
                underlineSize={1}
                placeholder={'مبلغ ' }
                style={{
                    flex: 1,
                    marginRight: 20,
                    fontSize:12,
                }}
                onChangeText={text => {
                    if (text === '') {
                        text = '0';
                    }
                    text = mapNumbersToEnglish(text);
                    this.props.onValueChanged({index: this.props.id, price: accounting.unformat(text)});
                }}
                highlightColor={primaryDark}
                value={this.props.price ? accounting.formatMoney(this.props.price, '', 0, ',') : ''}
                unit={userStore.CurrencyID}
            />

           {/* <Text style={{
                position: 'absolute',
                end: 5,
                marginHorizontal: 17,
                marginTop: 8,
                fontSize: 11,
            }}>{userStore.CurrencyID}</Text>*/}

        </View>;
    }
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingEnd: 13,
        paddingStart: 13,
        height: 45,
    },
    rowTitle: {
        flex: 1,
    },
    button: {
        flex: 1,
        borderWidth: 0.5,
        borderRadius: 4,
        height: 33,
        marginHorizontal: 7,
    },
    fromTop: {
        top: 0,
    },
    fromBottom: {
        bottom: 0,
    },
    img: {
        tintColor: 'black',
        height: 24,
        width: 24,
        marginEnd: 24,
    },
    actionIcon: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        height: '100%',
    },

});

class BatchPriceSet extends Component {

    constructor(props) {
        super(props);
        this.init = false;
        //this.animatedFromBottom = new Animated.Value(0);

        //for get keyboard height
       /* Keyboard.addListener('keyboardDidShow', (frames) => {
            if (!frames.endCoordinates) {
                return;
            }
            this.setState({keyboardSpace: frames.endCoordinates.height});
        });
        Keyboard.addListener('keyboardDidHide', (frames) => {
            this.setState({keyboardSpace: 0});
        });*/

        let pricesList = [];

        props.items.map(o => {
            pricesList.push('');
        });

        this.state = {
            keyboardSpace: 0,
            value: null,
            pristine: true,
            pricesList: pricesList
        };
    }

    componentDidMount() {
       /* this.animateSnake(true, () => {
        });*/

        this.setState({
            value: this.props.value,
            showClosePopup: false,

            mobileNumber: this.props.mobileNumber,
            sex: 1,
        });
    }

    animateSnake(open, fn) {
       /* Animated.timing(
            this.animatedFromBottom,
            {
                toValue: open ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            },
        ).start(fn);*/
    }

    onPriceEdit(event) {
        let newPriceList = this.state.pricesList;

        newPriceList[event.index] = event.price;

        this.setState({
            pricesList: newPriceList,
            pristine: false,
        });
    }

    render() {
        const {title, onClose} = this.props;

        return (
            <SnakePopup
                visible={true}
                dialogOpacity={0.5}
                toolbarTitle="شارژ بر اساس مساحت"
                items={this.props.items}
                onItemSelected={item => {
                   /* this.changeSearchType(item);
                    this.setState({showSearchType: false});*/
                }}
                itemComponent={(o,index)=>(
                    <AreaElement
                        key={index}
                        id={index}
                        Area={o}
                        price={this.state.pricesList[index]}
                        onValueChanged={o => this.onPriceEdit(o)}
                    />
                )}
                onClose={onClose}
                fromTop={50}
            >
                <TouchableOpacity
                    style={{
                        marginTop: 15,
                        margin: 24,
                        borderRadius: 10,
                        height: 48,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: (!this.state.pristine) ? primaryDark : '#D5CBCB',
                    }}
                    onPress={() => this.props.onBatchPriceSet(this.state.pricesList)}
                    disabled={this.state.pristine}
                >
                    <Text style={{color: 'white'}}>اعمال</Text>
                </TouchableOpacity>
            </SnakePopup>

        );
    }
}

export default class IppCharge extends Component {
    constructor() {
        super();
        this.allUnits = [];
        this.state = {
            checked: false,
            showBatchPriceSet: false,
            selectedUnitArea: null,
            selectedUnitPrice: null,

            pristine: true,
            unitsCount: 0,
            unitsSum: 0,
        };
    }

    componentDidMount() {
        waitForData(()=>{
            this.getUnitsList();
            this.setState({permission:userStore.findPermission(permissionId.defaultCharge).writeAccess})

        });
    }

    async getUnitsList() {
        this.showLoading();
        await getAllUnits().then(result => this.allUnits = result).catch(e => {this.hideLoading()});
        this.setDistinctAreaList();
        this.hideLoading();
    }

    setDistinctAreaList() {
        let priceList = [];
        let distinctAreaList = [];
        let unitsSum = 0;

        this.allUnits.map(o => {
            priceList.push({UnitID: o.UnitID, Price: o.Price});
            if (distinctAreaList.indexOf(o.Area) < 0) {
                distinctAreaList.push(o.Area);
            }
            if(o.Price) {
                unitsSum += Number(o.Price);
            }
        });


        this.setState({
            priceList: priceList,
            distinctAreaList: distinctAreaList.sort(),
            unitsCount: priceList.length,
            unitsSum: unitsSum
        });
    }

    render() {
        const toolbarStyle = this.state.permission && this.allUnits.length > 0 ? {
            start: {
                onPress: this.onBackPressed.bind(this),
                content: images.ic_back,
            },
            title: 'فرم شارژ ثابت',
            end: {
                onPress: this.showBatchPriceSetOverlay.bind(this),
                icon: images.ic_Ruler,
            },
        } : {
            start: {
                onPress: this.onBackPressed.bind(this),
                content: images.ic_back,
            },
            title: 'فرم شارژ ثابت',
        };

        return (
            <MobileLayout style={{padding:0}} title={`فرم شارژ ثابت`}
            header={ <Toolbar customStyle={toolbarStyle}/>}
            footer={<View>
                  {this.allUnits.length > 0 && this.state.permission &&
                  <TouchableOpacity
                      onPress={() => {
                          this.submitPrices();
                      }}
                      style={{
                          backgroundColor: (!this.state.pristine) ? primaryDark : '#D5CBCB',
                          alignItems: 'center',
                          justifyContent: 'center',
                      }}
                      disabled={this.state.pristine}
                  >
                      <Text style={{fontSize: 16, color: 'white',padding:Platform()=='ios'?16:12}}>ثبت</Text>
                  </TouchableOpacity>
                  }
            </View>}
            >
                <View style={{flex:  1, backgroundColor: bgScreen}}>


                    <AndroidBackButton
                        onPress={() => {
                            this.onBackPressed();
                            return true;
                        }}
                    />
                    <View
                        style={{
                            backgroundColor: 'white',
                            borderBottomWidth: 2,
                            borderBottomColor: 'rgba(182, 182, 182, 0.3)',
                        }}
                    >
                        <View
                            style={{
                                marginTop: 12,
                                marginBottom: 12,
                                height: 25,
                                flexDirection: 'row',
                                backgroundColor: 'white',
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'space-between',
                                    paddingHorizontal: 16,
                                    borderEndWidth: 1,
                                    borderEndColor: '#E5DEDE',
                                }}
                            >
                                <Text
                                    style={{
                                        flex: 1,
                                        fontFamily:'IRANYekanFaNum-Light',
                                        color: '#8A7E7E',
                                        fontSize: 12,
                                    }}>تعداد واحد</Text>
                                <Text
                                    style={{
                                        color: '#8A7E7E',
                                        fontSize: 14,
                                    }}>{this.state.unitsCount}</Text>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'space-between',
                                    paddingHorizontal: 16,
                                }}
                            >
                                <Text
                                    style={{
                                        flex: 1,
                                        fontFamily:'IRANYekanFaNum-Light',
                                        color: '#8A7E7E',
                                        fontSize: 12,
                                    }}>جمع کل</Text>
                                <Text
                                    style={{
                                        color: '#8A7E7E',
                                        fontSize: 14,
                                    }}>{accounting.formatMoney(this.state.unitsSum, '', 0, ',')}</Text>
                            </View>
                        </View>
                    </View>

                    <UnitsTable
                        items={this.allUnits}
                        prices={this.state.priceList}
                        redOnEmpty={this.state.checked}
                        writePermission={this.state.permission}
                        onPriceEdit={o => this.updatePrice(o)}
                    >
                    </UnitsTable>



                    {this.state.showBatchPriceSet &&
                    <BatchPriceSet
                        title={'شارژ بر اساس مساحت'}
                        open={this.state.showBatchPriceSet}
                        onClose={() => this.setState({showBatchPriceSet: false})}
                        items={this.state.distinctAreaList}
                        onBatchPriceSet={o => this.setBatchPriceList(o)}
                    />
                    }
                    <LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage}/>

                </View>
            </MobileLayout>
        );
    }

    showLoading(message = 'در حال دریافت اطلاعات...') {
        this.setState({loading: true, loadingMessage: message});
    }

    hideLoading() {
        this.setState({loading: false});
    }

    showBatchPriceSetOverlay(o) {
        this.setState({
            showBatchPriceSet: true,
            selectedUnitArea: o.area,
            selectedUnitPrice: o.price,
        });
    }

    hideBatchPriceSetOverlay() {
        this.setState({
            showBatchPriceSet: false,
            selectedUnitArea: null,
            selectedUnitPrice: null,
        });
    }

    setBatchPriceList(priceList) {
        let newPriceList = this.state.priceList;
        let unitsSum = 0;

        this.allUnits.map((o, index) => {
            if (priceList[this.state.distinctAreaList.indexOf(o.Area)] != '') {
                newPriceList[index].Price = priceList[this.state.distinctAreaList.indexOf(o.Area)];
            }
        });
        newPriceList.map((o) => {
            if(o.Price) {
                unitsSum += Number(o.Price);
            }
        });
        console.log(newPriceList);
        this.setState({priceList: newPriceList, unitsSum: unitsSum, pristine: false});

        this.hideBatchPriceSetOverlay();
    }

    checkPrices() {
        let pass = true;
        this.state.priceList.map(o => {
            if (o.Price === '') {
                pass = false;
            }
        });
        this.setState({checked: true});

        return pass;
    }

    updatePrice(o) {
        let newPriceList = this.state.priceList;
        let unitsSum = 0;
        newPriceList[o.index].Price = o.price;
        newPriceList.map((o) => {
            if(o.Price) {
                unitsSum += Number(o.Price);
            }
        });
        this.setState({priceList: newPriceList, unitsSum: unitsSum, pristine: false});
    }

    async submitPrices() {
        let body = {
            Data: this.state.priceList,
            UnitID: userStore.UnitID,
            BuildingID: userStore.BuildingID
        };
        console.log(body);
        await setDefaultCharge(body)
            .then(() => {
                //this.onBackPressed();
                this.setState({pristine:true})
                showMassage('اطلاعات با موفقیت ذخیره شد.','','success')
            })
            .catch(e => {globalState.showToastCard()})
            .finally(() => this.setState({loading: false}));
    }

    onBackPressed() {
        navigation.navigate('Main');
    }
}
