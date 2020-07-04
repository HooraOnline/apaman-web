import MobileLayout from "../src/components/layouts/MobileLayout";
import React from "react";
import {navigation, waitForData} from "../src/utils";
import {getSelectBuilding} from "../src/network/Queries";
import images from "../public/static/assets/images";
import {AndroidBackButton, Toolbar} from "../src/components";

class CallInformation  extends React.Component{
    constructor(props) {
        super(props);
    }
    onBackPress() {
        navigation.goBack('/');
    }

    render(){
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: ' اطلاعات تماس',
        };
        return (
            <MobileLayout title={`اطلاعات تماس`}>
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
            </MobileLayout>
            )
            }
            }

export default CallInformation;
