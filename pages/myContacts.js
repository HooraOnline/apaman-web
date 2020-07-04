import React from "react";
import images from "../public/static/assets/images";
import MobileLayout from "../src/components/layouts/MobileLayout";
import {AndroidBackButton, Toolbar,Fab} from "../src/components";
import {navigation} from "../src/utils";
import {Animated, Platform, Text, TouchableOpacity, View} from "../src/react-native";
import {drawerItem} from "../src/constants/colors";
import Router from "next/router";
import {getSelectBuilding} from "../src/network/Queries";
import jMoment from 'moment-jalaali';
class myContacts  extends React.Component {
    constructor(props) {
        super( props );
        this.state={
            contactInformation:[]
        }
    }

    onBackPress() {
        navigation.goBack( '/main' );
    }

    componentDidMount() {

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
                            });
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

                            <View
                                style={{paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 10,
                                    backgroundColor: 'white'}}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("defineBuilding",{
                                        buildingIndex:index
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
                                                color:'black',
                                                fontSize: 18,
                                            }}>
                                            {/*{val.Name}*/}
                                            شماره تماس: 09211000000
                                        </Text>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                            }}>
                                            <Text style={{fontSize: 18}}>
                                                {/*{val.ProvinceName} / {val.SubRegionName!==null ?val.SubRegionName :""}*/}
                                                تلگرام: 093950000000
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                            }}>
                                            <Text style={{fontSize: 18}}>
                                                {/*{val.ProvinceName} / {val.SubRegionName!==null ?val.SubRegionName :""}*/}
                                                واتس آپ: 093950000000
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                            }}>
                                            <Text style={{fontSize: 18}}>
                                                {/*{val.ProvinceName} / {val.SubRegionName!==null ?val.SubRegionName :""}*/}
                                                تلفن: 093950000000
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
                                                {/*{jMoment(val.CreatedAtDate).format('jYYYY/jM/jD')}*/}
                                                1399/2/22
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                    <View style={{marginTop: 24,position: "fixed",bottom: "2%",left: "28.5%"}}>
                        <Fab
                            onPress={() => Router.push('/a' +
                                'ddContacts')}
                            icon={images.ic_add}
                        />
                    </View>
                </Animated.View>
            </MobileLayout>
        )
    }
}
export default myContacts