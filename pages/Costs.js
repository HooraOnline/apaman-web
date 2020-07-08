import React, {PureComponent} from 'react';
import { CSVLink } from "react-csv";
import {
    Animated,
    /*Dimensions,*/
    Image,
    /*LayoutAnimation,*/
    Platform,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from '../src/react-native';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {SectionList} from '../src/react-native'
import {bgEmpty, bgScreen, border, borderSeparate, drawerItem, primaryDark} from '../src/constants/colors';
import {
    AlertMessage,
    AndroidBackButton,
    Fab,
    IOSSwipeCard,
    LoadingPopUp,
    Overlay,
    Toolbar
} from '../src/components';
import CostCard from "../src/components/CostCard";
import images from "public/static/assets/images";
import {globalState, persistStore, userStore} from '../src/stores';
import {permissionId} from '../src/constants/values';
import {navigation, waitForData} from '../src/utils'
import {addCostQuery, getCostEditQuery, getCostQuery, removeCostQuery} from '../src/network/Queries';

/*
import Collapsible from 'react-native-collapsible';
*/
import {onScrollFab} from '../src/utils';
import MobileLayout from "../src/components/layouts/MobileLayout";
import TouchableOpacity from "../src/react-native/TouchableOpacity";
/*
import {NavigationEvents} from 'react-navigation';
*/

const width = global.width/*('window')*/;
const height = global.height/*('window')*/;

var jMoment = require('moment-jalaali');
/*
const PersianCalendarPicker = require('react-native-persian-calendar-picker');
*/

const BORDER_RADIUS = 20;

class HeaderList extends PureComponent {
    constructor() {
        super();
        this.animatedExpandValue = new Animated.Value(0);
    }

    componentDidMount() {
        //this.animateExpand(false);
    }

    animateExpand(isExpand) {
        Animated.spring(
            this.animatedExpandValue, {
                toValue: isExpand ? 1 : 0,
                duration: 500,
                // friction: 3,
                // tension: 40,
                useNativeDriver: true,
            }).start();
    }

    render() {
        const {item, onHeaderPress, isExpand,style} = this.props;
        //this.animateExpand(isExpand);
        let animateExpandRotate = this.animatedExpandValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
        });
        return (
            <TouchableWithoutFeedback  onPress={() => onHeaderPress(item.title)}
                style={{
                    flex:1,
                }}>
                <View style={[{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 8,
                    paddingStart: 16,
                    paddingEnd: 8,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: borderSeparate,
                    marginHorizontal: 16,
                    marginTop: 16,
                    marginBottom: 8,
                },style]}>

                    <Text style={{
                        flex: 1,
                        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                        fontSize: 16,
                        color: border,
                    }}>{item.title}</Text>

                    <Animated.Image
                        source={images.ic_expand}
                        style={{
                            //tintColor: border,
                            height: 24,
                            width: 24,
                            transform: [{rotate: animateExpandRotate}],
                        }}
                    />

                </View>

            </TouchableWithoutFeedback>
        );
    }

}

@observer
export default class Costs extends PureComponent {
    @observable confirmList = [];

    constructor(props) {
        super(props);
        // this.costs = [];
        this.announceIds = [];
        this.fixedLength = 0;
        this.variableLength = 0;
        this.incomeLength = 0;





        this.state = {
            showOverlay: false,
            showInfoAnnouncePopup: false,
            showLastDatePopup: false,
            loading: false,
            loadingMessage: '',
            isFabVisible: true,
            costList: [],

            hasNotAnnounced: false,

            announceTitle: '',
            announceRecordNumber: null,
            announceLastPayDate: '2019-05-08',
            lastItemPadding:100,
        };
    }


    componentDidMount() {

        waitForData(()=>{
            this.formId=persistStore.curentFormId
            this.formName=persistStore.curentFormName;
            this.isReport=this.formId==37;

            this.permission= userStore.findPermission(this.formId ||  permissionId.costCalculation);
            this.writeAccess=this.permission && this.permission.writeAccess &&!this.isReport;
            this.init();
        })
    }

    groupBy(array, key) {
        return array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
        }, {});
    }

    initExcel(){

        /*for (let i=0;i<this.state.costList.length;i++){
                   for (let j = 0; j <this.state.costList[i].data.length ; j++) {
                       this.state.HeaderOfExcelTable.push(this.state.costList[i].data[j].CostTypeName)
                   }
               }*/

        //for export excel by Alireza
         for (let i=0;i<this.state.costList.length;i++){
             for (let j = 0; j <this.state.costList[i].data.length ; j++) {
                 this.setState({
                     TotalOfCosts:this.state.costList[0].data[0].SumTotalPrice
                 })
                 this.state.PriceOfExcelTable.push([this.state.costList[i].data[j].CostTypeName,this.state.costList[i].data[j].TotalPrice,this.state.costList[i].data[j].PeriodName,/*,'Total'+this.state.costList[i].data[j].SumTotalPrice*/])
             }
         }
         this.state.PriceOfExcelTable.push(['مجموع',this.state.TotalOfCosts])
    }

    init() {
        this.setState({loading: true, loadingMessage: 'در حال دریافت ...'});
        getCostQuery()
            .then(result => {

                const hasNotAnnounced = !!result.find(o => !o.HasAnnounced);
                result.map(o => {
                    if (!o.HasAnnounced) {
                        const costClassId = parseInt(o.CostClassID);
                        costClassId === 1 ?
                            ++this.fixedLength : costClassId === 2 ?
                            ++this.variableLength : ++this.incomeLength;
                    }
                });

                const section = Object.values(this.groupBy(result, 'PeriodDetailID')).map(o => {
                    return {title: o[0].PeriodName, data: o};
                });
                console.log('11111111111111=',section);
                this.setState({costList: section, hasNotAnnounced: hasNotAnnounced});


            })
            .catch(e => this.setState({costList: []}))
            .finally(() => {
                this.setState( {loading: false});
                console.log(this.state.costList)
            });
    }
    HeaderOfExcel=()=>{
        for (let i=0;i<this.state.costList.length;i++){
            console.log(this.state.costList[i].data[i])
        }
    }
    onHeaderPress = title => {
        this.setState({
            activeSection: this.state.activeSection === title
                ? ''
                : title,
        });
    };
    scrollToLast(section){
        if(this.state.costList[this.state.costList.length-1]==section)
            setTimeout(()=>this.setState({lastItemPadding:0}),300)
        else
            this.setState({lastItemPadding:100});
    }
    removeCost=item=>{
        this.setState({selectedItem:item, removeCostDialogShow:true})
    }

    async confirmDeleteCost() {
        console.log(this.state.selectedItem);
        let costId=this.state.selectedItem.CalculationHeaderID;
        globalState.showBgLoading();
        await removeCostQuery(costId)
            .then(() => {
                //this.setState({loading: false});
                //this.props.navigation.goBack();
                this.init();
                globalState.showToastCard();
            })
            .catch(e => {
                globalState.showToastCard();
            })
            .finally(() => globalState.hideBgLoading());
        this.setState({removeCostDialogShow:false})
    }
    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'هزینه‌های ساختمان',
            end: (this.state.costList.length > 0 && this.state.hasNotAnnounced) ? {
                onPress: this.goToAnnouncement.bind(this),
                icon: images.ic_broadcast,
            } : null,
        };

        return (
            <MobileLayout style={{padding:0}} title={'هزینه ها'}
              header={
                  <Toolbar customStyle={toolbarStyle}/>
              }

              footer={this.state.costList.length > 0 && this.state.isFabVisible && this.writeAccess ?(
                  <View
                      pointerEvents="box-none"
                      style={{
                          ...StyleSheet.absoluteFillObject,
                          alignItems: this.state.costList.length > 0 ? 'flex-end' : 'center',
                          justifyContent: 'flex-end',
                          flex: 1,
                          marginEnd: 16,
                          marginBottom: 24,
                      }}
                  >
                      <Fab
                          onPress={this.addNewCost.bind(this)}
                          icon={images.ic_add}
                      />
                  </View>
              ):null}

            >
                <View style={{
                    flex: 1,
                    //backgroundColor: this.state.costList.length > 0 ? bgScreen : bgEmpty
                }}>

                    {/*<NavigationEvents onWillFocus={payload => {
                    if (payload.action.type === 'Navigation/BACK') {
                        this.init();
                    }
                }}/>*/}
                    <AndroidBackButton
                        onPress={() => {
                            if (this.state.loading) {
                                return true;
                            } else if (this.state.showOverlay) {
                                this.setState({
                                    showOverlay: false,
                                    nominatedToDeleteItem: null,
                                });
                            } else if (this.state.selectingCosts) {
                                this.setState({selectingCosts: false});
                            } else {
                                this.onBackPress();
                            }
                            return true;
                        }}
                    />

                    <SectionList
                        headerStyle={{backgroundColor:bgScreen}}
                        chidStyle={{backgroundColor:bgScreen}}
                        stickySectionHeadersEnabled={false}
                        initialNumToRender={10}
                        style={{flex: 1,marginTop:0}}
                        sections={this.state.costList}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={(
                            <View
                                style={{
                                    height: height - 90,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Image
                                    // resizemode='center'
                                    source={images.es_Inbox}
                                    style={{width: width, height: width / 100 * 62}}
                                />
                                <Text style={{
                                    marginTop: 32,
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',
                                    fontSize: 18,
                                    textAlign: 'center',
                                }}>{this.state.noAcssess?'عدم دسترسی':'اطلاعاتی ثبت نشده!'}</Text>
                                {this.writeAccess && (
                                    <Text style={{
                                        fontSize: 14,
                                        color: drawerItem,
                                        marginHorizontal: 24,
                                        textAlign: 'center',
                                    }}>شما هنوز داده ای برای ساختمان ثبت نکرده‌‎اید.
                                    </Text>
                                )}
                                { this.writeAccess  && (
                                    <View style={{marginTop: 24,maxWidth:200}}>
                                        <Fab
                                            onPress={this.addNewCost.bind(this)}
                                            icon={images.ic_add}
                                            title={'ساخت'}
                                        />
                                    </View>
                                )}
                            </View>
                        )}
                        sections={this.state.costList}
                        extraData={this.state.loading}
                        onScroll={this.onScrollFab}
                        ref={(sectionList) => { this.sectionList = sectionList }}
                        renderSectionHeader={(section) => (
                           /* <HeaderList
                                style={{marginBottom:this.state.costList[this.state.costList.length-1]==section?section.title !== this.state.activeSection?100:this.state.lastItemPadding:0}}
                                item={section}
                                onHeaderPress={title => {
                                    this.onHeaderPress(title);
                                    this.scrollToLast(section);
                                }}
                                isExpand={section.title === this.state.activeSection}
                            />*/
                            <TouchableOpacity style={{  flex:1,}}>

                                <View style={[{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingVertical: 8,
                                    paddingStart: 16,
                                    paddingEnd: 8,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: borderSeparate,
                                    marginHorizontal: 16,
                                    marginTop: 0,
                                    marginBottom: 8,
                                }]}>

                                    <Text style={{
                                        flex: 1,
                                        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                        fontSize: 16,
                                        color: border,
                                    }}>{section.title}</Text>

                                    <Image
                                        source={images.ic_expand}
                                        style={{
                                            //tintColor: border,
                                            height: 24,
                                            width: 24,

                                        }}
                                    />

                                </View>

                            </TouchableOpacity>

                        )}
                        renderItem={(item, section,index) => {
                            return (
                                <IOSSwipeCard
                                    noPadding
                                    style={{  marginHorizontal: 24,marginTop:section.title === this.state.activeSection?10:0}}
                                    //disabled={ this.state.payState!=FILTER__TRANSACTION}
                                    index={index}
                                    permission={this.permission}
                                    onMore={(this.writeAccess && !item.HasAnnounced && !item.ParentID)?()=>{this.removeCost(item)}:null}
                                    moreIcon={images.ic_delete}
                                    moreLabel={'حذف'}
                                    moreColor={'red'}
                                    moreDisabled={true}
                                    moreBtnCorner={true}
                                    onClose={() => {
                                        this.setState({isOpen: true});
                                    }}
                                    onOpen={id => {
                                        this.setState({isOpen: false, idSwipeOpened: id});
                                    }}
                                    idSwipeOpened={this.state.idSwipeOpened}
                                >
                                   {/* <Collapsible
                                        key={item}
                                        style={{  marginHorizontal: -24,}}
                                        collapsed={section.title !== this.state.activeSection}>*/}

                                        <CostCard
                                            cost={item}
                                            writeAccess={this.writeAccess}
                                            disabled={this.isReport}
                                            navigateToEdit={cost => this.goToEditCost(cost)}
                                        />

                                   {/* </Collapsible>*/}
                                </IOSSwipeCard>

                            )
                        }}
                />



                    {this.state.showOverlay && (
                        <Overlay
                            catchTouch={true}
                            onPress={this.dismiss.bind(this)}
                        >

                        </Overlay>
                    )}
                    {this.state.removeCostDialogShow && (
                        <AlertMessage
                            visible={this.state.removeCostDialogShow}
                            title="حذف هزینه"
                            message={
                                'آیا از حذف هزینه ' + this.state.selectedItem.CostTypeName + ' مطمئن هستید؟'
                            }
                            onConfirm={() => {
                                this.confirmDeleteCost();
                            }}
                            onDismiss={() => this.setState({removeCostDialogShow:false})}
                            confirmTitle="بله"
                            dismissTitle="خیر"
                        />
                    )

                    }

                    <LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage}/>
                  {/*  <CSVLink  filename={"مجموع هزینه ها.csv"} data={this.state.PriceOfExcelTable}><button>Excel </button></CSVLink>*/}
                </View>
            </MobileLayout>
        );
    }

    onBackPress() {
        navigation.goBack();
    }

    dismiss() {
        this.setState({
            showOverlay: false,
            showInfoAnnouncePopup: false,
        });
    }

    goToAnnouncement() {
        console.warn("$$$$$$$$$ goToAnnouncement this.fixedLength: ", this.fixedLength);
        console.warn("$$$$$$$$$ goToAnnouncement this.variableLength: ", this.variableLength);
        console.warn("$$$$$$$$$ goToAnnouncement this.incomeLength: ", this.incomeLength);
        if (
            (this.fixedLength > 0 && this.variableLength > 0) ||
            (this.fixedLength > 0 && this.incomeLength > 0) ||
            (this.variableLength > 0 && this.incomeLength > 0)
        ) {
            navigation.navigate('Announcement', {fromCost: true});
        } else {
            navigation.navigate('AddAnnouncement', this.fixedLength > 0 ?
                {type: {id: 1, Name: 'ثابت', title: 'اعلان هزینه ثابت'}, fromCost: true} : this.variableLength > 0 ?
                    {type: {id: 2, Name: 'متغیر', title: 'اعلان هزینه متغیر'}} : {type: {id: 3, Name: 'درآمد', title: 'اعلان درآمد'}}
            );
        }
    }

    async goToEditCost(cost) {
        this.setState({loading: true, loadingMessage: 'در حال دریافت جزئیات ...'});
        await getCostEditQuery(cost.CalculationHeaderID)
            .then(result => {
                Object.assign(cost, {CostTypeDetailName: result[0].CostTypeDetailName});
                Object.assign(cost, {detail: JSON.parse(result[0].Datas)});
                if(result[0].InstallmentData)
                    Object.assign(cost, {InstallmentData: JSON.parse(result[0].InstallmentData)});
                navigation.navigate('AddCost', {cost});
            })
            .catch(e => globalState.showToastCard())
            .finally(() => this.setState({loading: false}));
    }

    goToViewCost(cost) {
        navigation.navigate('AddCost', {cost});
    }




    showDeletePanel(title) {
        this.setState({showOverlay: true, nominatedToDeleteItem: title});
    }


    addNewCost() {
        navigation.navigate('AddCost'); //, {onConfirm: item => this.setSwitchValue(item),}
    }

    onScrollFab = (event) => {
        const fabStatus = onScrollFab(event, this._listViewOffset);
        this._listViewOffset = fabStatus.currentOffset;
        if (fabStatus.isFabVisible !== this.state.isFabVisible) {
            /*
                        LayoutAnimation.configureNext(fabStatus.customLayoutLinear);
            */
            this.setState({isFabVisible: fabStatus.isFabVisible});
        }
    };

    async onConfirmDelete() {
        this.setState({loading: true, loadingMessage: 'در حال حذف هزینه ...'});
        const {
            CostType_ID,
            Description,
            TotalPrice,
            OwnerOfCost,
            ForUnit,
            CalculateType_ID,
            Apartment_ID,
            HasConfirmed,
            CostHeader_ID,
        } = this.state.nominatedToDeleteItem;
        const newItem = {
            id: CostHeader_ID,
            costType_ID: CostType_ID,
            description: Description,
            totalPrice: TotalPrice,
            ownerOfCost: OwnerOfCost,
            forUnit: ForUnit,
            calculateType_ID: CalculateType_ID,
            apartment_ID: Apartment_ID,
            hasConfirmed: HasConfirmed,
            isDisabled: true,
        };
        await addCostQuery(newItem)
            .then(() => {
                this.setState({
                    showOverlay: false,
                    nominatedToDeleteItem: null,
                    selectingCosts: false,
                });
                this.init();
            })
            .catch(e => {
            }).finally(() => this.setState({loading: false}));
    }
}

const styles = StyleSheet.create({
    buttonIn: {
        flex: 1,
        borderWidth: 0.5,
        alignItems: 'center',
        borderRadius: 4,
        height: 33,
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7,
    },
});
