import MobileLayout from "../src/components/layouts/MobileLayout";
import React from "react";
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
import {AndroidBackButton, ListMultiSelect, Toolbar} from "../src/components";
import Router from "next/router";
import images from "../public/static/assets/images";
const onBackPressed=()=> {
    //window.history.back();
    Router.back();
}
class CostAndIncomeReport extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            periodDetailIds:[]
        }
    }
    addPeriodDetailIds=(e)=>{
        if(this.state.periodDetailIds.indexOf(e.currentTarget.value)!==0){
            this.setState({
                periodDetailIds:[...this.state.periodDetailIds,e.target.value]
            })
        }else{
            this.setState({
                periodDetailIds:[...this.state.periodDetailIds,e.target.value]
            })
        }
    }

    render() {
        const toolbarStyle = {
            start: {
                /*
                                onPress: this.onBackPressed.bind(this),
                */
                content: images.ic_back,
            },
            title: 'گزارش درآمد و هزینه ',

        };
        return (
            <MobileLayout title={`همه هزینه ها`}>
                <View>
                    لطفا دوره خود را انتخاب نمایید
                    <label>
                        <input
                            type="radio"
                            value="option1"
                            onClick={(e)=>this.addPeriodDetailIds(e)}
                            checked={true} />
                        دوره 1
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="option2"
                            checked={this.state.periodDetailIds.indexOf("option2")===0 ? true: false}
                            onClick={(e)=>this.addPeriodDetailIds(e)}/>
                        دوره 2
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="option3"
                            checked={true}
                            onClick={(e)=>this.addPeriodDetailIds(e)}/>
                        دوره 3
                    </label>
                </View>
                {/* <Toolbar customStyle={toolbarStyle}>
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
                <View style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    backgroundColor: 'rgb(245, 141, 66)',
                    marginTop: '3%',}}>
                    گزارش درآمد و هزینه بهار و تابستان</View>
                <View style={{marginBottom: '3%',
                    fontSize: 20,
                    display: 'flex',
                    color:'rgb(255, 255, 255)',
                    flexDirection: 'column',
                    textAlign: 'center',
                    backgroundColor: 'rgb(234, 69, 35)',
                    marginTop: '3%',}}>
                    درآمدها</View>
                <View style={{height:'15%'}}>
                <View style={{flex: 1, backgroundColor: '#F5F1F1',flexDirection:'row'}}>
                    <View style={{width:'33.3%'}}></View>
                    <View style={{width:'33.3%'}}>اعلام شده(45)</View>
                    <View style={{width:'33.3%'}}>پرداخت شده(45)</View>
                </View>
                <View style={{flex: 1, backgroundColor: '#F5F1F1',flexDirection:'row'}}>
                    <View style={{width:'33.3%'}}>شارژ ثابت</View>
                    <View style={{width:'33.3%'}}>624,0000,000 (45)</View>
                    <View style={{width:'33.3%'}}>624,0000,000 (24)</View>
                </View>
                <View style={{flex: 1, backgroundColor: '#F5F1F1',flexDirection:'row'}}>
                    <View style={{width:'33.3%'}}>شارژ متغیر</View>
                    <View style={{width:'33.3%'}}>624,0000,000 (45)</View>
                    <View style={{width:'33.3%'}}>624,0000,000 (24)</View>
                </View>
                <View style={{flex: 1, backgroundColor: '#F5F1F1',flexDirection:'row'}}>
                    <View style={{width:'33.3%'}}>صندوق</View>
                    <View style={{width:'33.3%'}}>624,0000,000 (45)</View>
                    <View style={{width:'33.3%'}}>624,0000,000 (24)</View>
                </View>
                </View>
                <View style={{flex: 1, backgroundColor: '#F5F1F1',flexDirection:'row'}}>
                    <View style={{width:'33.3%'}}>
                        <br/>
                        جمع درآمدها
                    </View>
                    <View style={{width:'33.3%'}}>
                        <hr style={{width:'55%',marginRight:0}}/>
                        624,0000,000 (45)
                    </View>
                    <View style={{width:'33.3%'}}>
                        <hr style={{width:'55%',marginRight:0}}/>
                        624,0000,000 (24)
                    </View>
                </View>
                <View style={{marginBottom: '3%',
                    fontSize: 20,
                    color:'rgb(255, 255, 255)',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    backgroundColor: 'rgb(234, 69, 35)',
                    marginTop: '1%',}}>
                    هزینه ها</View>
                <View style={{flex: 1, backgroundColor: '#F5F1F1',flexDirection:'row'}}>
                    <View style={{width:'33.3%'}}>نام هزینه</View>
                    <View style={{width:'33.3%'}}>
                        مبلغ
                    </View>
                    <View style={{width:'33.3%'}}>
                        تعداد
                    </View>
                </View>
                <View style={{flex: 1, backgroundColor: '#F5F1F1',flexDirection:'row'}}>
                    <View style={{width:'33.3%'}}>قبض برق</View>
                    <View style={{width:'33.3%'}}>
                        253,000,000
                    </View>
                    <View style={{width:'33.3%'}}>
                        15
                    </View>
                </View>
                <View style={{flex: 1, backgroundColor: '#F5F1F1',flexDirection:'row'}}>
                    <View style={{width:'33.3%'}}></View>
                    <View style={{width:'33.3%'}}>
                        <hr style={{width:'50%',marginRight:0}}/>
                        253,000,000
                    </View>
                    <View style={{width:'33.3%'}}>
                        <hr style={{width:'50%',marginRight:0}}/>
                        20
                    </View>
                </View>
                <TouchableOpacity style={{
                    position:'absolute',
                    bottom:0,
                    width:'100%',
                    fontSize:20,
                    color:'rgb(255, 255, 255)',
                    textAlign:'center',
                    backgroundColor:'rgb(234, 69, 35)'}}>
                    دانلود اکسل
                </TouchableOpacity>*/}
            </MobileLayout>
        )
    }
}
export default CostAndIncomeReport