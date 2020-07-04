
import MobileLayout from "../../src/components/layouts/MobileLayout";
import {globalState, userStore} from "../../src/stores";
import Router from "next/router";
import React, {useEffect, useState,PureComponent} from "react";
import ReactDOM from 'react-dom';
import useWindowDimensions from "../../src/hooks/windowDimensions";
import {getCarModelQuery, getCarTagCharacterQuery, addCarQuery ,getCarBrandQuery,getCarColorQuery } from "../../src/network/Queries";
import {inputNumberValidation, logger, mapNumbersToEnglish, navigation, waitForData} from "../../src/utils";
import {
    Toolbar,
    SnakePopup,
    FloatingLabelTextInput,
    ListDialogPopUp,
    DropDownList,
    AndroidBackButton,
    AlertMessage,
} from "../../src/components";
import {
    bgEmpty,
    bgScreen,
    bgWhite,
    black,
    border, borderSeparate,
    gray,
    lightRed,
    placeholderTextColor, primaryDark,
    transparent,
    textDisabled,
} from '../../src/constants/colors';
import {observer} from 'mobx-react';
import {permissionId} from '../../src/constants/values';
import images from "../../public/static/assets/images";
import {
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    StyleSheet,
    ScrollView,
} from "../../src/react-native";

export default class AddCar extends PureComponent {
    constructor(props) {
        super(props);
        this.cars = [];
        this.state = {
            brandList: [],
            brandSelected: null,
            brandSelectedValidation: true,
            modelList: [],
            modelSelected: null,
            modelSelectedValidation: true,
            tagCharacterList: [],
            tagCharacterSelected: null,
            tagCharacterSelectedValidation: true,
            colorList: [],
            colorSelected: null,
            colorSelectedValidation: true,
            tagOne: null,
            tagOneValidation: true,
            tagTwo: null,
            tagTwoValidation: true,
            tagIran: null,
            tagIranValidation: true,
            permission: userStore.findPermission(permissionId.unitCars),
            editMode: false,
            keyboardHeight:0,
        };


    }

    checkValidation() {
        Keyboard.dismiss();
        if (!this.state.brandSelected) {
            this.setState({brandSelectedValidation: false});
            return;
        } else if (!this.state.modelSelected) {
            this.setState({modelSelectedValidation: false});
            return;
        } else if (!this.state.tagCharacterSelected) {
            this.setState({tagCharacterSelectedValidation: false});
            return;
        } else if (!this.state.colorSelected) {
            this.setState({colorSelectedValidation: false});
            return;
        } else if (!this.state.tagOne) {
            this.setState({tagOneValidation: false});
            return;
        } else if (!this.state.tagTwo || this.state.tagTwo.length < 3) {
            this.setState({tagTwoValidation: false});
            return;
        } else if (!this.state.tagIran) {
            this.setState({tagIranValidation: false});
            return;
        }

        this.onConfirmCar();
    }

    isValid = () => {
        console.log(this.state.brandSelected);
        return this.state.brandSelected && this.state.modelSelected && this.state.tagCharacterSelected && this.state.colorSelected && this.state.tagOne && this.state.tagTwo && this.state.tagIran
    }

    async onConfirmCar() {
        Keyboard.dismiss();
        this.setState({loading: true, loadingMessage: 'در حال ذخیره ...'});
        let car = {
            BrandID: Number(this.state.brandSelected.ID),
            ModelID: Number(this.state.modelSelected.ID),
            ColorID: Number(this.state.colorSelected.ID),
            TagOne: Number(this.state.tagOne),
            TagCharacter: this.state.tagCharacterSelected.ID,
            TagTwo: Number(this.state.tagTwo),
            TagIran: Number(this.state.tagIran),
            BuildingID: Number(userStore.BuildingID),
            RoleID: userStore.RoleID,
            //UserId: userStore.userID,
        };
        if(userStore.UnitID){
            car.CreatedUnitID= userStore.UnitID;
            car.UnitID= userStore.UnitID;
        }

        if (this.car) {
            car = Object.assign(car, {ID: this.car.ID});
        }

        await addCarQuery(car)
            .then(async (res) => {
                Router.back();

            })
            .catch(e => {
                let es=e;
            })
            .finally(() => {
                globalState.showToastCard();
                this.setState({loading: false})
            });

    }

    onBackPress() {
        Router.back();
    }

    onSelectBrand = (brand) => {
        this.setState({modelSelected:null,loading: true, loadingMessage: 'بارگزاری مدل ها ...'});
        getCarModelQuery(brand.ID)
            .then(result => {
                this.setState({
                    brandSelected: brand,
                    brandSelectedValidation: true,
                    modelList: result
                })
                //console.log(this.state.brandSelected);

            })
            .catch(e => {
                globalState.showToastCard();
            })
            .finally(() => this.setState({loading: false,}));
    }
    initEnumData = () => {
        getCarBrandQuery()
            .then(result => {
                if (this.car) this.state.brandSelected = result.find(brand => brand.ID === this.car.BrandID);
                this.setState({brandList: result});
            })
            .catch(e => globalState.showToastCard())
        if(this.car)
            getCarModelQuery(this.car.BrandID)
                .then(result => {
                    this.state.modelSelected = result.find(model => model.ID === this.car.ModelID);
                    this.setState({modelList: result});
                })
                .catch(e => globalState.showToastCard())


        getCarTagCharacterQuery()
            .then(result => {
                if (this.car) this.state.tagCharacterSelected = result.find(tagCharacter => tagCharacter.ID === this.car.TagCharacter);
                this.setState({tagCharacterList: result});
            })
            .catch(e => globalState.showToastCard())


        getCarColorQuery()
            .then(result => {
                if (this.car) this.state.colorSelected = result.find(color => color.ID === this.car.ColorID);
                this.setState({colorList: result});
            })
            .catch(e => globalState.showToastCard())
    }


    componentDidMount(){
        this.car = navigation.getParam('item', null);
        if (this.car) {
            this.setState({editMode:true,tagOne: this.car.TagOne,tagTwo:this.car.TagTwo,tagIran :this.car.TagIran})
        }

        waitForData(this.initEnumData);
        /*if(Platform.OS === 'ios'){
            Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        }*/
    }
    _keyboardDidShow=(e)=> {
        this.setState({  keyboardHeight: e.endCoordinates.height-33, });
    }
    _keyboardDidHide=(e)=> {
        this.setState({  keyboardHeight: 0, });
    }

    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_close,
            },
            title: this.state.editMode ? 'ویرایش ماشین' : 'ماشین جدید'
        };
        return (
            <MobileLayout style={{padding:0}} title={`ماشین های ساختمان`}>
                    <View style={{flex: 1, backgroundColor: '#F5F1F1'}}>
                        <Toolbar customStyle={toolbarStyle}/>
                        <AndroidBackButton
                            onPress={() => {
                                this.onBackPress();
                                return true;
                            }}
                        />
                        {/*<KeyboardAvoidingView behavior="position" style={{flex: 1}} keyboardVerticalOffset={-64}>*/}
                        <ScrollView keyboardDismissMode='on-drag' style={{paddingBottom:200}}>
                            <View
                                style={{
                                    backgroundColor: '#F5F1F1',
                                    flex: 1,
                                    padding: 24,
                                }}
                            >

                                <View style={{flexDirection: 'row', flex: 1, marginTop: 32, alignItems: 'center'}}>
                                    {/*<Text style={{paddingLeft: 30,}}>برند</Text>*/}
                                    <ListDialogPopUp
                                        //style={{}}

                                        title={'انتخاب برند ماشین'}
                                        snake
                                        items={this.state.brandList}
                                        selectedItem={this.state.brandSelected}
                                        height={global.height/2}
                                        searchField={"Name"}
                                        validation={this.state.brandSelectedValidation}
                                        selectedItemCustom={
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginHorizontal: 8,
                                                    marginVertical: 8,
                                                }}>


                                                <Text
                                                    style={{
                                                        fontFamily:'IRANYekanFaNum-Bold'
                                                    }}>
                                                    {this.state.brandSelected
                                                        ? this.state.brandSelected.Name
                                                        : 'انتخاب برند'}
                                                </Text>
                                            </View>
                                        }
                                        onValueChange={item => this.onSelectBrand(item)}
                                        itemComponent={(item,index) =>{
                                            return (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        paddingHorizontal: 8,
                                                        alignItems: 'center',
                                                        borderBottomWidth: 0.5,
                                                        borderColor: borderSeparate,
                                                    }}>

                                                    <Text style={{paddingVertical: 16}}>
                                                        {item.Name}
                                                    </Text>

                                                </View>
                                            )
                                        } }
                                    />
                                </View>
                                <View style={{flexDirection: 'row', flex: 1, marginTop: 32, alignItems: 'center'}}>
                                    {/*<Text style={{paddingLeft: 30,}}>مدل</Text>*/}
                                    <ListDialogPopUp
                                        style={{}}
                                        title={'انتخاب مدل ماشین'}
                                        snake
                                        items={this.state.modelList}
                                        selectedItem={this.state.modelSelected}
                                        disabled={!this.state.brandSelected}
                                        validation={this.state.modelSelectedValidation}
                                        height={global.height/2}
                                        //searchField={"Model"}
                                        selectedItemCustom={
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginHorizontal: 8,
                                                    marginVertical: 8,
                                                }}>


                                                <Text
                                                    style={{
                                                        fontFamily:'IRANYekanFaNum-Bold',
                                                    }}>
                                                    {this.state.modelSelected
                                                        ? this.state.modelSelected.Model
                                                        : 'انتخاب مدل'}
                                                </Text>
                                            </View>
                                        }
                                        onValueChange={item => this.setState({
                                            modelSelected: item,
                                            modelSelectedValidation: true,
                                        })}
                                        itemComponent={item => (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    paddingHorizontal: 8,
                                                    alignItems: 'center',
                                                    borderBottomWidth: 0.5,
                                                    borderColor: borderSeparate,
                                                }}>

                                                <Text style={{paddingVertical: 16}}>
                                                    {item.Model}
                                                </Text>

                                            </View>
                                        )}
                                    />
                                </View>
                                <View style={{flexDirection: 'row', flex: 1, marginTop: 32, alignItems: 'center'}}>
                                    {/*<Text style={{paddingLeft: 30,}}>رنگ</Text>*/}
                                    <ListDialogPopUp
                                        style={{}}
                                        title={'انتخاب رنگ ماشین'}
                                        snake
                                        items={this.state.colorList}
                                        selectedItem={this.state.colorSelected}
                                        disabled={!this.state.modelSelected}
                                        validation={this.state.colorSelectedValidation}
                                        height={global.height/2}
                                        searchField={"Name"}
                                        selectedItemCustom={
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginHorizontal: 8,
                                                    marginVertical: 8,
                                                }}>


                                                <Text
                                                    style={{
                                                        fontFamily:'IRANYekanFaNum-Bold',
                                                    }}>
                                                    {this.state.colorSelected
                                                        ? this.state.colorSelected.Name
                                                        : 'انتخاب رنگ'}
                                                </Text>
                                            </View>
                                        }
                                        onValueChange={item => this.setState({
                                            colorSelected: item,
                                            colorSelectedValidation: true,
                                        })}
                                        itemComponent={item => (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    paddingHorizontal: 8,
                                                    alignItems: 'center',
                                                    borderBottomWidth: 0.5,
                                                    borderColor: borderSeparate,
                                                }}>
                                                <Text style={{paddingVertical: 16}}>
                                                    {item.Name}
                                                </Text>

                                            </View>
                                        )}
                                    />
                                </View>
                                <View style={{flexDirection: 'row', flex: 1, marginTop: 32,paddingBottom:200, alignItems: 'center'}}>
                                    {/*<Text style={{paddingLeft: 30,}}>پلاک</Text>*/}
                                    <View style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#cfcfcf',
                                        padding: 3,
                                        flex:1,
                                        borderRadius: 10,
                                        borderWidth:1,
                                        borderColor:gray,
                                        justifyContent:'center',
                                    }}>

                                        <View style={{
                                            flex: 2,
                                            marginRight: 15,
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            borderColor: gray,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingHorizontal: 5,
                                            paddingVertical: 7,
                                            backgroundColor: this.state.colorSelected ? bgWhite : transparent
                                        }}>

                                            <FloatingLabelTextInput
                                                ref="textInput"
                                                //editable={this.state.colorSelected}
                                                multiline={false}

                                                maxLength={2}
                                                keyboardType='number-pad'
                                                numberOfLines={1}
                                                returnKeyType="done"
                                                // onSubmitEditing={() => this.processCalc()}
                                                floatingLabelEnable={false}
                                                tintColor={this.state.tagIranValidation ? placeholderTextColor : lightRed}
                                                textInputStyle={{
                                                    fontSize: 16,
                                                    fontFamily:'IRANYekanFaNum-Bold',
                                                    color: 'black',
                                                    textAlign: 'center',

                                                }}
                                                underlineSize={1}

                                                placeholder='ایران'
                                                style={{flex: 1}}
                                                onChangeText={text => this.setState({tagIran: inputNumberValidation(text, this.state.tagIran, /[\d-]+$/)})}
                                                highlightColor={primaryDark}
                                                value={this.state.tagIran}
                                            />
                                        </View>


                                        <View style={{
                                            flex: 1.3,
                                            marginRight: 5,
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            borderColor: gray,
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            paddingHorizontal: 5,
                                            paddingVertical: 7,
                                            backgroundColor: this.state.colorSelected ? bgWhite : transparent
                                        }}>
                                            <FloatingLabelTextInput
                                                ref="textInput"
                                                //editable={this.state.brandSelected}
                                                multiline={false}
                                                maxLength={3}
                                                keyboardType='number-pad'
                                                numberOfLines={1}
                                                returnKeyType="done"
                                                // onSubmitEditing={() => this.processCalc()}
                                                floatingLabelEnable={false}
                                                tintColor={this.state.tagTwoValidation ? placeholderTextColor : lightRed}
                                                textInputStyle={{
                                                    fontSize: 16,
                                                    fontFamily:'IRANYekanFaNum-Bold',
                                                    color: 'black',
                                                    textAlign: 'center',

                                                }}
                                                underlineSize={1}

                                                placeholder=''
                                                //style={{marginTop:23}}
                                                onChangeText={text => this.setState({tagTwo: inputNumberValidation(text, this.state.tagTwo, /[\d-]+$/)})}
                                                highlightColor={primaryDark}
                                                value={this.state.tagTwo}
                                            />
                                        </View>
                                        <ListDialogPopUp
                                            style={{marginRight: 5, flex: 2}}
                                            title={'انتخاب حرف'}
                                            snake
                                            height={global.height/2}
                                            searchField={"ID"}
                                            items={this.state.tagCharacterList}
                                            selectedItem={this.state.tagCharacterSelected}
                                            disabled={!this.state.colorSelected}
                                            validation={this.state.tagCharacterSelectedValidation}
                                            selectedItemCustom={
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        //paddingTop: 8,
                                                        //marginVertical: 8,
                                                    }}>


                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            fontFamily: 'IRANYekanFaNum-Bold',
                                                        }}>
                                                        {this.state.tagCharacterSelected
                                                            ? this.state.tagCharacterSelected.ID
                                                            : '...'}
                                                    </Text>
                                                </View>
                                            }
                                            onValueChange={item => this.setState({
                                                tagCharacterSelected: item,
                                                tagCharacterSelectedValidation: true,
                                            })}
                                            itemComponent={item => (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        paddingHorizontal: 8,
                                                        alignItems: 'center',
                                                        borderBottomWidth: 0.5,
                                                        borderColor: borderSeparate,
                                                    }}>
                                                    <Text style={{paddingVertical: 16}}>
                                                        {item.ID}
                                                    </Text>

                                                </View>
                                            )}
                                        />
                                        <View style={{
                                            flex: 1,
                                            marginRight: 5,
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            borderColor: gray,
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            paddingHorizontal: 5,
                                            paddingVertical: 7,
                                            backgroundColor: this.state.colorSelected ? bgWhite : transparent
                                        }}>
                                            <FloatingLabelTextInput
                                                ref="textInput"
                                                //editable={this.state.brandSelected}
                                                multiline={false}
                                                maxLength={2}
                                                keyboardType='number-pad'
                                                numberOfLines={1}
                                                returnKeyType="done"
                                                // onSubmitEditing={() => this.processCalc()}
                                                floatingLabelEnable={false}
                                                tintColor={this.state.tagOneValidation ? placeholderTextColor : lightRed}
                                                textInputStyle={{
                                                    fontSize: 16,
                                                    fontFamily: 'IRANYekanFaNum-Bold',
                                                    color: 'black',
                                                    textAlign: 'center',

                                                }}
                                                underlineSize={1}
                                                placeholder=''
                                                style={{}}
                                                onChangeText={text => this.setState({tagOne: inputNumberValidation(text, this.state.tagOne, /[\d-]+$/)})}
                                                highlightColor={primaryDark}
                                                value={this.state.tagOne}
                                            />
                                        </View>

                                    </View>

                                </View>




                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                bottom: this.state.keyboardHeight,
                                left: 0,
                                right: 0,
                            }}
                            onPress={() => this.checkValidation()}
                            disabled={!this.isValid()}

                        >
                            <View style={{flexDirection: 'row'}}>
                                <View
                                    style={{
                                        flex: 1,
                                        height: 52,
                                        backgroundColor:  this.isValid() ? primaryDark : textDisabled,
                                        alignItems: 'center',
                                        justifyContent: 'center',

                                    }}
                                >
                                    <Text style={{
                                        fontSize: 18,
                                        color: this.state.editMode || this.isValid() ? '#fff' : gray
                                    }}>{this.state.editMode ? 'ذخیره ماشین' : 'افزودن ماشین'}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {/*</KeyboardAvoidingView>*/}
                        <AlertMessage
                            visible={this.state.showClosePopup}
                            title='خروج؟'
                            message='در صورت خروج از صفحه، تغییرات ذخیره نخواهد شد.'
                            onConfirm={() => {
                                this.setState({showClosePopup: false}, () => this.onBackPress());
                            }}
                            onDismiss={() => this.setState({showClosePopup: false})}
                            confirmTitle='خروج'
                            dismissTitle='ادامه ویرایش'
                        />

                    </View>
            </MobileLayout>
        );
    }
}
const styles = StyleSheet.create({
    textInput: {},

});

