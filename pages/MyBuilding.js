import MobileLayout from "../src/components/layouts/MobileLayout";
import {AndroidBackButton, Fab, Toolbar} from "../src/components";
import React from "react";
import images from "../public/static/assets/images";
import {navigation, waitForData} from "../src/utils";
import {Animated, Platform, Text, TouchableOpacity, View} from "../src/react-native";
import {drawerItem} from "../src/constants/colors";
import Router from "next/router";
import {defineBuildingQuery, getBuildingWithID, getSelectBuilding} from "../src/network/Queries";
import jMoment from 'moment-jalaali';
import userStore from "../src/stores/User";
import LoadingPopUp from "../src/components/LoadingPopUp";
import {globalState} from "../src/stores";
import CircularProgress from '@material-ui/core/CircularProgress';

class MyBuilding  extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            buildingList:[],
            buildingInformation:{},
            loading:false,
            loadingMessage:'در حال دریافت جزئیات ...',
            actionLoading:false
        }
    }
    onBackPress() {
        navigation.goBack('/main');
    }
    async getAllBuilding(){
        await getSelectBuilding(userStore.userID, 15, userStore.RoleID).then(res=>this.setState({
            loading:true,
            buildingList:res
        }))
            .catch(e => globalState.showToastCard())
        this.setState({loading:false})

    }
    async disabledApartment(id){
        await this.setState({
            buildingInformation:{
                CallerUserID:userStore.userID,
                CallerRoleID:userStore.RoleID,
                CallerFormID:15,
                IsDisabled:true,
                ID:id,
            },
            actionLoading: {ID:id,loading:true}
        })
        await defineBuildingQuery(this.state.buildingInformation).finally(()=>this.getAllBuilding())
        this.setState({actionLoading:{ID:id,loading:false}})
    }
    async activeApartment(id){
        await this.setState({
            buildingInformation:{
                CallerUserID:userStore.userID,
                CallerRoleID:userStore.RoleID,
                CallerFormID:15,
                IsActivate:true,
                ID:id,
            },
            actionLoading: {ID:id,loading:true}
        })
        await defineBuildingQuery(this.state.buildingInformation).finally(()=>this.getAllBuilding())
        this.setState({actionLoading:{ID:id,loading:false}})
    }
    componentDidMount() {
        waitForData(()=>{
                this.getAllBuilding()
            },
        )
    }
    render(){
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: ' ساختمان من',
        };
        return (
            <MobileLayout title={`ساختمان من`} style={{height:'100%',maxHeight:"100%",overflow:"scroll"}}
                          header={ <Toolbar customStyle={toolbarStyle}/>}
            >
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
                <Animated.View
                    style={{
                        flex: 1,
                        elevation: 1,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.5,
                        width:'100%',

                    }}>
                    {this.state.buildingList.length>0 ?this.state.buildingList.map((val,index)=>
                            <View
                                key={index}
                                style={val.IsDisabled===true ?{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 10,
                                    backgroundColor: '#ddd',
                                    margin:'1%',
                                }:{paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 10,
                                    margin:'1%',
                                    backgroundColor: 'white'}}>
                                <LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage}/>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                        <Text
                                            style={{
                                                cursor: 'text',
                                                fontFamily:
                                                    Platform.OS === 'ios'
                                                        ? 'IRANYekanFaNum-Bold'
                                                        : 'IRANYekanBold(FaNum)',
                                                fontSize: 18,
                                            }}>
                                            {val.Name}
                                        </Text>
                                        <View
                                            style={{
                                                cursor: 'text',
                                                paddingRight: 10,
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                            }}>
                                            <Text style={{fontSize: 12, color: drawerItem}}>
                                                {val.ProvinceName}  {val.SubRegionName!==null ?`/`+val.SubRegionName :""}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{alignItems: 'flex-end',flex:1,marginLeft:'2%',cursor: 'text'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <button
                                                style={{border: 0,height:'3rem',width:'4rem',cursor:'pointer',marginLeft:10,backgroundColor:'powderblue'}}
                                                onClick={()=>navigation.navigate('/BuildingContact',{
                                                    buildingID:val.ID,
                                                })}>اطلاعات تماس</button>
                                            <button
                                                style={{border: 0,height:'3rem',width:'4rem',cursor:'pointer',marginLeft:10}}
                                                onClick={() => navigation.navigate("DefineBuilding",{
                                                    buildingID:val.ID
                                                })}>ویرایش</button>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    marginEnd: '4%',
                                                }}>
                                                {val.IsDisabled === false &&
                                                <div>
                                                    {this.state.actionLoading.ID=== val.ID &&  this.state.actionLoading.loading=== true?
                                                        <CircularProgress /> :
                                                        <button
                                                            style={{
                                                                backgroundColor: 'red',
                                                                cursor: 'pointer',
                                                                width: '4rem',
                                                                color: 'white',
                                                                border: 0,
                                                                height: '3rem'
                                                            }}
                                                            onClick={() => this.disabledApartment( val.ID )}
                                                        >غیرفعال</button>
                                                    }
                                                </div>
                                                }
                                                {val.IsDisabled === true &&
                                                <div>
                                                    {this.state.actionLoading.ID === val.ID &&  this.state.actionLoading.loading=== true ?
                                                        <CircularProgress color="secondary"/> :
                                                        <button
                                                            style={{
                                                                backgroundColor: 'green',
                                                                cursor: 'pointer',
                                                                width: '4rem',
                                                                color: 'white',
                                                                border: 0,
                                                                height: '3rem'
                                                            }}
                                                            onClick={() => this.activeApartment( val.ID )}
                                                        >فعال</button>
                                                    }
                                                </div>
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{cursor: 'text',
                                        alignItems: 'flex-end'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    marginEnd: 4,
                                                }}>
                                                {jMoment(val.CreatedAtDate).format('jYYYY/jM/jD')}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                        :
                        <View style={{
                            textAlign: "center",
                            position: "relative",
                            top: "50%",
                            fontSize: 17,
                            fontWeight: "bold",
                            color: "red"
                        }}>
                            هنوز ساختمانی ثبت نکردید برای ایجاد ساختمان جدید بر روی دکمه زیر کلیک کنید
                        </View>
                    }
                    <View style={{marginTop: 24,position: "fixed",bottom: "4%",left: "32.5%"}}>
                        <Fab
                            onPress={() => Router.push('/defineBuilding')}
                            icon={images.ic_add}
                        />
                    </View>
                </Animated.View>
                <style jsx>
                    {`
                        .disabled{
                                    background-color: #dddd
                                }
                                .MuiCircularProgress-colorPrimary{
                                color:green
                                }
                                
                        `}
                </style>
            </MobileLayout>)
    }
}
export default MyBuilding;
/*<CircularProgress color="secondary" />*/
