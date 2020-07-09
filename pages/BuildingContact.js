import React from "react";
import images from "../public/static/assets/images";
import MobileLayout from "../src/components/layouts/MobileLayout";
import {AndroidBackButton, FloatingLabelTextInput, Toolbar} from "../src/components";
import {navigation, waitForData} from "../src/utils";
import {TouchableOpacity, View} from "../src/react-native";
import {addContactsInformationQuery, getContactType, getNewLobbyQuery} from "../src/network/Queries";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {userStore} from "../src/stores";
import {persistStore} from "../src/stores";
class BuildingContact  extends React.Component {
    constructor(props) {
        super( props );
        this.state={
            typeList:[],
            DataList:[],
            valueOfField:null,
            idOfField:null,
            Errors:null,
            mergeArray:[],
            contactInformation:{
                Data:[],
                getData:[],
                BuildingID:userStore.BuildingID,
                CallerFormID:persistStore.curentFormId,
                CallerBuildingID:userStore.BuildingID || null,
                CallerUnitID:userStore.UnitID,
                CallerRoleID:userStore.RoleID,
                CallerUserID:userStore.userID,
            }
        }
    }
    componentDidMount() {
        waitForData(async ()=>{
            console.log(navigation.getParam("buildingID"))
            userStore.BuildingID=navigation.getParam("buildingID") || userStore.BuildingID
            this.setState({
                contactInformation:{
                    Data:[],
                    getData:[],
                    BuildingID:navigation.getParam("buildingID") || userStore.BuildingID,
                    CallerFormID:persistStore.curentFormId,
                    CallerBuildingID:userStore.BuildingID,
                    CallerUnitID:userStore.UnitID,
                    CallerRoleID:userStore.RoleID,
                    CallerUserID:userStore.userID,
                }
            })
            await getNewLobbyQuery().then(res=> {
                this.setState( {
                    DataList: res,
                } );
            }).finally(()=>{
                for (let i = 0; i <this.state.DataList.length ; i++) {
                    if(this.state.DataList[i].BuildingContactTypeID!=="0") {
                        this.setState( {
                                mergeArray: [...this.state.mergeArray, this.state.DataList[i]],
                                contactInformation: {
                                    ...this.state.contactInformation,
                                    Data: [
                                        ...this.state.contactInformation.Data,
                                        {
                                            BuildingContactTypeID: this.state.DataList[i].BuildingContactTypeID,
                                            BuildingContactTypeValue: this.state.DataList[i].Value,
                                        }
                                    ]
                                }
                            },
                        )
                    }
                }
            })
            await getContactType().then(res=> {
                this.setState( {typeList: res} );
            }).finally(()=>{
                for (let i = 0; i <this.state.typeList.length ; i++) {
                    for (let j=0;j<this.state.DataList.length;j++ ) {
                        if (this.state.typeList[i] === undefined || this.state.DataList[j] === undefined) {
                            break
                        }
                        if(this.state.typeList[i].ID===this.state.DataList[j].BuildingContactTypeID){
                            delete this.state.typeList[i]
                        }
                    }
                    if(this.state.typeList[i]!==undefined) {
                        this.setState( {
                            mergeArray: [...this.state.mergeArray,this.state.typeList[i]]
                        } )
                    }
                }
            })
        })
    }
    onBackPress() {
        navigation.goBack( '/main' );
    }
    sendToDB=async ()=>{
        console.log(this.state.contactInformation)
        if(this.state.contactInformation.Data.length>0) {
            this.setState({
                Errors:null,
            })
            //addContactsInformationQuery( this.state.contactInformation )
        }else{
            this.setState({
                Errors:'پر کردن حداقل یک فیلد اجباری است',
            })
        }
    }
    addChild(index,val){
        this.setState({
            mergeArray:[...this.state.mergeArray,{BuildingContactTypeID:val.BuildingContactTypeID|| val.ID,Name:val.Name,PersianName:val.PersianName}]
        })
    }
    addToData(val,e,index){
        if(val.SortOrder){
            this.state.contactInformation.Data[index].BuildingContactTypeID = val.BuildingContactTypeID || val.ID;
            this.state.contactInformation.Data[index].BuildingContactTypeValue = e.target.value || val.Value;
        }else if (!val.SortOrder && this.state.valueOfField!==null){
            this.setState( {
                contactInformation: {
                    ...this.state.contactInformation,
                    Data: [
                        ...this.state.contactInformation.Data,
                        {
                            BuildingContactTypeID: this.state.idOfField || val.ID,
                            BuildingContactTypeValue: this.state.valueOfField,
                        }
                    ]
                },
                idOfField: null,
                valueOfField: null,
                Errors:null,
            } )
        }
    }
    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind( this ),
                content: images.ic_back,
            },
            title: 'اطلاعات تماس',
        };
        return (
            <MobileLayout title={`اطلاعات تماس`}
                          header={<Toolbar customStyle={toolbarStyle}/>}
                          footer={ <TouchableOpacity style={{
                              width:'100%',
                              maxWidth:'100%',
                              fontSize:20,
                              color:'rgb(255, 255, 255)',
                              textAlign:"center",
                              padding:'1%',
                              backgroundColor:'rgb(234, 69, 35)'}}
                                                     onPress={()=>this.sendToDB()}
                          >
                              ثبت اطلاعات
                          </TouchableOpacity>}
            >
                <AndroidBackButton
                    onPress={() => {
                        if (
                            this.state.showAddNewLabelPopUp ||
                            this.state.showEditPopUp
                        ) {
                            this.setState( {
                                showAddNewLabelPopUp: false,
                                showOverlay: false,
                                showEditPopUp: false,
                                nominateToEditItem: null,
                            } );
                        } else if (this.state.showDeletePopUp) {
                            this.setState( {
                                showOverlay: false,
                                showDeletePopUp: false,
                                nominatedToDeleteItem: null,
                            } );
                        } else {
                            this.onBackPress();
                        }
                        return true;
                    }}
                />
                <View style={{backgroundColor:'rgb(245, 241, 241)'}}>
                    {this.state.mergeArray.map((val,index)=>
                        <View
                            key={index}
                            style={{direction:'rtl',marginTop:8,width:'100%',marginBottom:10,marginRight:'0%'}}
                            onBlur={(e)=>this.addToData(val,e,index)}
                        >
                            <FloatingLabelTextInput
                                Adornment={
                                    <div >
                                        <Fab onClick={(e)=>this.addChild(index,val)} size="small" aria-label="add" style={{marginBottom:'50%',backgroundColor:'#ffc107',color:'white'}}>
                                            <AddIcon />
                                        </Fab>
                                    </div>}
                                style={{marginTop:7}}
                                value={val.Value ? val.Value : null }
                                onChange={(e)=>{this.setState({
                                    idOfField:val.BuildingContactTypeID || val.ID,
                                    valueOfField:e.target.value,
                                });val.Value=e.target.value}}
                                label={`${val.PersianName}`}
                            />
                        </View>
                    )}
                    {this.state.Error!==null && <p style={{color:'red',fontSize:15,textAlign:'center',marginTop:25}}>
                        {this.state.Errors}
                    </p>}
                </View>
            </MobileLayout>
        )
    }
}
export default BuildingContact;