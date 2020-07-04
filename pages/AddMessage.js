import React, {Component} from 'react';
import {
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    View,
    KeyboardAvoidingView,
    KeyboardAwareScrollView
} from '../src/react-native';

import images from "public/static/assets/images";
import {placeholderTextColor, primaryDark, subTextItem, transparent} from '../src/constants/colors';
import {isValidate} from '../src/utils';
import {persistStore, userStore} from '../src/stores';
import {AlertMessage, AndroidBackButton, Fab, ListMultiSelect, Toolbar} from '../src/components';
import FloatingLabelTextInput from '../src/components/FloatingLabelTextInput';
import {navigation} from "../src/utils";
import MobileLayout from "../src/components/layouts/MobileLayout";
import {addNoticeBoardQuery} from "../src/network/Queries";
import {observer} from "mobx-react";

@observer
export default class AddMessage extends Component {
    constructor(props) {
        super(props);
        this.personCount = persistStore.roles.length;
        this.state = {
            title: '',
            message: '',
            id: '',
            pristine: true,
            keyboardHeight:0,
            DestinationBuildingID: [], //building
            DestinationRoleID: [], // person
            validationTitle: true,
            validationMessage: true,
            validationBuilding: true,
            validationPerson: true,
        };

    }
    componentDidMount(){
        console.log('persistStore.roles==',persistStore.roles);
        let item = navigation.getParam('item', null);
        this.onSave = navigation.getParam('onSave');

        if (item) {
            const perBuilding = [];
            const perPerson = [];

            JSON.parse(item.BuildingNoticeBoardBuilding).map(obj => {
                perBuilding.push(obj.id);
            });
            JSON.parse(item.BuildingNoticeBoardDestinationRole).map(obj => {
                perPerson.push(obj.id);
            });
            let roles = persistStore.roles;
             debugger
            this.setState({
                title :item.Title,
                message : item.Description,
                id :item.ID,
                DestinationBuildingID:perBuilding,
                DestinationRoleID:perPerson,
                DestinationRoleTitle:perPerson.length == this.personCount ? 'ارسال برای همه' : perPerson.length > 1 ? roles.find(role=>role.id==perPerson).persianName + ' و ' + (perPerson.length - 1).toString() + ' مورد دیگر' : perPerson.length > 0 ?roles.find(role=>role.id==perPerson).persianName : 'هیچ موردی انتخاب نشده است.',
            })

        }


    }

    onBackPress() {
        navigation.goBack();
    }
    onRoleSelect(selectedIds) {

        let allRoles = persistStore.roles;
        let title='هیچ موردی انتخاب نشده است.';
        if( selectedIds.length == allRoles.length){
            title='ارسال برای همه';
        }else if(selectedIds.length == 1){
            let selectedId=Number(selectedIds[0])
            let selectedItem=allRoles.find(role=>role.id==selectedId);
            title=selectedItem.persianName

        }else if(selectedIds.length>1){
            let id=selectedIds[0]
            let selectedItem=allRoles.find(role=>role.id==id);
            title=selectedItem.persianName + ' و ' + (selectedIds.length - 1).toString()  + ' مورد دیگر'
        }

        this.setState({
            DestinationRoleID: selectedIds,
            DestinationRoleTitle:title,
            pristine: false,
        });


       /* let roles = persistStore.roles;
        this.setState({
            DestinationRoleID: selectedItems,
            DestinationRoleTitle: selectedItems.length == this.personCount ? 'ارسال برای همه' : selectedItems.length > 1 ?
                roles[selectedItems[0]].persianName + ' و ' + (selectedItems.length - 1).toString()
                + ' مورد دیگر' : selectedItems.length > 0 ? roles[selectedItems[0]].persianName : 'هیچ نقشی انتخاب نشده است.',
            pristine: false,
        });*/
    }
    onBuildingSelect(selectedItems) {
        this.setState({
            DestinationBuildingID: selectedItems,
            DestinationBuildingTitle: selectedItems.length == userStore.BuildingIds.length ? 'ارسال برای همه' :
                selectedItems.length > 0 ? selectedItems.length + " ساختمان" : 'هیچ ساختمانی انتخاب نشده است.',
            pristine: false,
        });
    }
    checkValidation() {

        Keyboard.dismiss();
        if (!isValidate(this.state.title)) {
            this.setState({validationTitle: false});
            return;
        }

        if (!isValidate(this.state.message)) {
            this.setState({validationMessage: false});
            return;
        }

        if (userStore.BuildingIds.length > 1 && !isValidate(this.state.DestinationBuildingID)) {
            this.setState({validationBuilding: false});
            return;
        }

        if (!isValidate(this.state.DestinationRoleID)) {
            this.setState({validationPerson: false});
            return;
        }

        let item = {
            title: this.state.title,
            description: this.state.message,
        };
        item = Object.assign(item, {
            DestinationBuildingID: userStore.BuildingIds.length > 1 ? this.state.DestinationBuildingID : [userStore.BuildingIds[0].id],
            DestinationRoleID: this.personCount === this.state.DestinationRoleID.length ? null : this.state.DestinationRoleID,
        });
        if (this.state.id) {
            item = Object.assign(item, {ID: this.state.id});
        }

        item = Object.assign(item, {BuildingID: userStore.BuildingID, UnitID: userStore.UnitID});



        //this.onSave(item);
        this.save(item);
    }
    async save(item) {
        this.setState({loading: true, loadingMessage: 'در حال ذخیره ...'});
        await addNoticeBoardQuery(item).then(() => {
            this.onBackPress();
            //this.getNoticsBoard()
        }).catch(e => this.setState({loading: false}));

    }

    render() {

        const toolbarStyle = {
            start: {

                onPress: this.state.pristine ? () => this.onBackPress() : () => {
                    Keyboard.dismiss();
                    this.setState({showClosePopup: true});
                },
                content: images.ic_close,
            },
            title: 'ساخت اعلان جدید',
        };
        return (
            <MobileLayout
                header={<Toolbar customStyle={toolbarStyle}/>}
                footer={<TouchableOpacity
                            style={{
                                //transform:[{translateY:-this.state.keyboardHeight}],
                                position: 'absolute',
                                bottom: this.state.keyboardHeight,
                                left: 0,
                                right: 0,
                            }}
                            onPress={() => this.checkValidation()}
                            disabled={!(this.state.title && this.state.title != '' &&
                                this.state.message && this.state.message != '' &&
                                this.state.DestinationRoleID && this.state.DestinationRoleID.length > 0)}
                            disa
                         >
                        <View style={{flexDirection: 'row'}}>
                        <View
                            style={{
                                flex: 1,
                                height: 48,
                                backgroundColor: (this.state.title && this.state.title != '' &&
                                    this.state.message && this.state.message != '' &&
                                    this.state.DestinationRoleID && this.state.DestinationRoleID.length > 0)
                                    ? primaryDark : '#D5CBCB',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomLeftRadius: 4,
                                borderBottomRightRadius: 4,
                            }}
                        >
                            <Text style={{
                                fontSize: 16, color: 'white', fontFamily:
                                    Platform.OS === 'ios'
                                        ? 'IRANYekanFaNum-Bold'
                                        : 'IRANYekanBold(FaNum)',
                            }}>ساخت اعلان</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                  } >

                    <View style={{flex: 1, backgroundColor: '#F5F1F1'}}>
                        <AndroidBackButton
                            onPress={() => {
                                this.onBackPress();
                                return true;
                            }}
                        />

                        <KeyboardAwareScrollView >
                            <View
                                style={{
                                    backgroundColor: '#F5F1F1',
                                    flex: 1,
                                    padding: 24,
                                }}
                            >

                                <FloatingLabelTextInput
                                    multiline={false}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    floatingLabelEnable={false}
                                    tintColor={'#BFACAC'}
                                    textInputStyle={{
                                        fontSize: 16,
                                        color: '#5D4A4A',
                                        textAlign: 'right',
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-ExtraBold'
                                                : 'IRANYekanExtraBold',

                                    }}
                                    underlineSize={1}
                                    placeholder="عنوان اعلان"
                                    onChangeText={text => this.setState({
                                        title: text,
                                        validationTitle: true,
                                        pristine: false,
                                    })}
                                    highlightColor={primaryDark}
                                    value={this.state.title}
                                />

                                <TextInput
                                    placeholder="پیام خود را وارد کنید"
                                    placeholderTextColor={placeholderTextColor}
                                    blurOnSubmit={false}
                                    autoCorrect={false}
                                    numberOfLines={5}
                                    style={{
                                        flex: 1,
                                        marginTop: 24,
                                        padding:16,
                                        borderColor: subTextItem,
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        fontSize: 14,
                                        textAlignVertical: 'top',
                                        textAlign: 'right',
                                        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                        height: 110,
                                    }}
                                    textInputStyle={{padding:20}}
                                    multiline={true}
                                    underlineColorAndroid={transparent}
                                    onChangeText={text => this.setState({
                                        message: text,
                                        validationMessage: true,
                                        pristine: false,
                                    })}
                                    returnKeyType="done"
                                    value={this.state.message}
                                />

                                <Text style={{
                                    fontSize: 18,
                                    color: 'black',
                                    textAlign: 'right',
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-ExtraBold'
                                            : 'IRANYekanExtraBold',
                                    alignSelf: 'flex-start',
                                    marginTop: 30,
                                    marginBottom: 20,
                                }}>ارسال برای</Text>

                                { userStore.BuildingIds.length > 1 &&
                                <View
                                    style={{marginBottom: 25}}
                                >
                                    <ListMultiSelect
                                        title='ارسال اعلان برای:'
                                        selectedIcon={images.ic_send}
                                        validation={this.state.validationPerson}
                                        items={userStore.BuildingIds}
                                        selectedTitle={this.state.DestinationBuildingTitle ? this.state.DestinationBuildingTitle : 'ساختمان را انتخاب کنید'}
                                        selectedItems={this.state.DestinationBuildingID}
                                        onAccept={selectedItems => this.onBuildingSelect(selectedItems)}
                                    />
                                </View>
                                }

                                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
                                    <ListMultiSelect
                                        title='ارسال اعلان برای:'
                                        validation={this.state.validationPerson}
                                        items={persistStore.roles}
                                        selectedIcon={images.ic_send}
                                        selectedTitle={this.state.DestinationRoleTitle ? this.state.DestinationRoleTitle : 'نقش را انتخاب کنید'}
                                        selectedItems={this.state.DestinationRoleID}
                                        onAccept={selectedItems => this.onRoleSelect(selectedItems)}
                                    />
                                </View>


                            </View>
                        </KeyboardAwareScrollView>

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
    textInput: {
        paddingHorizontal: 4,
        borderWidth: 0.5,
        height: 120,
        textAlignVertical: 'top',
        marginTop: 24,
    },
    buttonIn: {
        flex: 1,
        borderWidth: 0.5,
        alignItems: 'center',
        borderRadius: 4,
        height: 33,
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7,
    },
});
