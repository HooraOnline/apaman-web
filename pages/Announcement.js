import React, {PureComponent} from 'react';
import {
    Animated,
    FlatList,
    Image,
    //LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from '../src/react-native';
//import {NavigationEvents} from 'react-navigation';

import {AlertMessage, AndroidBackButton, Fab, IOSSwipeCard, ListDialog, LoadingPopUp, Toolbar} from '../src/components';
import images from "../public/static/assets/images";
import {
    bgScreen,
    bgSuccess,
    drawerItem,
    progressDefault,
    textItem, transparent,
} from '../src/constants/colors';
import {onScrollFab, parseTimeToJalaali, navigation, waitForData} from '../src/utils';
import {userStore} from '../src/stores';
import {permissionId} from '../src/constants/values';
import { deleteAnnouncementQuery, getAnnouncements} from '../src/network/Queries';
import jMoment from 'moment-jalaali';
import {GlobalState as globalState} from '../src/stores/GlobalState';
import MobileLayout from "../src/components/layouts/MobileLayout";

class AnnouncementItem extends PureComponent {
    constructor() {
        super();
        //this.animatedValue = new Animated.Value(0);
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
       /* Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: 500,
            delay: this.props.index * 100,
            useNativeDriver: true,
        }).start();*/
    }

    render() {
        const {
            ResultCode,
            ResultText,
            ID,
            CostClassID,
            CostClassName,
            IsDefault,
            Title,
            RecordNumber,
            LastPayDate,
            TotalPeopleNumber,
            TotalPeopleNumberPaid,
            PeriodName,

        } = this.props.item;
        const opacity =0.8;/* this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });*/
        const payCompleted = TotalPeopleNumberPaid === TotalPeopleNumber;
        return (
            <Animated.View
                style={{
                    flex: 1,
                    opacity: opacity,
                    elevation: 1,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                    position: 'relative',

                }}>
               {/* <View
                    style={{
                        backgroundColor:transparent ,//progressDefault,
                        position: 'absolute',
                        bottom: -7,
                        width: '100%',
                        height: '135%',
                        borderRadius: 10,
                        overflow: 'hidden',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                    }}>
                    <View
                        style={{
                            width: (TotalPeopleNumberPaid * 100) / TotalPeopleNumber + '%',
                            height: 13,
                            backgroundColor: bgSuccess,
                        }}
                    />
                </View>*/}
                <View
                    style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 10,
                        backgroundColor: 'white',
                    }}>
                    <TouchableOpacity
                        onPress={() => this.props.onPress(this.props.item)}
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
                                {Title}
                            </Text>

                            <View
                                style={{
                                    paddingRight: 10,
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                }}>
                                <Text style={{fontSize: 12, color: drawerItem}}>
                                    {CostClassName}
                                </Text>
                                {CostClassID === '1' && (
                                    <Text style={{fontSize: 12}}>
                                        {' '}
                                        - {IsDefault ? 'شارژ' : 'هزینه'}
                                    </Text>
                                )}
                                {PeriodName && (
                                    <Text style={{fontSize: 12}}>
                                        {' '}
                                        . {PeriodName}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={{alignItems: 'flex-end'}}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: drawerItem,
                                }}>
                                {LastPayDate
                                    ? //parseTimeToJalaali(
                                        jMoment(LastPayDate).format('jYYYY/jM/jD')//,
                                        //false,
                                   // )
                                    : 'بدون تاریخ'}
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        marginEnd: 4,
                                    }}>
                                    {TotalPeopleNumberPaid}/{TotalPeopleNumber}
                                </Text>
                                <Image
                                    source={
                                        payCompleted ? images.ic_AllPaid : images.ic_NumberOfUsers
                                    }
                                    style={{
                                      //  tintColor: payCompleted ? bgSuccess : textItem,
                                        height: 24,
                                        width: 24,
                                    }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    }
}

export default class Announcement extends PureComponent {
    constructor(props) {
        super(props);
        this._listViewOffset = 0;

        this.state = {
            checked: false,
            showBatchPriceSet: false,
            selectedUnitArea: null,
            selectedUnitPrice: null,

            isFabVisible: true,

            allAnnouncements: [],
        };
    }

    async componentDidMount() {

        this.fromCost =navigation.getParam('fromCost', false);
        waitForData(()=>{
            this.getAnnouncementsList();
            let permission= userStore.findPermission(permissionId.announcement).writeAccess;
            this.setState({showAddType: this.fromCost,permission:permission});
        })
    }

    async getAnnouncementsList() {
        this.showLoading();
        await getAnnouncements()
            .then(result => this.setState({allAnnouncements: result}))
            .catch(e => globalState.showToastCard())
            .finally(() => {
                this.hideLoading()
            });
    }
    confirmDeleteAnnouncment(item){
        this.selectedItem=item;
        console.log(this.selectedItem);
        this.setState({showDeletePopUp:true})
    }
   async deleteAnnouncment(){
        let announcment={ID:this.selectedItem.ID,};
        await deleteAnnouncementQuery(announcment)
            .then(() => this.getAnnouncementsList())
            .catch(e => globalState.showToastCard());

        this.setState({showDeletePopUp:false})
    }
    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPressed.bind(this),
                content: images.ic_back,
            },
            title: 'اعلام به اهالی',
        };

        return (
            <MobileLayout style={{padding:0}} title={'اعلام به اهالی'}
                          header={ <Toolbar customStyle={toolbarStyle}/>}
                          footer={
                              <View>
                                  {this.state.allAnnouncements.length > 0 &&
                                  this.state.isFabVisible &&
                                  this.state.permission && (
                                      <View
                                          pointerEvents="box-none"
                                          style={{
                                              ...StyleSheet.absoluteFillObject,
                                              alignItems: 'flex-end',
                                              justifyContent: 'flex-end',
                                              flex: 1,
                                              marginEnd: 16,
                                              marginBottom: 24,
                                          }}
                                      >
                                          <Fab
                                              onPress={() => this.setState({showAddType: true})}
                                              icon={images.ic_add}
                                          />
                                      </View>
                                  )}
                              </View>
                          }
            >
                <View style={{flex: 1, backgroundColor: bgScreen,paddingHorizontal:16}}>

                    <AndroidBackButton
                        onPress={() => {
                            this.onBackPressed();
                            return true;
                        }}
                    />

                  {/*  <NavigationEvents onWillFocus={payload => {
                        if (payload.action.type === 'Navigation/BACK') {
                            this.getAnnouncementsList();
                        }
                    }}
                    />*/}

                    <FlatList
                        ListEmptyComponent={
                            <View
                                style={{
                                    height: global.height - 90,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Image
                                    source={images.es_Inbox}
                                    style={{width:global.width, height: (global.width / 100) * 62}}
                                />
                                <Text
                                    style={{
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-ExtraBold'
                                                : 'IRANYekanExtraBold',
                                        fontSize: 18,
                                        textAlign: 'center',
                                    }}>
                                    هنوز چیزی اعلام نشده
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: drawerItem,
                                        textAlign: 'center',
                                    }}>
                                    شما هنوز هزینه یا درآمدی برای ساختمان ثبت نکرده‌‎اید. برای شروع
                                    دکمه زیر را فشار دهید.
                                </Text>

                                <View style={{marginTop: 24}}>
                                    <Fab
                                        onPress={() => this.setState({showAddType: true})}
                                        icon={images.ic_add}
                                    />
                                </View>
                            </View>
                        }
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state.allAnnouncements}
                        data={this.state.allAnnouncements}
                        onScroll={this.onScrollFab}
                        renderItem={({item,index}) => (
                            <IOSSwipeCard
                                noPadding
                                style={{
                                    marginHorizontal: 16,
                                    marginTop: 16,
                                    marginBottom: 3,
                                    borderRadius: 10,
                                }}
                                index={index}
                                onDelete={() => this.confirmDeleteAnnouncment(item)}
                                onClose={() => this.setState({isOpen: true})}
                                onOpen={id => { this.setState({isOpen: false,idSwipeOpened:id});  }}
                                deleteBtnCorner={true}
                                idSwipeOpened={this.state.idSwipeOpened}>
                                    <AnnouncementItem
                                        onPress={item =>
                                            navigation.navigate('AnnouncementEdit', {
                                                announcement: item,
                                                type: addTypes[0],
                                            })
                                        }
                                        item={item}
                                        // itemDetail={(itemSelected) => this.itemDetail(itemSelected)}
                                    />
                            </IOSSwipeCard>
                        )}
                    />



                    <ListDialog
                        visible={this.state.showAddType}
                        onDismiss={() => this.setState({showAddType: false})}
                        title="ایجاد اعلان جدید"
                        items={addTypes}
                        onValueChange={this.addAnnouncement}
                    />
                    {this.selectedItem &&(
                        <AlertMessage
                            visible={this.state.showDeletePopUp}
                            title={'حذف اعلام'}
                            message={'آیا از حذف '+this.selectedItem.Title+' مطمعن هستید؟'}

                            onConfirm={() => {
                                this.deleteAnnouncment();
                            }}
                            onDismiss={() => this.setState({showDeletePopUp:false})}
                            confirmTitle="بله"
                            dismissTitle="خیر"
                        />
                    )}

                    <LoadingPopUp
                        visible={this.state.loading}
                        message={this.state.loadingMessage}
                    />
                </View>
            </MobileLayout>
        );
    }

    showLoading(message = 'در حال دریافت اطلاعات...') {
        this.setState({loading: true, loadingMessage: message});
    }

    hideLoading() {
        this.setState({loading: false});
    }

    onBackPressed() {
        navigation.goBack();
    }

    addAnnouncement = type => {
        this.setState({showAddType: false});
       navigation.navigate('AddAnnouncement', {type});
    };

    onScrollFab = event => {
        const fabStatus = onScrollFab(event, this._listViewOffset);
        this._listViewOffset = fabStatus.currentOffset;
       /* if (fabStatus.isFabVisible !== this.state.isFabVisible) {
            LayoutAnimation.configureNext(fabStatus.customLayoutLinear);
            this.setState({isFabVisible: fabStatus.isFabVisible});
        }*/
    };
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        ...StyleSheet.absoluteFillObject,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
        padding: 16,
    },
});

const addTypes = [
    {id: 1, Name: 'ثابت', title: 'اعلان هزینه ثابت'},
    {id: 2, Name: 'متغیر', title: 'اعلان هزینه متغیر'},
    {id: 3, Name: 'درآمد', title: 'اعلان درآمد'},
];
