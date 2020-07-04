
import MobileLayout from "../../src/components/layouts/MobileLayout";
import {globalState, userStore} from "../../src/stores";
import Router from "next/router";
import React, {useEffect, useState,PureComponent} from "react";
import ReactDOM from 'react-dom';
import useWindowDimensions from "../../src/hooks/windowDimensions";
import {getUnitCarQuery, getCarTagCharacterQuery, searchUserQuery,} from "../../src/network/Queries";
import {inputNumberValidation, logger, mapNumbersToEnglish} from "../../src/utils";
import {Toolbar,SnakePopup,FloatingLabelTextInput,ListDialogPopUp,DropDownList} from "../../src/components";
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
} from '../../src/constants/colors';
import {observer} from 'mobx-react';
import {permissionId} from '../../src/constants/values';
import images from "../../public/static/assets/images";
import {View, Text, FlatList,Image,TouchableOpacity} from "../../src/react-native";

function Bolder(props) {
    return(
        <span style={{
            fontSize: 14,
            color: black,
            fontFamily:  'IRANYekanFaNum-Bold',
        }} dangerouslySetInnerHTML={{ __html: (props.FirstName+' '+props.LastName).replaceAll(props.keyword,`<b style="color:red" >${props.keyword}</b>`) }}></span>
    )
}

class CarItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
       
        const {BrandName, ModelName, ColorName, TagOne, TagCharacter, TagTwo, TagIran, UnitNumber, UnitID,FloorNumber, Name,} = this.props.item;
        const {keyword,permission, idSwipeOpened, index, onPressItem} = this.props;
        return (
            <TouchableOpacity
                key={UnitID}
                onPress={onPressItem}
                style={{
                    flexDirection: 'column',
                    padding: 24,
                    paddingVertical: 15,
                    borderColor: gray,
                    marginHorizontal: 16,
                    marginTop: 16,
                    backgroundColor: bgWhite,
                    borderRadius: 10,

                }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                    <View style={{}}>
                            <span style={{
                                fontSize: 14,
                                color: black,
                                fontFamily:  'IRANYekanFaNum-Bold',
                            }} dangerouslySetInnerHTML={{ __html: (BrandName+' '+ModelName+' '+ColorName).replaceAll(keyword,`<b style="color:red" >${keyword}</b>`) }}></span>
                            <span style={{
                                fontSize: 12,
                                color: border,
                                fontFamily:'IRANYekanRegular',
                            }} dangerouslySetInnerHTML={{ __html: (Name+' طبقه '+FloorNumber+' واحد '+UnitNumber).replaceAll(keyword,`<b style="color:red" >${keyword}</b>`) }}></span>
                    </View>

                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <span style={{fontSize: 14, color: black,}} dangerouslySetInnerHTML={{ __html: (TagTwo+' '+TagCharacter+' '+TagOne).replaceAll(keyword,`<b style="color:red" >${keyword}</b>`) }}></span>
                            <span style={{fontSize: 13, color: black,}} dangerouslySetInnerHTML={{ __html:'ایران '+ TagIran.replaceAll(keyword,`<b style="color:red" >${keyword}</b>`) }}></span>
                    </View>
                </View>
            </TouchableOpacity>

        );
    }
}


class Plaque extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tagIran: '',
            tagTwo: '',
            tagCharacterSelected: null,
            tagOne: '',
            tagCharacterList: [],
        };

    }

    componentDidMount() {
        getCarTagCharacterQuery()
            .then(result => {

                result.splice(0,0,{ID:'...'})
                this.setState({tagCharacterList: result});
            })
            .catch(e => globalState.showToastCard())
    }

    onChangeTagOne = (text) => {
        this.setState({tagOne: inputNumberValidation(text, this.state.tagOne, /[\d-]+$/)});
        this.props.onChangeValue(text, this.state.tagCharacterSelected, this.state.tagTwo, this.state.tagIran);
    }
    onTagCharaterChange = (item) => {
        this.setState({tagCharacterSelected: item,});
        this.props.onChangeValue(this.state.tagOne, item, this.state.tagTwo, this.state.tagIran);
    }
    onChangeTagTwo = (text) => {
        this.setState({tagTwo: inputNumberValidation(text, this.state.tagTwo, /[\d-]+$/)});
        this.props.onChangeValue(this.state.tagOne, this.state.tagCharacterSelected, text, this.state.tagIran);
    }
    onChangeTagIran = (text) => {
        this.setState({tagIran: inputNumberValidation(text, this.state.tagIran, /[\d-]+$/)});
        this.props.onChangeValue(this.state.tagOne, this.state.tagCharacterSelected, this.state.tagTwo, text);
    }


    render() {
        const {} = this.props;
        return (


            <View style={{
                flexDirection: 'row',
                padding: 3,
                flex: 1,
                justifyContent: 'center',
                //backgroundColor:primaryDark,
                //borderWidth:1,
            }}>

                <View style={{
                    flex: 2,
                    marginRight: 15,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: borderSeparate,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                    paddingVertical: 0,
                    backgroundColor: '#fff',

                }}>

                    <FloatingLabelTextInput
                        ref="textInput"
                        multiline={false}
                        maxLength={2}
                        keyboardType='number-pad'
                        numberOfLines={1}
                        returnKeyType="done"
                        floatingLabelEnable={false}
                        textInputStyle={{
                            fontSize: 14,
                            fontFamily:'IRANYekanFaNum-Bold',
                            color: 'black',
                            textAlign: 'center',

                        }}
                        underlineSize={1}

                        placeholder='ایران'
                        style={{flex: 1}}
                        onChangeText={text => this.onChangeTagIran(text)}
                        highlightColor={primaryDark}
                        value={this.state.tagIran}
                    />
                </View>


                <View style={{
                    flex: 1.3,
                    marginRight: 5,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: borderSeparate,
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    paddingHorizontal: 5,
                    paddingVertical: 0,
                    backgroundColor: '#fff',

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

                        textInputStyle={{
                            fontSize: 14,
                            fontFamily:'IRANYekanFaNum-Bold',
                            color: 'black',
                            textAlign: 'center',

                        }}
                        underlineSize={1}

                        placeholder=''
                        //style={{marginTop:23}}
                        onChangeText={text => this.onChangeTagTwo(text)}
                        highlightColor={primaryDark}
                        value={this.state.tagTwo}
                    />
                </View>
                <ListDialogPopUp
                    //style={{marginRight: 5, flex: 2}}
                    title={'انتخاب حرف'}
                    snake
                    dialogOpacity={0}
                    onClose={this.props.onClose && this.props.onClose() }
                    height={height / 2}
                    searchField={"ID"}
                    items={this.state.tagCharacterList}
                    selectedItem={this.state.tagCharacterSelected}
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
                                    fontSize: 14,
                                    fontFamily:'IRANYekanFaNum-Bold',
                                }}>
                                {this.state.tagCharacterSelected
                                    ? this.state.tagCharacterSelected.ID
                                    : 'حرف'}
                            </Text>
                        </View>
                    }
                    onValueChange={item => this.onTagCharaterChange(item)}
                    itemComponent={(item,index) => (
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
                    borderColor: borderSeparate,
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    paddingHorizontal: 5,
                    paddingVertical: 0,
                    backgroundColor: '#fff',

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

                        textInputStyle={{
                            fontSize: 14,
                            fontFamily:'IRANYekanFaNum-Bold',
                            color: 'black',
                            textAlign: 'center',

                        }}
                        underlineSize={1}
                        placeholder=''
                        style={{}}
                        onChangeText={text => this.onChangeTagOne(text)}
                        highlightColor={primaryDark}
                        value={this.state.tagOne}
                    />
                </View>

            </View>


        );
    }
}
class UnitSelector extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedUnit: null,
            units: [],
            users:[]
        };

    }
    async componentDidMount() {
        console.warn("^^^^^^^ PayAdmin componentDidMount");
        this.getUsers();
    }

    async getUsers(mobile = null, name = null, unitNumber = null) {
        this.setState({loading: true, loadingMessage: 'در حال دریافت ...'});
        await searchUserQuery(mobile, name, unitNumber)
            .then(result => {

                this.setState({units: result.sort((a, b)=>{return a.UnitNumber - b.UnitNumber})});

            })
            .catch(e => null)
            .finally(() => this.setState({loading: false}));
    }

    onSelectUnit = (item) => {
        this.setState({selectedUnit: item,});
        this.props.onChangeValue(item);
    }


    render() {
        const {} = this.props;
        return (
            <ListDialogPopUp
                dialogVisible={true}
                title={'انتخاب ساکن/ واحد'}
                snake
                dialogOpacity={0}
                height={height / 2}
                searchField={"Name"}
                items={this.state.units}
                selectedItem={this.state.selectedUnit}
                selectedItemCustom={
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>


                        <Text
                            style={{
                                fontSize: 14,
                                fontFamily:'IRANYekanFaNum-Bold',
                            }}>
                            {this.state.selectedUnit
                                ? 'واحد '+ this.state.selectedUnit.UnitNumber+' ('+this.state.selectedUnit.Name+')'
                                : 'انتخاب ساکن/ واحد'}
                        </Text>
                    </View>
                }
                onValueChange={item => this.onSelectUnit(item)}
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
                            {'واحد '+item.UnitNumber+' ('+item.Name+')'}
                        </Text>

                    </View>
                )}
            />

        );
    }
}



export default class AllCar extends PureComponent {
    constructor() {
        super();
        this.allCars = [];
        this.searchItems = [
            {Name: 'جستجو', codeName: 'AllProps',placeholder:'مدل، برند، رنگ، پلاک، مالک، طبقه یا شماره واحد را وارد کنید'},
            {Name: 'نام ماشین', codeName: 'ModelName',placeholder:'مدل ماشین را وارد کنید.'},
            {Name: 'برند ماشین', codeName: 'BrandName',placeholder:'برند ماشین را وارد کنید.'},
            {Name: 'پلاک', codeName: 'TagTwo', component: <Plaque onChangeValue={this.onPlaqueSearch}/>},
            {Name: 'واحد/ساکن', codeName: 'Name' ,component: <UnitSelector onChangeValue={this.onUnitSelect}/>},
            {Name: ' واحد', codeName: 'UnitNumber' ,number:true,placeholder:'شماره واحد را وارد کنید.'},
            {Name: 'طبقه', codeName: 'FloorNumber' ,number:true ,placeholder:'شماره طبقه را وارد کنید.'},

        ];
        this.state = {
            showOverlay: false,
            showDeletePopUp: false,
            showEditPopUp: false,
            goToAddCarScreen: false,
            nominatedToDeleteItem: null,
            nominateToEditItem: null,
            loading: false,
            loadingMessage: '',
            permission: userStore.findPermission(permissionId.allCar),
            idSwipeOpened: -1,
            cars: [],
            isFabVisible: true,
            searchItem: this.searchItems[0],
            showSearchType: false,
            showSortType: false,
        };
        console.log('state',this.state);
        setTimeout(()=> this.state.permission= userStore.findPermission(permissionId.allCar),100)
    }

    changeSearchType(item) {
        this.setState({searchItem: item},
            () => this.searchCar(this.state.searchText));
    }

    onPlaqueSearch = (tagOne, tagCharacter, tagTwo, tagIran) => {
        const searchedProcess = this.allCars.filter(item => {
            let isInSearch = true;
            if (tagOne && item.TagOne.search(tagOne) == -1) isInSearch = false;
            if (tagCharacter && item.TagCharacter.search(tagCharacter.ID) == -1) isInSearch = false;
            if (tagTwo && item.TagTwo.search(tagTwo) == -1) isInSearch = false;
            if (tagIran && item.TagIran.search(tagIran) == -1) isInSearch = false;
            if (isInSearch) return item;
        });
        this.setState({cars: searchedProcess});
    }
    onUnitSelect = (unit) => {
        const searchedProcess = this.allCars.filter(item => {
            if (item.UnitNumber==unit.UnitNumber) return item;
        });
        this.setState({cars: searchedProcess});
    }
    searchCar(text) {
        if (text) {
            text = mapNumbersToEnglish(text);
            this.setState({searchText: text});
            let key = this.state.searchItem ? this.state.searchItem.codeName : ''; //Object.keys(this.state.searchItem)[0];
            let searchedProcess=[];
            if(this.state.searchItem.number)
                searchedProcess = this.allCars.filter(item => {
                    const itemData = `${item[key]}`;
                    if(!text) return true;
                    return itemData==Number(text);
                });
            else
                searchedProcess = this.allCars.filter(item => {
                    const itemData = `${item[key]}`;
                    if(!text) return true;
                    return itemData.indexOf(text) > -1;
                });


            this.setState({cars: searchedProcess});
        } else {
            this.setState({cars: this.allCars, searchText: ''});
        }
    }

    onBackPressed() {
        //window.history.back();
        Router.back();
    }

    goToUnitCars = (UnitID,RoleID, UnitNumber, Name) => {
        Router.push({
            pathname: '/car/CarsUnit',
            query: {UnitID: UnitID,RoleID:RoleID, UnitNumber: UnitNumber, UserName: Name},
            ctx:{params: { id: "first" }} ,
             params:{ id: "first" }
        })
        //this.props.navigation.navigate('CarsUnit', {UnitID: UnitID,RoleID:RoleID, UnitNumber: UnitNumber, UserName: Name});
    }

    componentDidMount() {
       setTimeout(()=>this.getCars(),5)
    }
    renderClientTag(keyword){
        let words=['Coffee is good','Tea is good','Milk is good','Coffee is good','Tea is good','Milk is good']
        return (
            <ul id={'ul_11'}>
                {
                    words.map(w=>{
                      return  <li dangerouslySetInnerHTML={{ __html: w.replaceAll(keyword,`<b style="color:red" >${keyword}</b>`) }}></li>
                    })
                }

            </ul>
        )
    }

    render() {

        const toolbarStyle = {
            start: {
                onPress: this.onBackPressed.bind(this),
                content: images.ic_back,
            },
            title: 'ماشین های ساختمان',
            search: {
                onPressType: () => this.setState({showSearchType: true}),
                onTextChange: text => this.searchCar(text),
                component: this.state.searchItem.component,
                typeName: this.state.searchItem.Name,
                number: this.state.searchItem.number?true:false,
                placeholder:this.state.searchItem.placeholder?this.state.searchItem.placeholder:''
            },

        };
        console.log('permission',this.state.permission);

        return (
            <MobileLayout style={{padding:0}} title={`ماشین های ساختمان`}>
                <Toolbar customStyle={toolbarStyle}/>
                <SnakePopup
                    visible={this.state.showSearchType}
                    toolbarTitle="جستجو بر اساس"
                    items={this.searchItems}
                    onItemSelected={item => {
                        this.changeSearchType(item);
                        this.setState({showSearchType: false});
                    }}
                    onClose={() => this.setState({showSearchType: false})}
                    fromTop={60}
                />


                <View style={{flex: 1, backgroundColor: '#F5F1F1'}}>

                    <FlatList
                        data={this.state.cars}
                        extraData={this.state.idSwipeOpened}
                        onScroll={this.onScrollFab}
                        loading={this.state.loading}
                        ListEmptyComponent={
                            <View
                                style={{
                                    height: global.height-70,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor:bgEmpty
                                }}>
                                <Image
                                    source={images.es_accounts}
                                    style={{width: global.width, height: global.height/2}}
                                />
                                {this.state.permission && this.state.permission.writeAccess && (
                                    <Text
                                        style={{
                                            fontFamily:'IRANYekanExtraBold',
                                            fontSize: 18,
                                            textAlign: 'center',
                                        }}>
                                        ماشینی وجود ندارد
                                    </Text>
                                )}
                            </View>
                        }
                        renderItem={({item, index}) =>{
                            return  (
                                <CarItem
                                    item={item}
                                    keyword={this.state.searchText}
                                    onPressItem={() => this.goToUnitCars(item.UnitID,item.RoleID, item.UnitNumber, item.Name,item.UnitID)}
                                />
                            )
                        }}
                    />
                </View>
            </MobileLayout>
        );
    }

    onBackPress() {
        Router.back();
    }
    async getCars() {
        this.setState({loading: true, loadingMessage: 'در حال دریافت ...'});
        await getUnitCarQuery(null,true)
            .then(result => {
                this.allCars = result.map(item=>{item.AllProps=item.BrandName.trim()+' '+item.ModelName.trim()+' '+item.ColorName.trim()+' '+item.Name.trim()+' ایران '+item.TagIran.trim()+' '+item.TagTwo.trim()+' '+item.TagCharacter.trim()+' '+item.TagOne.trim()+' '+item.UnitNumber.trim()+' '+item.FloorNumber.trim(); return item});
                console.log('cc',this.allCars);
                this.setState({loading: false, cars: this.allCars});
            })
            .catch(e => {
                globalState.showToastCard();
                this.setState({loading: false});
            });
    }
}
