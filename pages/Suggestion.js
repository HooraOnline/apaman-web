import React, {Component} from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from '../src/react-native';
import MobileLayout from "../src/components/layouts/MobileLayout";
import {observer} from 'mobx-react';

import {
    AddMessagePopUp,
    AlertMessage,
    AndroidBackButton,
    Fab,
    LoadingPopUp,
    Overlay,
    Toolbar
} from '../src/components';
import SuggestionCard from "../src/components/SuggestionCard";
import images from "../public/static/assets/images";
import {bgEmpty, bgScreen, drawerItem, primaryDark} from '../src/constants/colors';

import {userStore} from '../src/stores';
import {permissionId} from '../src/constants/values';
import {addSuggestionQuery, getSuggestionQuery} from '../src/network/Queries';
import {onScrollFab} from "../src/utils";
import {waitForData} from '../src/utils'
import Router from "next/router";
import {navigation} from "../src/utils";

@observer
export default class Suggestion extends Component {
    constructor() {
        super();
        this.state = {
            showOverlay: false,
            showDeletePopUp: false,
            showEditPopUp: false,
            showAddSuggestionPopup: false,
            nominatedToDeleteItem: null,
            nominateToEditItem: null,
            loading: false,
            loadingMessage: '',
            permission: userStore.findPermission(permissionId.suggestion),
            suggestions: [],
            isFabVisible: true,
        };
    }

    async componentDidMount() {
        this.getSuggestion();
        waitForData(()=>{
            this.state.permission=userStore.findPermission(permissionId.suggestion);
        })
    }


    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'انتقادات و پیشنهادات',
        };
        return (
            <MobileLayout>
                <View style={{flex: 1,backgroundColor:bgScreen}}>
                    <Toolbar customStyle={toolbarStyle}/>
                    <AndroidBackButton
                        onPress={() => {
                            if (this.state.loading) {
                                return true;
                            } else if (this.state.showOverlay) {
                                this.setState({
                                    showOverlay: false,
                                    showDeletePopUp: false,
                                    showEditPopUp: false,
                                    showAddSuggestionPopup: false,
                                    nominatedToDeleteItem: null,
                                    nominateToEditItem: null,
                                });
                            } else {
                                this.onBackPress();
                            }
                            return true;
                        }}
                    />
                    <FlatList ItemSeparatorComponent={() => (
                        <View
                            style={{
                                height: 0.7,
                                backgroundColor: '#D5CBCB',
                            }}
                        />
                    )}
                              keyExtractor={(item, index) => index.toString()}
                              data={this.state.suggestions}
                              extraData={this.state.idSwipeOpened}
                        // onScroll={this.onScrollFab}
                              ListEmptyComponent={
                                  <View
                                      style={{
                                          height: global.height - 90,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          backgroundColor: this.state.suggestions.length > 0 ? bgScreen : bgEmpty
                                      }}>
                                      <Image
                                          source={images.es_suggestions}
                                          style={{width: global.width, height: (global.width / 100) * 62}}
                                      />

                                      {this.state.permission && this.state.permission.writeAccess &&
                                      <Text
                                          style={{
                                              fontFamily:
                                                  Platform.OS === 'ios'
                                                      ? 'IRANYekan-ExtraBold'
                                                      : 'IRANYekanExtraBold',
                                              fontSize: 18,
                                              textAlign: 'center',
                                          }}>
                                          هیچ نقد و نظری ندارید
                                      </Text>
                                      }

                                      <View
                                          pointerEvents="box-none"
                                          style={{
                                              //...StyleSheet.absoluteFillObject,
                                              alignItems: 'center',
                                              //justifyContent: 'flex-end',
                                              //flex: 1,
                                              //marginBottom: 50,
                                          }}>
                                          <Text
                                              style={{
                                                  fontSize: 14,
                                                  color: drawerItem,
                                                  textAlign: 'center',

                                              }}>
                                              هنوز کسی چیزی راجع به ساختمان نگفته
                                          </Text>
                                          {this.state.permission && this.state.isFabVisible && this.state.permission.writeAccess && (
                                              <View style={{marginTop:30}}>
                                                  <Fab
                                                      onPress={() => this.showAddNewLabelPopUp()}
                                                      icon={images.ic_addcomment}
                                                      title={"انتقاد یا پیشنهاد"}
                                                  />
                                              </View>
                                          )}

                                      </View>



                                  </View>
                              }
                              renderItem={({item, index}) => (
                                  <SuggestionCard
                                      item={item}
                                      permission={this.state.permission}
                                      onSwipeRemove={item => this.showDeletePopUp(item)}
                                      navigateToEdit={item => this.showEditPopUp(item)}
                                      index={index}
                                      onOpenSwipe={id => this.setState({idSwipeOpened: id})}
                                      idSwipeOpened={this.state.idSwipeOpened}
                                  />
                              )}
                    />
                    {this.state.permission &&this.state.isFabVisible && this.state.permission.writeAccess && this.state.suggestions.length>0   && (
                        <View
                            pointerEvents="box-none"
                            style={{
                                ...StyleSheet.absoluteFillObject,
                                alignItems: 'flex-end',
                                justifyContent: 'flex-end',
                                flex: 1,
                                padding: 16,
                            }}
                        >
                            <Fab
                                onPress={() => this.showAddNewLabelPopUp()}
                                icon={images.ic_addcomment}
                            />
                        </View>
                    )}

                    {this.state.showDeletePopUp && (
                        <AlertMessage
                            visible={this.state.showDeletePopUp}
                            title="حذف واحد"
                            message={
                                'آیا از حذف ' + this.state.nominatedToDeleteItem.Description + ' مطمئن هستید؟'
                            }
                            onConfirm={() => {
                                this.setState({showDeletePopUp: false});
                                this.deleteLabel();
                            }}
                            onDismiss={() => this.setState({showDeletePopUp: false})}
                            confirmTitle="بله"
                            dismissTitle="خیر"
                        />
                    )}
                    <LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage}/>
                </View>
            </MobileLayout>
        );
    }

    onBackPress() {
        navigation.goBack()
    }

    async getSuggestion() {
        Keyboard.dismiss();
        this.setState({loading: true, loadingMessage: 'در حال دریافت ...'});
        await getSuggestionQuery(userStore.BuildingID, userStore.UnitID)
            .then(result => this.setState({suggestions: result, loading: false}))
            .catch(e => {
                this.setState({loading: false});
            });
    }

    showDeletePopUp(item) {
        this.setState({
            showDeletePopUp: true,
            nominatedToDeleteItem: item,
        });
    }

    showEditPopUp(item) {
        this.props.navigation.navigate('AddSuggestion', {item: item,
            onSave: (item) => this.confirmNewLabel(item)});
    }

    showAddNewLabelPopUp() {
        this.props.navigation.navigate('AddSuggestion', {
            onSave: (item) => this.confirmNewLabel(item)});
    }

    dismissDeletePopUp() {
        this.setState({
            showOverlay: false,
            showDeletePopUp: false,
            nominatedToDeleteItem: null,
        });
    }

    dismissEditPopUp() {
        this.setState({
            showOverlay: false,
            showEditPopUp: false,
            nominateToEditItem: null,
        });
    }

    dismissNewLabelPopUp() {
        this.setState({
            showOverlay: false,
            showEditPopUp: false,
        });
    }

    dismissAll() {
        this.setState({
            showOverlay: false,
            showDeletePopUp: false,
            showEditPopUp: false,
            showAddSuggestionPopup: false,
            nominatedToDeleteItem: null,
            nominateToEditItem: null,
        });
    }

    onScrollFab = event => {
        const fabStatus = onScrollFab(event, this._listViewOffset);
        this._listViewOffset = fabStatus.currentOffset;
        if (fabStatus.isFabVisible !== this.state.isFabVisible) {
            /*LayoutAnimation.configureNext(fabStatus.customLayoutLinear);*/
            this.setState({isFabVisible: fabStatus.isFabVisible});
        }
    };

    async confirmNewLabel(item) {
        Keyboard.dismiss();
        this.setState({loading: true, loadingMessage: 'در حال ذخیره ...'});
        item = Object.assign(item, {BuildingID: userStore.BuildingID, UnitID: userStore.UnitID});


        await addSuggestionQuery(item)
            .then(() => {
                this.dismissAll();
                this.getSuggestion();
            })
            .catch(e => {
                this.setState({loading: false});
            });
    }

    async deleteLabel() {
        this.setState({loading: true, loadingMessage: 'در حال حذف ...'});
        const {Title, ID, Description} = this.state.nominatedToDeleteItem;
        await addSuggestionQuery({
            ID: ID,
            isDisabled: true,
            BuildingID: userStore.BuildingID,
            UnitID: userStore.UnitID,
        })
            .then(() => {
                this.dismissDeletePopUp();
                this.getSuggestion();
            })
            .catch(e => {
                this.setState({loading: false});
            });
    }
}
