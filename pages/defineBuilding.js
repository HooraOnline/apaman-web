import MobileLayout from "../src/components/layouts/MobileLayout";
import {View, TouchableOpacity,Text} from "../src/react-native";
import {AndroidBackButton, FloatingLabelTextInput, Toolbar, ListDialogPopUp} from "../src/components";
import React from "react";
import images from "../public/static/assets/images";
import {navigation,waitForData} from "../src/utils";
import {Router} from "next/router";
import {
    getEnumBuildingType,
    getEnumSubRegion,
    getEnumCurrency,
    getEnumProvince,
    getEnumCity,
    defineBuildingQuery,
    getSelectBuilding,
    getBuildingWithID,
} from '../src/network/Queries';
import userStore from "../src/stores/User";
class DefineBuilding extends React.Component{
    constructor(props){
        super(props);
        this.state={
            ID:null,
            Name:null,
            Currency: {ID:"IRR",Name:"ریال"},
            currencyList:[],
            ConstructionYear:null,
            NumberOfFloors:null,
            NumberOfUnits:null,
            CityID:null,
            cityList:[],
            Province:{ID:7,Name:"تهران"},
            provinceList:[],
            Region:null,
            subRegionList:[],
            SubRegion:{ID:null,Name:null},
            BuildingTypeList:[],
            BuildingType:{ID:1,Name:"ساختمان مسکونی"},
            BuildingInformation:{},
            Address:null,
            PostalCode:null,
            Errors:{}
        }
    }
    static async getInitialProps(context){
        var a=navigation.encodeParams(context.query.params)
        return {Path:context.pathname,Query:a}
    }
    getProvinceCity(e){
        this.setState({Province:{ID:e.ID,Name:e.Name}})
        getEnumCity(e.ID ).then(res=>{
            this.setState({
                cityList:res,
            })
        })
    }
    getSubRegion(e){
        this.setState({CityID:{ID:e.ID,Name:e.Name}})
        getEnumSubRegion(e.ID).then(res=>this.setState({subRegionList:res}))
    }
    componentDidMount() {
        var buildingID=navigation.getParam("buildingID")
        waitForData(()=>{
            if (buildingID) {
                getBuildingWithID(buildingID,15,userStore.RoleID,userStore.userID).then(res=>this.setState( {
                    ID: `${res[0].ID}`,
                    Name: `${res[0].Name}`,
                    BuildingTypeID:`${res[0].BuildingTypeID}`,
                    ProvinceID:`${res[0].ProvinceID}`,
                    CityID:`${res[0].CityID}`,
                    Region:`${res[0].Region}`,
                    SubRegionID:`${res[0].SubRegionID}`,
                    Address:`${res[0].Address}`,
                    PostalCode:`${res[0].PostalCode}`,
                    NumberOfFloors: `${res[0].NumberOfFloors}`,
                    NumberOfUnits: `${res[0].NumberOfUnits}`,
                    CurrencyID: {ID:`${res[0].CurrencyID}`},
                    ConstructionYear: `${res[0].ConstructionYear}`,
                } ))
            }
            getEnumBuildingType()
                .then(result =>this.setState({BuildingTypeList: result}))
            getEnumProvince()
                .then(result =>this.setState({provinceList: result}))
            getEnumCurrency()
                .then(result =>this.setState({currencyList: result}))
            getEnumCity(7).then(res=>{
                this.setState({
                    cityList:res,
                })
            })
            var a=this.state.provinceList.filter(val=>val.ID===this.state.ProvinceID)
            console.log(a,'HEEEELOLLOLOLO')
        })
    }
    sendToDb=async()=>{
        await this.setState({
            Errors: {
                Name:"لطفا نام ساختمان را وارد کنید",
                NumberOfFloors:"لطفاْ تعداد طبقات را وارد کنید",
                NumberOfUnits:"لطفاْ تعداد واحدها را وارد کنید",
                Region:"لطفاْ منطقه را وارد کنید",
                Province:"لطفاْ استان را وارد کنید",
                CityID:"لطفاْ شهر را وارد کنید",
                PostalCode:"لطفاْ کد پستی را وارد کنید",
                Currency:"لطفاْ واحد پول را وارد کنید",
                Address:"لطفاْ آدرس را وارد کنید",
            }
        })
        if(Object.keys(this.state.Errors).length===0) {
            await this.setState( {
                BuildingInformation: {
                    ID:this.state.ID,
                    Name: this.state.Name,
                    BuildingTypeID: this.state.BuildingType.ID,
                    ProvinceID:this.state.Province.ID,
                    CityID: this.state.CityID.ID,
                    Region: this.state.Region,
                    SubRegionID: this.state.SubRegion.ID,
                    Address: this.state.Address,
                    PostalCode: this.state.PostalCode,
                    NumberOfFloors: this.state.NumberOfFloors,
                    NumberOfUnits: this.state.NumberOfUnits,
                    ConstructionYear: this.state.ConstructionYear,
                    CurrencyID: this.state.Currency.ID,
                    CallerFormID: 15,
                    CallerRoleID: userStore.RoleID,
                    CallerUserID: userStore.userID,
                }
            } )
            defineBuildingQuery(this.state.BuildingInformation)
            console.log(this.state.BuildingInformation)
            navigation.navigate('/myBuilding')
        }
    }
    onBackPress() {
        navigation.goBack('/');
    }
    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'تعریف ساختمان',
        };
        return(
            <MobileLayout
                title={`تعریف ساختمان`}>
                <Toolbar customStyle={toolbarStyle}>
                    <AndroidBackButton
                        onPress={() => {
                            if (
                                this.state.showAddNewLabelPopUp ||
                                this.state.showEditPopUp
                            ) {
                                this.setState({
                                    showAddNewLabelPopUp: false,
                                    showOverlay: false,
                                    showEditPopUp: false,
                                    nominateToEditItem: null,
                                });
                            } else if (this.state.showDeletePopUp) {
                                this.setState({
                                    showOverlay: false,
                                    showDeletePopUp: false,
                                    nominatedToDeleteItem: null,
                                });
                            } else {
                                this.onBackPress();
                            }
                            return true;
                        }}
                    />
                </Toolbar>
                <View style={{width:'95%',margin:'0 auto'}}>
                    <View style={{display:'flex',flexDirection:'row',marginTop:5}}>
                        <View style={{width:"50%",marginLeft:"10%"}}>
                            <FloatingLabelTextInput
                                style={{direction:'rtl',marginTop:8,width:'100%'}}
                                laberStyle={{marginLeft: "-25%"}}
                                value={this.state.Name}
                                onChange={(e)=>this.setState({Name:e.target.value})}
                                label="نام ساختمان"
                            />
                            <p className="validation_Error">{this.state.Name===null ? this.state.Errors.Name : delete this.state.Errors.Name}</p>
                        </View>
                        <View style={{width:"50%"}}>
                            <FloatingLabelTextInput
                                style={{direction:'rtl',marginTop:8,width:'100%'}}
                                laberStyle={{marginLeft: "-25%"}}
                                value={this.state.ConstructionYear}
                                onChange={(e)=>this.setState({ConstructionYear:e.target.value})}
                                label="سال ساخت"
                                type="number"
                            />
                        </View>
                    </View>
                    <View style={{display:'flex',flexDirection:'row',marginTop:15}}>
                        <View style={{width:"50%",marginLeft:"10%"}}>
                            <FloatingLabelTextInput
                                style={{direction:'rtl',marginTop:8,width:'100%'}}
                                label="تعداد طبقات"
                                value={this.state.NumberOfFloors}
                                onChange={(e)=>this.setState({NumberOfFloors:e.target.value})}
                                type="number"
                                laberStyle={{marginLeft: "-25%"}}
                                maxLength={3}/>
                            <p className="validation_Error">{this.state.NumberOfFloors===null ? this.state.Errors.NumberOfFloors : delete this.state.Errors.NumberOfFloors}</p>
                        </View>
                        <View style={{width:"50%"}}>
                            <FloatingLabelTextInput
                                style={{direction:'rtl',marginTop:8,width:'100%'}}
                                value={this.state.NumberOfUnits}
                                onChange={(e)=>this.setState({NumberOfUnits:e.target.value})}
                                laberStyle={{marginLeft: "-25%"}}
                                label="تعداد واحدها"
                                type="number"
                            />
                            <p className="validation_Error">{this.state.NumberOfUnits===null ? this.state.Errors.NumberOfUnits : delete this.state.Errors.NumberOfUnits}</p>
                        </View>
                    </View>
                    <View style={{display:'flex',flexDirection:'row',marginTop:15}}>
                        <View style={{width:"50%",marginLeft:"10%"}}>
                            <ListDialogPopUp
                                snake

                                items={this.state.BuildingTypeList}
                                selectedItem={this.state.BuildingType.ID}
                                onValueChange={(e)=>this.setState({BuildingType: {ID:e.ID,Name:e.PersianName}})}
                                selectedItemCustom={
                                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                        <Text
                                            style={{
                                                padding:10,
                                                marginTop:8,
                                            }}>
                                            {this.state.BuildingType.ID===null ? "نوع ساختمان":this.state.BuildingType.Name}
                                        </Text>
                                    </View>
                                }
                                itemComponent={item => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 8,
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                paddingVertical: 16,
                                                alignSelf: 'flex-start',
                                            }}>
                                            {item.PersianName}
                                        </Text>
                                    </View>
                                )}
                            />
                            <p className="validation_Error">{this.state.BuildingType.ID===null ? this.state.Errors.BuildingType :  delete this.state.Errors.BuildingTypeID}</p>
                        </View>
                        <View style={{width:'50%'}}>
                            <ListDialogPopUp
                                snake
                                items={this.state.currencyList}
                                selectedItem={this.state.Currency.ID}
                                onValueChange={(e)=>this.setState({Currency:{ID:e.ID,Name:e.Name}})}
                                selectedItemCustom={
                                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                        <Text
                                            style={{
                                                padding:10,
                                                marginTop:8,
                                            }}>
                                            {this.state.Currency.ID===null ? "واحد پول":this.state.Currency.Name}
                                        </Text>
                                    </View>
                                }
                                itemComponent={item => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 8,
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                paddingVertical: 16,
                                                alignSelf: 'flex-start',
                                            }}>
                                            {item.Name}
                                        </Text>
                                    </View>
                                )}
                            />
                            <p className="validation_Error">{this.state.Currency.ID===null ? this.state.Errors.Currency : delete this.state.Errors.Currency}</p>
                        </View>
                    </View>
                    <View style={{display:'flex',flexDirection:'row',marginTop:15}}>
                        <View style={{width:"50%",marginLeft:"10%"}}>
                            <ListDialogPopUp
                                snake
                                items={this.state.provinceList}
                                selectedItem={this.state.provinceList}
                                onValueChange={(e)=>this.getProvinceCity(e)}
                                selectedItemCustom={
                                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                        <Text
                                            style={{
                                                padding:10,
                                                marginTop:8,
                                            }}>
                                            {this.state.Province.ID===null ? "استان":this.state.Province.Name}
                                        </Text>
                                    </View>
                                }
                                itemComponent={item => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 8,
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                paddingVertical: 16,
                                                alignSelf: 'flex-start',
                                            }}>
                                            {item.Name}
                                        </Text>
                                    </View>
                                )}
                            />
                            <p className="validation_Error">{this.state.Province.ID===null ? this.state.Errors.Province :  delete this.state.Errors.Province}</p>
                        </View>
                        {this.state.Province.ID !== null &&
                        <View style={{width: '50%'}}>
                            <ListDialogPopUp
                                snake
                                items={this.state.cityList}
                                selectedItem={this.state.cityList}
                                onValueChange={(e) => this.getSubRegion( e )}
                                selectedItemCustom={
                                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                        <Text
                                            style={{
                                                padding: 10,
                                                marginTop: 8,
                                            }}>
                                            {this.state.CityID === null ? "شهر" : this.state.CityID.Name}
                                        </Text>
                                    </View>
                                }
                                itemComponent={item => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 8,
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                paddingVertical: 16,
                                                alignSelf: 'flex-start',
                                            }}>
                                            {item.Name}
                                        </Text>
                                    </View>
                                )}
                            />
                            <p className="validation_Error">{this.state.CityID === null ? this.state.Errors.CityID : delete this.state.Errors.CityID}</p>
                        </View>
                        }
                    </View>
                    <View style={{display:'flex',flexDirection:'row',marginTop:15}}>
                        <View style={{width:'50%'}}>
                            <FloatingLabelTextInput
                                style={{direction:'rtl',marginTop:14,marginLeft:'-14%'}}
                                laberStyle={{marginLeft: "-12%",marginTop:'2%'}}
                                value={this.state.Region}
                                onChange={(e)=>this.setState({Region:e.target.value})}
                                type="number"
                                label="منطقه"
                            />
                            <p className="validation_Error">{this.state.Region===null ? this.state.Errors.Region : delete this.state.Errors.Region}</p>
                        </View>
                        {this.state.CityID !== null &&
                        <View style={{width:"50%",marginRight:'10%'}}>
                            <ListDialogPopUp
                                snake
                                items={this.state.subRegionList}
                                selectedItem={this.state.subRegionList}
                                onValueChange={(e) => this.setState( {SubRegion: {ID: e.ID, Name: e.Name}} )}
                                selectedItemCustom={
                                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                        <Text
                                            style={{
                                                padding: 10,
                                                marginTop: 8,
                                            }}>
                                            {this.state.SubRegion.ID === null ? "ناحیه" : this.state.SubRegion.Name}

                                        </Text>
                                    </View>
                                }
                                itemComponent={item => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 8,
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                paddingVertical: 16,
                                                alignSelf: 'flex-start',
                                            }}>
                                            {item.Name}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>
                        }

                    </View>
                    <View>
                        <FloatingLabelTextInput
                            style={{direction:'rtl',marginTop:14,marginLeft:10,width:'100%'}}
                            onChange={(e)=>this.setState({Address:e.target.value})}
                            value={this.state.Address}
                            laberStyle={{marginLeft: "-5%",marginTop:'2%'}}
                            label="آدرس"
                        />
                        <p className="validation_Error">{this.state.Address===null ? this.state.Errors.Address : delete this.state.Errors.Address}</p>
                    </View>
                    <View>
                        <FloatingLabelTextInput
                            style={{direction:'rtl',marginTop:8,width:'100%'}}
                            value={this.state.PostalCode}
                            onChange={(e)=>this.setState({PostalCode:e.target.value})}
                            label="کد پستی"
                            maxLength={10}
                            laberStyle={{marginLeft: "-8%"}}
                        />
                        <p className="validation_Error">{this.state.PostalCode===null ? this.state.Errors.PostalCode : delete this.state.Errors.PostalCode}</p>
                    </View>
                    <TouchableOpacity style={{
                        position:'absolute',
                        bottom:0,
                        width:'97.5%',
                        maxWidth:'100%',
                        height:'5%  ',
                        fontSize:20,
                        color:'rgb(255, 255, 255)',
                        textAlign:"center",
                        padding:'1%',
                        backgroundColor:'rgb(234, 69, 35)'}}
                                      onPress={()=>this.sendToDb()}
                    >
                        ثبت ساختمان
                    </TouchableOpacity>
                </View>
                <style jsx>{`
              .validation_Error{
              color:red;
              margin-top:2%;
              }
              `}</style>
            </MobileLayout>
        )
    }
}
export default DefineBuilding;
