// pages/mycart.js

import MobileLayout from "../src/components/layouts/MobileLayout";
import {AndroidBackButton, Fab, Toolbar} from "../src/components";
import React from "react";
import images from "../public/static/assets/images";
import {navigation, waitForData} from "../src/utils";
import {Animated, Platform, Text, TouchableOpacity, View} from "../src/react-native";
import {drawerItem} from "../src/constants/colors";
import Router from "next/router";
import { getSelectBuilding} from "../src/network/Queries";
import jMoment from 'moment-jalaali';
import userStore from "../src/stores/User";
class myBuilding  extends React.Component{
    static async getInitialProps({ctx}){
        const data=getSelectBuilding(1,15,-1)
        return {Res:getSelectBuilding(1,15,-1).then(res=>res)}
    }
    constructor(props) {
        super(props);
        this.state={
            buildingList:[]
        }
    }
    onBackPress() {
        navigation.goBack('/main');
    }
    componentDidMount() {
        waitForData(()=>{
            getSelectBuilding(userStore.userID, 15, userStore.RoleID).then(res=>this.setState({
                buildingList:res
            }));
            },
        )
        console.log(userStore.userID, userStore.RoleID)

    }

    render(){
        console.log(this.props.Path,this.props.Res)
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
                        position: 'relative',
                        width:'100%',

                    }}>
                    {this.state.buildingList.length>0 ?this.state.buildingList.map((val,index)=>
                    <View
                        style={val.isDisabled===0 ?{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 10,
                            backgroundColor: '#ddd',
                        }:{paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 10,
                            backgroundColor: 'white'}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("defineBuilding",{
                                buildingID:val.ID
                            })}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                <Text
                                    style={{
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
                                        paddingRight: 10,
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                    }}>
                                    <Text style={{fontSize: 12, color: drawerItem}}>
                                        {val.ProvinceName} / {val.SubRegionName!==null ?val.SubRegionName :""}
                                    </Text>
                                </View>
                            </View>
                            <View style={{alignItems: 'flex-end'}}>
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
                    <View style={{marginTop: 24,position: "fixed",bottom: "2%",left: "28.5%"}}>
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

                    `}
                </style>
    </MobileLayout>)
    }
}
export default myBuilding;
