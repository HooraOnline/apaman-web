import React from "react";
import images from "../public/static/assets/images";
import MobileLayout from "../src/components/layouts/MobileLayout";
import {AndroidBackButton, FloatingLabelTextInput, Toolbar} from "../src/components";
import {navigation, waitForData} from "../src/utils";
import {TouchableOpacity, View} from "../src/react-native";
import {
    //addContactsInformationQuery,
    addContactsQuery,
    getContactType
} from "../src/network/Queries";

import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
class AddContacts  extends React.Component {
    constructor(props) {
        super( props );
        this.state={
            Tel:null,
            WhatsApp:null,
            Telegram:null,
            Email:null,
            typeList:[],
            contactInformation:{}
        }
    }
    componentDidMount() {
        waitForData(()=>{
            getContactType().then(res=>this.setState({typeList:res}))
        })
    }

    onBackPress() {
        navigation.goBack( '/main' );
    }

    sendToDB=async ()=>{
        await this.setState({
            contactInformation:{
                Tel:this.state.Tel,
                WhatsApp:this.state.WhatsApp,
                Telegram:this.state.Telegram,
                Email:this.state.Email
            }
        })
        //addContactsInformationQuery(this.state.contactInformation)
    }
    setContactState=(stateName,e)=>{
        this.setState({
            [stateName]:e.target.value
        })
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
                {this.state.typeList.map((val,index)=>
                <View key={index} style={{direction:'rtl',marginTop:8,width:'100%'}}>
                        <FloatingLabelTextInput
                            Adornment={ index===0 && <PhoneIcon/> || index===3 && <EmailIcon/>}
                            style={{marginTop:7}}
                            type={val.Name==="Email" ?"string" :"number"}
                            onChange={(e)=>this.setContactState(val.Name,e)}
                            label={`${val.Name}`}
                        />
                    </View>
                )}
            </MobileLayout>
        )
    }
}
export default AddContacts
