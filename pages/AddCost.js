import React, {Component, PureComponent} from 'react';
import {
    Animated,
 //   Dimensions,
    FlatList,
    Image,
    Keyboard,
 //saeed   LayoutAnimation,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    KeyboardAwareScrollView,
} from '../src/react-native';

//import {NavigationEvents} from 'react-navigation';

import {
    AlertMessage,
    AndroidBackButton,
    CardUnitInfo,
    Fab,
    FloatingLabelTextInput,
    ListDialogPopUp,
    LoadingPopUp,
    Overlay,
    PersianCalendarPickerPopup,
    SnakePopup,
    SwitchText,
    Toolbar,

} from '../src/components';

import colors, {
    bgItem,
    bgScreen,
    bgWhite,
    border,
    borderSeparate,
    drawerItem,
    lightRed,
    overlayColor,
    placeholderTextColor,
    primaryDark,
    subTextItem,
    textItem,
    transparent,
} from '../src/constants/colors';

import {globalState, userStore} from '../src/stores';
import {permissionId} from '../src/constants/values';

import images from "public/static/assets/images";

import {
    getCostCalculateQuery,
    getCostSettingDetailQuery,
    getCostSettingQuery,
    getPeriodQuery,
    getProcessCalc,
    getSupplierkListQuery,
    getYearQuery,
    submitAddCost,
} from '../src/network/Queries';

import accounting from 'accounting';

//import Toast from 'react-native-simple-toast';
import {compare2sort, mapNumbersToEnglish, navigation, onScrollFab, showMassage} from '../src/utils';
import SimpleSnake from '../src/components/basic/SimpleSnake';
import MobileLayout from "../src/components/layouts/MobileLayout";


const jMoment = require('moment-jalaali');
jMoment.loadPersian({dialect: 'persian-modern'});

const Bold = ({children}) => (
    <Text style={{fontWeight: 'bold'}}>{children}</Text>
);

class InstallmentDialog extends PureComponent {
    constructor(props) {
        super(props);

        this.animatedFromBottom = new Animated.Value(0);
        this.state = {
            loans: props.items.length > 0 ? props.items : [{Maah: 0, Price: 0}],
        };
    }

    animateSnake(open, fn = () => {}) {
        Animated.timing(this.animatedFromBottom, {
            toValue: open ? 1 : 0,
            useNativeDriver: true,
        }).start(fn);
    }

    addItem = () => {
        let obj = Object.assign([], this.state.loans);
        obj.push({
            Maah: 0,
            Price: 0,
        });
        this.setState({loans: obj},
            () =>  this.installmentScrollView.scrollToEnd({animated: true}));
    };
    removeItem = (itemIndex) => {
        //this.state.items.splice(itemindex,1);
        let newList = this.state.loans.filter((item, index) => itemIndex !== index);
        this.setState({loans: newList});
        this.installmentScrollView.scrollTo({y: itemIndex * 50});
        //this.installmentScrollView.scrollToEnd({x: 0, y: 0, animated: true});

    };


    confirm() {
        const items = this.state.loans.filter((item) => {
            return (item.Price != 0 && item.Price != '' && item.Maah != 0 && item.Maah != '');
        });

        if (items.length == 0) {
            showMassage('پیام','حداقل یک سطر پر شود','info')
           // Toast.show('حداقل یک سطر پر شود', Toast.LONG);
            return;
        }
        this.props.onConfirm(items);
    }

    componentDidMount() {
        this.animateSnake(true);
    }

    setValueInArray(index, price, month) {
        console.warn('+++ontextChange price: ', price);
        this.setState(prevState => ({
            loans: prevState.loans.map(
                (o, i) => (i === index ? Object.assign(o, {
                    Price: (price || price === 0) ? price : o.Price,
                    Maah: month ? month : o.Maah,
                }) : o),
            ),
        }));
    }

    render() {

        const {
            title,
            showAdd,
            visible,
            onClose,
        } = this.props;

        const animateTranslateY = this.animatedFromBottom.interpolate({
            inputRange: [0, 1],
            outputRange: [-1000, 0],
        });
        return (
            <Modal
                visible={visible}
                animationType="fade"
                transparent={true}
                presentationStyle="overFullScreen"
                onRequestClose={onClose}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: colors.overlayColor,
                    }}>
                    <TouchableWithoutFeedback
                        onPress={() => this.animateSnake(false, onClose)}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: overlayColor,
                                ...StyleSheet.absoluteFillObject,
                            }}
                            pointerEvents={'auto'}
                        />
                    </TouchableWithoutFeedback>
                    <Animated.View
                        style={{
                            transform: [{translateY: animateTranslateY}],
                            minHeight: 200,
                            padding: 10,
                            maxHeight: global.height / 1.5,
                            position: 'absolute',
                            backgroundColor: 'white',
                            borderBottomRightRadius: 20,
                            borderBottomLeftRadius: 20,
                            //bottom: Platform.OS === 'ios' ? this.state.keyboardSpace : 0,
                            left: 0,
                            right: 0,
                            top: 0,
                        }}>

                        <TouchableWithoutFeedback
                            onPress={() => this.animateSnake(false, onClose)}
                            style={{
                                elevation: 2,
                                shadowColor: '#000',
                                shadowOffset: {width: 0, height: 1},
                                shadowOpacity: 0.5,
                                backgroundColor: 'white',
                            }}>
                            <View style={[{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                borderBottomWidth: 1,
                                borderBottomColor: '#E5DEDE',
                                alignItems: 'center',
                            },
                                // styles.actionIcon,
                            ]}>


                                <View
                                    style={[
                                        {
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        },

                                    ]}>

                                    <Image source={images.ic_close}
                                           style={{
                                               tintColor: colors.textItem,
                                               height: 24,
                                               width: 24,
                                               marginEnd: 16,
                                               marginTop: 30,
                                               marginBottom: 21,
                                               marginStart: 16,
                                           }}/>

                                    <Text
                                        style={{
                                            fontSize: 20,
                                        }}>
                                        {title}
                                    </Text>
                                </View>

                                {showAdd &&
                                <TouchableOpacity
                                    onPress={() => this.addItem()}
                                >
                                    <Image
                                        source={images.ic_addCircle}
                                        style={{
                                            tintColor: colors.accentDark,
                                            height: 24,
                                            width: 24,
                                            marginEnd: 16,
                                            marginTop: 30,
                                            marginBottom: 21,
                                            marginStart: 16,
                                        }}/>
                                </TouchableOpacity>
                                }
                            </View>
                        </TouchableWithoutFeedback>


                        <View>
                            <ScrollView
                                ref={ref => this.installmentScrollView = ref}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={true}
                                style={{
                                    paddingHorizontal: 5,
                                    paddingTop:20,
                                    paddingBottom:30,
                                    maxHeight: global.height / 1.5 - 200,
                                }}
                                contentContainerStyle={{
                                    backgroundColor: bgWhite,
                                }}

                            >

                                {this.state.loans.map((item, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: 20,
                                                marginVertical:20,
                                            }}>
                                            {this.state.loans.length > 1 && (
                                                <TouchableOpacity
                                                    style={{
                                                        //backgroundColor: colors.lightGrey,
                                                        borderRadius: 10,
                                                        height: 20,
                                                        width: 20,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        marginTop:Platform.OS === 'ios' ? 0 : 10,
                                                        marginRight: 20,
                                                    }}
                                                    onPress={() => this.removeItem(index)}

                                                >

                                                    <Image
                                                        source={images.ic_close}
                                                        style={{
                                                            tintColor: colors.lightGrey,
                                                            height: 20,
                                                            width: 20,
                                                        }}/>
                                                </TouchableOpacity>
                                            )}

                                            <View style={{flex: 1}}>
                                                <FloatingLabelTextInput
                                                    editable={true}
                                                    multiline={false}
                                                    maxLength={14}
                                                    autoFocus = {true}
                                                    keyboardType='number-pad'
                                                    numberOfLines={1}
                                                    returnKeyType="done"
                                                    floatingLabelEnable={true}
                                                    labelFontSize={9}
                                                    labelMarginButtom={10}
                                                    tintColor={placeholderTextColor}
                                                    textInputStyle={{
                                                        fontSize: 12,
                                                        color: 'black',
                                                        textAlign: 'right',
                                                    }}
                                                    underlineSize={1}
                                                    placeholder='مبلغ کمتر از'
                                                    style={{flex: 1}}
                                                    onChangeText={text => {
                                                        text = mapNumbersToEnglish(text);
                                                        if (!text || text === '') {
                                                            text = '0';
                                                        }
                                                        this.setValueInArray(index, parseInt(accounting.unformat(text), 10), null);
                                                    }}
                                                    highlightColor={primaryDark}
                                                    value={item.Price > 0 ? accounting.formatMoney(item.Price, '', 0, ',') : ''}
                                                />
                                                <Text style={{
                                                    fontSize: 9,
                                                    color: colors.black,
                                                    textAlign: 'left',
                                                    position: 'absolute',
                                                    end: 7,
                                                    top: Platform.OS === 'ios' ? -5 : 6
                                                }}>
                                                    {userStore.CurrencyID}
                                                </Text>
                                            </View>
                                            <View style={{width: 34}}/>
                                            <View style={{flex: 1}}>
                                                <FloatingLabelTextInput
                                                    editable={true}
                                                    multiline={false}
                                                    maxLength={2}
                                                    keyboardType='number-pad'
                                                    numberOfLines={1}
                                                    returnKeyType="done"
                                                    floatingLabelEnable={true}
                                                    labelFontSize={9}
                                                    labelMarginButtom={10}
                                                    tintColor={placeholderTextColor}
                                                    textInputStyle={{
                                                        fontSize: 12,
                                                        color: 'black',
                                                        textAlign: 'right',
                                                    }}
                                                    underlineSize={1}
                                                    placeholder='مدت زمان پرداخت'
                                                    style={{flex: 1}}
                                                    onChangeText={text => {
                                                        if (text === '') {
                                                            text = '0';
                                                        }
                                                        text = mapNumbersToEnglish(text);
                                                        this.setValueInArray(index, null, text);
                                                    }}
                                                    highlightColor={primaryDark}
                                                    value={item.Maah > 0 ? item.Maah : ''}

                                                />
                                                <Text style={{
                                                    fontSize: 10,
                                                    color: colors.black,
                                                    textAlign: 'left',
                                                    position: 'absolute',
                                                    end: 7,
                                                    top: Platform.OS === 'ios' ? -5 : 6
                                                }}>
                                                    ماهه
                                                </Text>
                                            </View>
                                        </View>

                                    );
                                })
                                }

                            </ScrollView>

                            <TouchableOpacity
                                onPress={() => this.confirm(this)}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: colors.accentDark,
                                    width: '90%',
                                    height: 45,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginVertical: 10,
                                    borderRadius: 10,
                                }}
                            >
                                <Text style={{color: 'white'}}>اعمال</Text>
                            </TouchableOpacity>

                        </View>

                    </Animated.View>


                </View>
            </Modal>
        );
    }
}

class CostDetailPopUpCosts extends PureComponent {
    render() {
        return (
            <View
                style={{
                    flexDirection: 'column',
                    marginVertical: 13,
                    borderRadius: 3,
                    borderWidth: 0.5,
                    borderStyle: 'dashed',
                    padding: 7,
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        position: 'absolute',
                        top: -13,
                        left: 7,
                        backgroundColor: 'white',
                        alignSelf: 'flex-start',
                        paddingHorizontal: 3,
                    }}>
                    تفکیک هزینه‌ها
                </Text>

                {this.props.perUnit > 0 && (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingBottom: 3,
                        }}>
                        <View style={{flex: 1}}>
                            <Text style={{alignSelf: 'flex-start'}}>تعداد واحد :</Text>
                        </View>
                        <Text>
                            {accounting.formatMoney(this.props.perUnit, '', 0, ',')}
                        </Text>
                    </View>
                )}

                {this.props.perPeople > 0 && (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingBottom: 3,
                        }}>
                        <View style={{flex: 1}}>
                            <Text style={{alignSelf: 'flex-start'}}>تعداد نفرات :</Text>
                        </View>
                        <Text>
                            {accounting.formatMoney(this.props.perPeople, '', 0, ',')}
                        </Text>
                    </View>
                )}

                {this.props.perSurface > 0 && (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingBottom: 3,
                        }}>
                        <View style={{flex: 1}}>
                            <Text style={{alignSelf: 'flex-start'}}>متراژ :</Text>
                        </View>
                        <Text>
                            {accounting.formatMoney(this.props.perSurface, '', 0, ',')}
                        </Text>
                    </View>
                )}

                {this.props.perParking > 0 && (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingBottom: 3,
                        }}>
                        <View style={{flex: 1}}>
                            <Text style={{alignSelf: 'flex-start'}}>تعداد پارکینگ :</Text>
                        </View>
                        <Text>
                            {accounting.formatMoney(this.props.perParking, '', 0, ',')}
                        </Text>
                    </View>
                )}

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 3,
                        borderTopWidth: 0.7,
                    }}>
                    <View style={{flex: 1}}>
                        <Text style={{alignSelf: 'flex-start'}}>هزینه کل :</Text>
                    </View>
                    <Text>{accounting.formatMoney(this.props.total, '', 0, ',')}</Text>
                </View>
            </View>
        );
    }
}

class CostDetailPopUp extends PureComponent {
    render() {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                    paddingTop: 16,
                    paddingBottom: 8,
                    paddingHorizontal: 20,
                    marginHorizontal: 24,
                    justifyContent: 'space-between',
                    borderRadius: 4,
                }}>
                <Image
                    source={
                        this.props.item.IsEmpty ? images.unitEmptyIcon : images.unitFullIcon
                    }
                    style={{
                        height: 55,
                        width: 55,
                        alignSelf: 'center',
                        marginHorizontal: 7,
                        tintColor: primaryDark,
                    }}
                />
                <Text style={{textAlign: 'center', fontSize: 10}}>
                    {this.props.item.IsEmpty ? 'واحد خالی' : 'واحد پر'}
                </Text>

                <Text>
                    واحد به شماره {this.props.item.UnitNumber}
                    {this.props.item.Name ? ' متعلق به ' + this.props.item.Name : ''}
                </Text>

                {this.props.perUnit > 0 && (
                    <Text>تعداد سکنه {this.props.item.NumberOfPeople} نفر</Text>
                )}

                <Text>مساحت {this.props.item.Area} متر مربع</Text>
                <Text>
                    {this.props.item.ParkingCount > 0
                        ? 'تعداد پارکینگ ' + this.props.item.ParkingCount + ' عدد'
                        : 'بدون پارکینگ'}
                </Text>

                <CostDetailPopUpCosts
                    perUnit={this.props.item.CalculateTypeUnitCountPrice}
                    perPeople={this.props.item.CalculateTypeNumberOfPeoplePrice}
                    perSurface={this.props.item.CalculateTypeAreaPrice}
                    perParking={this.props.item.CalculateTypeParkingCountPrice}
                    total={this.props.item.CalculatePrice}
                />
            </View>
        );
    }
}

class RowOfResult extends PureComponent {
    constructor() {
        super();
    }

    componentDidMount() {

    }

    render() {
        const {
            UnitNumber,
            FloorNumber,
            Area,
            Name,
            IsEmpty,
            CalculatePrice,
        } = this.props.item;

        return (
            <CardUnitInfo
                unitNumber={UnitNumber}
                floorNumber={FloorNumber}
                area={Area}>
                <View
                    style={{
                        flexDirection: 'column',
                        flex: 1,
                        paddingVertical: 16,
                    }}>
                    <Text
                        style={{
                            fontFamily:
                                Platform.OS === 'ios'
                                    ? 'IRANYekanFaNum-Bold'
                                    : 'IRANYekanBold(FaNum)',
                            fontSize: 18,
                            alignSelf: 'flex-start',
                        }}>
                        {Name}
                    </Text>
                    <Text
                        style={{
                            fontFamily:
                                Platform.OS === 'ios'
                                    ? 'IRANYekanFaNum-Bold'
                                    : 'IRANYekanBold(FaNum)',
                            fontSize: 18,
                            color: border,
                        }}>
                        {CalculatePrice > 0
                            ? accounting.formatMoney(CalculatePrice, '', 0, ',')
                            : CalculatePrice}
                        <Text
                            style={{
                                fontSize: 12,
                                color: border,
                            }}>
                            {' ' + userStore.CurrencyID}
                        </Text>
                    </Text>
                </View>
            </CardUnitInfo>
        );
    }
}

class FormulaDetailPopUp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            supplierList: [],
            dataDetail: props.item.detail.DataDetail ? JSON.parse(props.item.detail.DataDetail) : [],
        };
    }

    async componentDidMount() {

    }

    render() {
        const {RoleID, CostTypeName, CostClassName} = this.props.item;
        const {dataDetail} = this.state;
        const {supplierList} = this.props;
        return (
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 8,
                }}
                style={{
                    paddingTop: 16,
                    paddingBottom: 24,

                }}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{flex: 1, color: 'black', textAlign: 'center'}}>
                        فرمول
                        {' '}{CostTypeName}{' '}
                        {RoleID ? (RoleID === '2' ? '(مالک)' : '(ساکن)') : ''} -{' '}
                        {CostClassName}
                    </Text>
                </View>

                {dataDetail.map((paginator, index) => {
                    if (paginator.Zarib > 0) {
                        let title = paginator.BuildingSupplierID ? supplierList.find(t => paginator.BuildingSupplierID == Number(t.ID)).Name : paginator.RoleID == '2' ? 'مالک' : 'ساکن';
                        return (
                            <View
                                style={{
                                    marginVertical: 6,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    borderColor: subTextItem,
                                    backgroundColor: 'white',
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 5,

                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                        }}>
                                        {
                                            paginator.BuildingSupplierID && (
                                                <Image
                                                    source={
                                                        images.ic_important
                                                    }
                                                    style={{
                                                        tintColor: primaryDark,
                                                        height: 30,
                                                        width: 30,
                                                        marginEnd: -8,
                                                        marginTop: -8,
                                                        marginBottom: 5,
                                                        alignSelf: 'flex-end',
                                                    }}

                                                />
                                            )
                                        }
                                        <Text style={{}}>ضریب {title}</Text>
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            textAlign: 'center',
                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                            color: textItem,
                                            paddingTop: 3,
                                            paddingBottom: 4,
                                            borderWidth: 1,
                                            borderColor: subTextItem,
                                            borderRadius: 10,
                                            width: 70,
                                        }}
                                    >
                                        {paginator.Zarib > 0 ? paginator.Zarib.toString() : '0'}
                                    </Text>
                                </View>

                                <View
                                    style={{flexDirection: 'row', marginTop: 10}}>
                                    {
                                        paginator.Data.map((item) => {
                                            return (
                                                <View
                                                    key={item.CalculateTypeID}
                                                    style={{
                                                        justifyContent: 'center',
                                                        marginHorizontal: 2,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text style={{textAlign: 'center'}}>{item.CalculateTypeName}</Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            textAlign: 'center',
                                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                                            color: textItem,
                                                            paddingTop: 4,
                                                            paddingBottom: 3,
                                                            borderWidth: 1,
                                                            borderColor: subTextItem,
                                                            borderRadius: 10,
                                                        }}
                                                    >
                                                        {item.Zarib > 0 ? item.Zarib.toString() : '0'}
                                                    </Text>
                                                </View>
                                            );
                                        })
                                    }
                                </View>
                            </View>
                        );
                    }
                })}
                {/*<Text style={{}}> تعداد نفرات واحدهای خالی: {detail.NumberOfPeopleForEmptyUnit}</Text>*/}
            </ScrollView>
        );
    }
}

const FabMenu = (props) => {
    if (props.visibale) {
        return (<View>
            {
                props.menuItem.map((item, index) => {
                    return (<TouchableWithoutFeedback
                        key={index}
                        onPress={item.onPress}>


                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 5,
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Text style={[{
                                backgroundColor: 'white',
                                borderRadius: 15,
                                marginHorizontal: 10,
                                padding: 10,
                                elevation: 5,
                            }]}>{item.title}</Text>

                            <Fab
                                bgColor={'white'}
                                icon={item.icon}
                                onPress={item.onPress}
                            />
                        </View>
                    </TouchableWithoutFeedback>);
                })
            }
        </View>);
    } else {
        return null;
    }
};


export default class AddCost extends Component {
    constructor(props) {
        super(props);

        this.resultProcess = [];

        this.periodsDetail = [];
        this.fiscalYear = null;

        this.firstChangeType = true;

        this._listViewOffset = 0;

        this.costSettings = [];
        this.state = {
            type: true, // cost default

            showOverlay: false,
            showTitlePicker: false,
            showSortPicker: false,
            showSearchPicker: false,
            showCostDetails: false,
            loading: false,
            loadingMessage: '',
            price: 0,
            valuePicker: [],
            typeSelected: null,
            periodSelected: null,
            // searchText: '',
            sortIsAvailable: true,
            searchIsAvailable: true,
            sortDirectionDesc: true,

            selectedItem: null,

            costTypes: [],
            calculates: [],

            resultProcess: [],
            hasResultProcess: false,

            showProcessCalc: false,
            priceValidation: true,
            typeValidation: true,
            periodValidation: true,
            dateValidation: true,

            billNumber: null,
            period: null,
            startDate: null,
            endDate: null,

            nominateToDetail: null,
            nominateToSubmitDetail: null,

            showFormulaDetailPopup: false,
            showAlertFormula: false,
            showAlertPeriod: false,
            showAlertFiscalYear: false,
            showAlertSelectSetting: false,
            showDuplicate: false,
            hasAnnounced: false,
            sortItem: null,
            searchItem: searchItems[0],
            showSearchType: false,
            showSortType: false,
            isEditVisible: true,
            nominateToFormula: null,

            // costClassList: [],

            requestState: true,

            showFabMenu: false,
            installmentModal: false,




        };

        this.hideProcessCalcAfterAlertSettingIos = false;

        this.navigateSettingAfterProcessCalc = false;

        this.onPressFabMenuItem = this.onPressFabMenuItem.bind(this);

        // this.onDateChange = this.onDateChange.bind(this);
    }

    async componentDidMount() {
        this.cost = navigation.getParam('cost', null);
        this.isReport = navigation.getParam('isReport', false);
        this.permission= userStore.findPermission(permissionId.costSetting);
        this.writeAccess=this.permission && this.permission.writeAccess && !this.isReport;
        this.setState({
            costTitle: this.cost ? this.cost.CostTypeName : '',
            costClassName: this.cost ? this.cost.CostClassName : '',
            selectedCostTypeID:this.cost?this.cost.CostTypeID:undefined,
            costRoleName: this.cost ? this.cost.RoleName : '',
            costDescription: this.cost ? this.cost.CostTypeDetailName : '',
            hasPrent: (this.cost && this.cost.ParentID)?true:false,
            installmentList: (this.cost && this.cost.InstallmentData) ? this.cost.InstallmentData : [],
        })

        this.init(false);
    }

    async init(isNavigationBack) {
        // this.animateSort(true);
        // this.animateSearch(true);
        // this.animateSortDirect(false);
        await getSupplierkListQuery()
            .then(result => {
                this.setState({supplierList: result});
            })
            .catch(e => {
                globalState.showToastCard();

            })
            .finally(() => globalState.hideBgLoading());
        await this.getQueryNeed()
            .then(() => {
                // this.setState({loading: false});
                if (this.cost) {
                    this.setEditMode(this.cost);
                } else {
                    if (this.fiscalYear) {
                        if (!this.checkHasPeriod()) {
                            this.setState({
                                showAlertPeriod: true,
                            });
                        } else {
                            this.setState({
                                periodSelected: this.periodsDetail.find(o => o.IsCurrent),
                                showProcessCalc: true,
                            });
                            this.filterType(this.state.type);
                            (isNavigationBack && this.refPrice) ? this.refPrice.focus() : null;
                        }
                    } else {
                        this.setState({
                            showAlertFiscalYear: true,
                        });
                    }
                }
            }).finally(() => this.setState({loading: false}));
    }


    filterType(isCost) {
        this.setState({typeSelected: null});
        let newFiltered = [];
        if (isCost) {
            newFiltered = this.costSettings.filter(
                item => item.CostClassID !== '3' && item.HasChecked === true,
            );
        } else {
            newFiltered = this.costSettings.filter(
                item => item.CostClassID === '3' && item.HasChecked === true,
            );
        }

        this.checkShowAlertSelectSetting(newFiltered, isCost);

        this.setState({valuePicker: newFiltered});
        if (this.firstChangeType && this.cost) {
            this.setState({
                typeSelected: newFiltered.find(
                    o => o.CostTypeID === this.cost.CostTypeID,
                ),
            });
        }
        // if (newFiltered.length > 0) {
        // this.setState({typeSelected: newFiltered[0]});
        // // if (!newFiltered[0].HasFormul) this.showTitlePicker();
        // }
    }


    checkShowAlertSelectSetting(valuePicker, isCost = 'هزینه') {
        if (valuePicker.length === 0 && this.state.showProcessCalc) {
            const titleType = isCost ? 'هزینه' : 'درآمد';
            this.setState({
                // showProcessCalc: false,
                showAlertSelectSetting: true,
                alertMessage: 'هیچ ' + titleType + ' ی انتخاب نشده است',
                confirmTitle: 'انتخاب ' + titleType,
                alertTitle: 'انتخاب ' + titleType,
            });
        }
    }

    async setEditMode(cost) {
        const type = this.costSettings.find(o => o.CostTypeID == cost.CostTypeID);
        const filterType = type ? type.CostClassID !== '3' : true;

        this.setState({
            showProcessCalc: false,
            hasAnnounced: cost.HasAnnounced,
            type: filterType,
            price: cost.TotalPrice,
            billNumber: cost.BillNumber,
            startDate: cost.StartDate,
            endDate: cost.EndDate,
            periodSelected: this.periodsDetail.find(o => o.ID == cost.PeriodDetailID),
        });
        await this.filterType(filterType);
        this.setResultProcess(cost.detail);
        this.forceUpdate();
    }

    async goToFormolaScreen() {
        this.setState({loading: true, loadingMessage: 'در حال دریافت جزئیات ...'});
        await getCostSettingDetailQuery(this.state.typeSelected.CostTypeID)
            .then(result => {
                if (result.length > 0) {
                    // this.setInCalculateData(objDetail[0]);
                    const item = Object.assign(this.state.typeSelected, {detail: result[0]});
                    this.goToFormula(item);
                }
            }).catch(e => {
            }).finally(() => this.setState({loading: false}));
    }

    onPressFabMenuItem(item) {
        switch (item) {
            case 'edit':
                this.setState({showProcessCalc: true}, () => {
                    this.checkShowAlertSelectSetting(this.state.valuePicker);
                });
                this.dismiss();
                break;

            case 'installment':
                console.log('^^^^^^^^^installment: ', this.state.installmentList);
                this.setState({installmentModal: true});
                break;
            case 'formula':
                console.log(this.cost);
                console.log(this.costSettings);
                this.goToFormolaScreen();
                break;

            default:
                break;
        }
        this.setState({showFabOverlay: false, showFabMenu: false});
    }


    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'هزینه/درآمد/صندوق',
            search: !this.state.showProcessCalc
                ? {
                    onPressType: () => this.setState({showSearchType: true}),
                    onTextChange: text => this.searchProcessCalc(text),
                    typeName: this.state.searchItem.Name,
                }
                : null,
            sort: !this.state.showProcessCalc
                ? {
                    onPress: () => this.setState({showSortType: true}),
                }
                : null,
        };


        const fabMenuItem = [
            {
                title: 'قسط بندی',
                icon: images.ic_Installments,
                onPress: () => {
                    this.onPressFabMenuItem('installment');
                },
            },
            {
                title: 'ویرایش',
                icon: images.ic_edit,
                onPress: () => {
                    this.onPressFabMenuItem('edit');
                },
            },
        ];

        return (
            <MobileLayout style={{padding:0}} title={'هزینه/درآمد/صندوق'}
                          header={ <Toolbar customStyle={toolbarStyle}/>}
                          footer={
                            <View>
                                {this.state.showProcessCalc &&(
                                    <TouchableOpacity
                                        style={{
                                            marginHorizontal: 24,
                                            marginBottom: 24,
                                            backgroundColor: this.checkValidation() ? primaryDark : borderSeparate,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 10,
                                        }}
                                        onPress={() => this.processCalc()}
                                        // disabled={this.state.typeSelected == null || !this.checkHasPeriod()}
                                    >
                                        <Text
                                            style={{
                                                paddingVertical: 10,
                                                fontFamily:
                                                    Platform.OS === 'ios'
                                                        ? 'IRANYekanFaNum-Bold'
                                                        : 'IRANYekanBold(FaNum)',
                                                fontSize: 16,
                                                color: this.checkValidation() ? 'white' : subTextItem,
                                            }}>
                                            محاسبه سهم
                                        </Text>
                                    </TouchableOpacity>
                                )

                                }

                                {this.state.hasResultProcess && !this.state.showProcessCalc &&(
                                    <View>
                                        {Number(this.state.selectedCostTypeID)> 0 && this.state.isEditVisible && !this.state.hasAnnounced && !this.state.hasPrent && this.writeAccess &&(
                                            <View
                                                pointerEvents="box-none"
                                                style={{
                                                    ...StyleSheet.absoluteFillObject,
                                                    alignItems: 'flex-end',
                                                    justifyContent: 'flex-end',
                                                    flex: 1,
                                                    marginEnd: 16,
                                                    marginBottom: 68,
                                                }}>
                                                <Fab
                                                    onPress={this.onEditPress.bind(this)}
                                                    icon={images.ic_menu}
                                                />
                                            </View>
                                        )}

                                        {!this.state.hasAnnounced && !this.state.hasPrent && (
                                            <View
                                                style={{
                                                    // position: 'absolute',
                                                    // bottom: 0,
                                                    // left: 0,
                                                    // right: 0,
                                                    flexDirection: 'row',
                                                    marginTop: 6,
                                                }}>
                                                {(!this.cost || Number(this.state.selectedCostTypeID)>0) && this.writeAccess && (
                                                    <TouchableOpacity
                                                        onPress={() => this.submitCost()}
                                                        disabled={this.state.resultProcess.length === 0}
                                                        style={{flex: 1}}>
                                                        <View
                                                            style={{
                                                                height: 50,
                                                                backgroundColor:
                                                                    this.state.resultProcess.length === 0
                                                                        ? '#777'
                                                                        : primaryDark, //this.state.typeSelected == null
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}>
                                                            <Text style={{fontSize: 18, color: 'white'}}>ذخیره</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )}

                                            </View>
                                        )}
                                    </View>
                                )}

                            </View>
                          }

            >
                <View style={{flex: 1, backgroundColor: bgScreen}}>

                    <AndroidBackButton
                        onPress={() => {
                            if (this.state.showFormulaDetailPopup) {
                                this.setState({showFormulaDetailPopup: false});
                                return true;
                            }
                            this.onBackPress();
                            return true;
                        }}
                    />

                  {/*  <NavigationEvents onWillFocus={payload => {
                        if (payload.action.type === 'Navigation/BACK') {
                            this.init(true);
                        }
                    }}/>*/}

                    <SnakePopup
                        visible={this.state.showSearchType}
                        toolbarTitle="جستجو بر اساس"
                        items={searchItems}
                        onItemSelected={item => {
                            this.changeSearchType(item);
                            this.setState({showSearchType: false});
                        }}
                        onClose={() => this.setState({showSearchType: false})}
                        fromTop
                    />

                    <SnakePopup
                        visible={this.state.showSortType}
                        toolbarTitle="مرتب سازی بر اساس"
                        items={sortItems}
                        onItemSelected={item => {
                            this.changeSort(item);
                            this.setState({showSortType: false});
                        }}
                        onClose={() => this.setState({showSortType: false})}
                        fromTop
                    />

                    {this.state.showProcessCalc && (
                        <View style={{flex: 1}}>
                            <KeyboardAwareScrollView enableOnAndroid>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        //alignItems: 'center',
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            marginTop: 24,
                                            marginHorizontal: 40,
                                        }}>
                                        <SwitchText
                                            value={this.state.type}
                                            onValueChange={val => {
                                                this.setState({type: val});
                                                this.filterType(val);
                                            }}
                                            activeText={'هزینه'}
                                            inactiveText={'درآمد'}
                                            backgroundActive={primaryDark}
                                            backgroundInactive={'#fff'}
                                            activeTextStyle={{
                                                paddingVertical: 6,
                                                fontFamily:
                                                    Platform.OS === 'ios'
                                                        ? 'IRANYekanFaNum-Bold'
                                                        : 'IRANYekanBold(FaNum)',
                                                fontSize: 16,
                                            }}
                                            inactiveTextStyle={{
                                                paddingVertical: 6,
                                                fontFamily:
                                                    Platform.OS === 'ios'
                                                        ? 'IRANYekanFaNum-Bold'
                                                        : 'IRANYekanBold(FaNum)',
                                                fontSize: 16,
                                            }}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 24,
                                            marginHorizontal: 24,
                                            height: 55,
                                        }}>
                                        <ListDialogPopUp
                                            title={this.state.type ? 'انتخاب هزینه' : 'انتخاب درآمد'}
                                            snake
                                            marginTop={60}
                                            items={this.state.valuePicker}
                                            disabled={this.state.valuePicker.length === 0}
                                            minWidth={300}
                                            validation={this.state.validationType}
                                            selectedItemCustom={
                                                <View style={{flexDirection:'row',alignItems:'center',padding:3}}>
                                                    {this.state.typeSelected &&(
                                                        <Image
                                                            source={this.state.typeSelected.Icon ? images[this.state.typeSelected.Icon] : images.th_coin}
                                                            style={{
                                                                height: 24,
                                                                 width:24,
                                                                aspectRatio: 1,
                                                                resizemode: 'contain',
                                                            }}
                                                        />
                                                    )}

                                                    <Text style={[styles.text, {alignSelf: 'flex-start'}]}>
                                                        {this.state.typeSelected
                                                            ? this.state.typeSelected.CostTypeName +
                                                            ' ' +
                                                            (this.state.typeSelected.RoleID
                                                                ? this.state.typeSelected.RoleID === '2'
                                                                    ? '(مالک)'
                                                                    : '(ساکن)'
                                                                : '') +
                                                            ' - ' +
                                                            this.state.typeSelected.CostClassName
                                                            : this.state.type
                                                                ? 'انتخاب هزینه'
                                                                : 'انتخاب درآمد'}
                                                    </Text>
                                                </View>
                                            }
                                            onValueChange={item => this.changeType(item)}
                                            itemComponent={item => (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        paddingHorizontal: 8,
                                                        alignItems: 'center',
                                                    }}>
                                                    <Image
                                                        source={item.Icon ? images[item.Icon] : images.th_coin}
                                                        style={{
                                                            height: 24,
                                                             width:24,
                                                            aspectRatio: 1,
                                                            resizemode: 'contain',
                                                        }}
                                                    />
                                                    <Text style={{paddingVertical: 16,marginHorizontal:10}}>
                                                        {item.CostTypeName}{' '}
                                                        {item.RoleID
                                                            ? item.RoleID === '2'
                                                                ? '(مالک)'
                                                                : '(ساکن)'
                                                            : ''}
                                                    </Text>
                                                    <View style={{flex: 1}}>
                                                        <Text
                                                            style={{
                                                                fontSize: 12,
                                                                alignSelf: 'flex-end',
                                                            }}>
                                                            {item.CostClassName}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        />
                                        {Number(this.state.selectedCostTypeID)>0 && this.state.hasFormul==1 && this.writeAccess &&(
                                            <TouchableOpacity
                                                style={{
                                                    //flex: 0.2,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    height: '100%',
                                                }}
                                                onPress={() => this.getFormulaDetail()}
                                                disabled={
                                                    this.state.typeSelected
                                                        ? !this.state.typeSelected.HasFormul
                                                        : true
                                                }>
                                                <Image
                                                    source={images.ic_ShowPassword}
                                                    style={{
                                                        height: 24,
                                                        width: 24,
                                                        margin: 10,
                                                        //tintColor: primaryDark,
                                                        opacity: this.state.typeSelected
                                                            ? this.state.typeSelected.HasFormul
                                                                ? 1
                                                                : 0.3
                                                            : 0.3,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        )
                                        }

                                    </View>

                                    {/*قیمت*/}
                                    {Number(this.state.selectedCostTypeID)>0 &&(
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 34,
                                                marginHorizontal: 24,
                                            }}>
                                            <FloatingLabelTextInput
                                                refInput={input => this.refPrice = input}
                                                editable={true}
                                                multiline={false}
                                                maxLength={15}
                                                keyboardType="number-pad"
                                                numberOfLines={1}
                                                returnKeyType="done"
                                                // onSubmitEditing={() => this.processCalc()}
                                                floatingLabelEnable={true}
                                                tintColor={
                                                    this.state.priceValidation
                                                        ? placeholderTextColor
                                                        : lightRed
                                                }
                                                textInputStyle={{
                                                    fontFamily:
                                                        Platform.OS === 'ios'
                                                            ? 'IRANYekanFaNum-Bold'
                                                            : 'IRANYekanBold(FaNum)',
                                                    fontSize: 16,
                                                    paddingStart: 4,
                                                    paddingTop: 1,
                                                    paddingBottom: 3,
                                                    textAlign: 'right',
                                                }}
                                                underlineSize={1}
                                                placeholder={'مبلغ به ' + userStore.CurrencyID}
                                                style={{flex: 1}}
                                                onChangeText={text => {
                                                    if (text === '') {
                                                        text = '0';
                                                    }
                                                    text = mapNumbersToEnglish(text);
                                                    this.setState({
                                                        price: parseInt(accounting.unformat(text), 10),
                                                        priceValidation: true,
                                                    });
                                                }}
                                                highlightColor={primaryDark}
                                                value={
                                                    this.state.price > 0
                                                        ? accounting.formatMoney(this.state.price, '', 0, ',')
                                                        : ''
                                                }
                                            />
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        Platform.OS === 'ios'
                                                            ? 'IRANYekanFaNum-Bold'
                                                            : 'IRANYekanBold(FaNum)',
                                                    fontSize: 12,
                                                }}>
                                                {userStore.CurrencyID}
                                            </Text>
                                        </View>
                                    )
                                    }


                                    {/*شماره قبض*/}
                                    {/*دوره*/}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 24,
                                            marginHorizontal: 24,
                                        }}>
                                        <ListDialogPopUp
                                            title={
                                                this.fiscalYear
                                                    ? ' انتخاب دوره ' + this.fiscalYear.ID
                                                    : ''
                                            }
                                            snake
                                            items={this.periodsDetail}
                                            disabled={this.state.valuePicker.length === 0}
                                            minWidth={300}
                                            validation={this.state.periodValidation}
                                            selectedItem={this.state.periodSelected}
                                            onValueChange={item => this.changePeriod(item)}
                                            itemComponent={item => (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        paddingHorizontal: 8,
                                                        alignItems: 'center',
                                                    }}>
                                                    <Text
                                                        style={{
                                                            paddingVertical: 16,
                                                            alignSelf: 'flex-start',
                                                        }}>
                                                        {item.Name}
                                                    </Text>

                                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                        <Text
                                                            style={{
                                                                fontSize: 12,
                                                                color: drawerItem,
                                                            }}>
                                                            از {jMoment(item.StartDate).format('jD jMMMM')} تا{' '}
                                                            {jMoment(item.EndDate).format('jD jMMMM')}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        />
                                        {Number(this.state.selectedCostTypeID)>0 &&(
                                            <FloatingLabelTextInput
                                                editable={true}
                                                multiline={false}
                                                maxLength={15}
                                                keyboardType="number-pad"
                                                numberOfLines={1}
                                                returnKeyType="done"
                                                // onSubmitEditing={() => this.processCalc()}
                                                floatingLabelEnable={true}
                                                textInputStyle={{
                                                    fontFamily:
                                                        Platform.OS === 'ios'
                                                            ? 'IRANYekanFaNum'
                                                            : 'IRANYekanRegular(FaNum)',
                                                    fontSize: 14,
                                                    textAlign: 'right',
                                                    marginStart: 4,
                                                    paddingTop: 3,
                                                    paddingBottom: 4,
                                                }}
                                                underlineSize={1}
                                                placeholder=" شماره قبض (دلخواه)"
                                                style={{flex: 1, marginStart: 16}}
                                                onChangeText={text => {
                                                    this.setState({
                                                        billNumber: text,
                                                    });
                                                }}
                                                highlightColor={primaryDark}
                                                value={this.state.billNumber}
                                            />
                                        )
                                        }

                                    </View>

                                    {/*تاریخ شروع*/}
                                    {/*تاریخ پایان*/}
                                    <View style={{flexDirection: 'row', margin: 24}}>
                                        <View style={{flex: 1}}>
                                            <PersianCalendarPickerPopup
                                                showToday
                                                validation={this.state.dateValidation}
                                                selectedDate={this.state.startDate}
                                                onValueChange={date =>
                                                    this.setState({
                                                        startDate: date,
                                                        dateValidation: true,
                                                    })
                                                }
                                                defaultTitle={
                                                    this.state.typeSelected
                                                        ? !this.state.typeSelected.IsPeriodical
                                                        ? 'تاریخ'
                                                        : 'شروع'
                                                        : 'تاریخ'
                                                }
                                            />
                                        </View>
                                        {this.state.typeSelected &&
                                        this.state.typeSelected.IsPeriodical && (
                                            <View style={{flex: 1, marginStart: 16}}>
                                                <PersianCalendarPickerPopup
                                                    showToday
                                                    validation={this.state.dateValidation}
                                                    selectedDate={this.state.endDate}
                                                    onValueChange={date =>
                                                        this.setState({
                                                            endDate: date,
                                                            dateValidation: true,
                                                        })
                                                    }
                                                    defaultTitle="پایان"
                                                />
                                            </View>
                                        )}
                                    </View>

                                    {/*توضیحات*/}
                                    {(this.state.typeSelected && this.state.typeSelected.HasDescription) && (
                                        <View style={{flexDirection: 'row', margin: 24}}>
                                            <TextInput
                                                placeholder="توضیحات..."
                                                placeholderTextColor={subTextItem}
                                                style={{
                                                    flex: 1,
                                                    paddingHorizontal:10,
                                                    borderColor: subTextItem,
                                                    borderWidth: 1,
                                                    borderRadius: 10,
                                                    fontSize: 14,
                                                    textAlignVertical: 'top',
                                                    textAlign: 'right',
                                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                                    height: 110,
                                                }}

                                                multiline={true}
                                                onChangeText={text => this.setState({costDescription: text})}
                                                returnKeyType="done"
                                                value={this.state.costDescription}
                                                maxLength={100}
                                                numberOfLines={5}
                                            />
                                        </View>
                                    )}
                                </View>
                            </KeyboardAwareScrollView>
                        </View>
                    )}
                    {this.state.hasResultProcess && !this.state.showProcessCalc && (
                        <View style={{flex: 1}}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    paddingHorizontal: 16,
                                    backgroundColor: bgItem,
                                }}>
                                <View style={{flex: 1}}>
                                    <View   style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        paddingVertical: 8,
                                        marginTop: 10,
                                    }}>
                                        <TouchableOpacity
                                            style={{
                                                marginHorizontal: 5,
                                            }}
                                            disabled={
                                                this.state.typeSelected
                                                    ? !this.state.typeSelected.HasFormul
                                                    : true
                                            }>
                                            <Text
                                                style={{
                                                    color: textItem,
                                                    fontSize: 18,
                                                    fontFamily:
                                                        Platform.OS === 'ios'
                                                            ? 'IRANYekanFaNum-Bold'
                                                            : 'IRANYekanBold(FaNum)',


                                                }}>
                                                {this.state.costTitle}
                                            </Text>
                                        </TouchableOpacity>
                                        {Number(this.state.selectedCostTypeID)>0 && this.writeAccess &&(
                                                <TouchableOpacity
                                                    style={{
                                                        padding: 5,
                                                    }}
                                                    onPress={() => this.getFormulaDetail()}
                                                    disabled={
                                                        this.state.typeSelected
                                                            ? !this.state.typeSelected.HasFormul
                                                            : true
                                                    }>

                                                        <Image
                                                            source={images.ic_ShowPassword}
                                                            style={{
                                                                height: 24,
                                                                width: 24,
                                                                padding:10,
                                                                marginTop: 5,
                                                               // tintColor: primaryDark,
                                                                opacity: this.state.typeSelected
                                                                    ? this.state.typeSelected.HasFormul
                                                                        ? 1
                                                                        : 0.3
                                                                    : 0.3,
                                                            }}
                                                        />

                                                </TouchableOpacity>
                                        )
                                        }
                                    </View>


                                    <Text
                                        style={{
                                            color: subTextItem,
                                            fontSize: 12,
                                            paddingBottom: 16,
                                        }}>
                                        {this.state.costClassName}{' '}
                                        .{' '}
                                        {this.state.periodSelected ? this.state.periodSelected.Name : ''}{' '}

                                    </Text>

                                </View>
                                <View style={{flex: 1}}>
                                    <Text
                                        style={{
                                            color: textItem,
                                            fontSize: 18,
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? 'IRANYekanFaNum-Bold'
                                                    : 'IRANYekanBold(FaNum)',
                                            alignSelf: 'flex-end',
                                        }}>
                                        {accounting.formatMoney(this.state.price, '', 0, ',')}
                                    </Text>
                                    <Text
                                        style={{
                                            color: subTextItem,
                                            fontSize: 12,
                                            alignSelf: 'flex-end',
                                        }}>
                                        {userStore.CurrencyID}
                                    </Text>
                                </View>
                            </View>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={this.state.resultProcess}
                                extraData={this.state}
                                onScroll={this.onScrollFab}
                                // ItemSeparatorComponent={() => (<View style={{height:13}}></View>)}
                                renderItem={({item, index}) => (
                                    // <TouchableOpacity  onPress={this.showCostDetails.bind(this, item)}>
                                    <RowOfResult
                                        item={item}
                                        index={index}
                                        itemDetail={itemSelected => this.itemPeriods(itemSelected)}
                                        itemEdit={item => this.itemAddEdit(item)}
                                    />
                                    // </TouchableOpacity>
                                )}
                            />


                        </View>
                    )}

                    { this.state.showFabMenu  && this.writeAccess &&(
                        <Overlay catchTouch={true} onPress={this.dismiss.bind(this)}>
                            <View style={{flex: 1}}>
                                <View
                                    style={{                                    flex: 1,
                                        alignItems: 'flex-end',
                                        justifyContent: 'flex-end',
                                        alignSelf: 'flex-end',
                                        marginEnd: 16,
                                        marginBottom: 68,
                                    }}>

                                    <FabMenu visibale={this.state.showFabMenu} menuItem={fabMenuItem}/>

                                    <Fab
                                        onPress={this.onEditPress.bind(this)}
                                        icon={images.ic_close}
                                    />

                                </View>
                            </View>
                        </Overlay>
                    )}


                    {this.state.showOverlay && (
                        <Overlay catchTouch={true} onPress={this.dismiss.bind(this)}>
                            {this.state.showCostDetails && (
                                <CostDetailPopUp
                                    item={this.state.selectedItem}
                                    dismiss={() => this.dismiss()}
                                />

                                // TODO from here should you continue
                            )}
                        </Overlay>
                    )}

                    {this.state.installmentModal && (
                        <InstallmentDialog
                            visible={this.state.installmentModal}
                            items={this.state.installmentList}
                            onClose={() => {
                                console.log('////////////////// onClose: items: ', this.state.installmentList);
                                this.setState({installmentModal: false});
                            }}
                            title={'قسط بندی هزینه'}
                            showAdd={true}
                            onConfirm={items => {
                                console.log('////////////////// confirm: items: ', items);
                                this.setState({installmentList: items, installmentModal: false});
                                showMassage('بعد از اعمال ذخیره کنید', 'مهم', 'success');
                            }}
                        />
                    )}

                    <AlertMessage
                        visible={this.state.showAlertFiscalYear}
                        title="سال مالی"
                        message="برای ثبت هزینه باید سال مالی را انتخاب نمایید!"
                        onConfirm={() => this.goToSelectYear()}
                        onDismiss={() => this.closeModalProcessCalcPopup()}
                        confirmTitle="انتخاب سال مالی"
                        // onFinish={() => this.shutdownModal()}
                    />
                    <AlertMessage
                        visible={this.state.showAlertPeriod}
                        title="انتخاب دوره"
                        message="برای سال مالی انتخابی دوره ای تعریف نشده، لطفاً دوره مورد نظر را اضافه نمایید"
                        onConfirm={() => this.goToPeriod()}
                        onDismiss={() => this.closeModalProcessCalcPopup()}
                        confirmTitle="ثبت دوره"
                        // onFinish={() => this.shutdownModal()}
                    />

                    {/*اخطار عدم انتخاب هزینه/درآمد*/}
                    <AlertMessage
                        visible={this.state.showAlertSelectSetting}
                        title={this.state.alertTitle}
                        message={this.state.alertMessage}
                        onConfirm={() => this.goToSetting()}
                        onDismiss={() => {
                            this.setState({showAlertSelectSetting: false});
                            this.onBackPress();
                        }}
                        // onFinish={() => this.shutdownModal()}
                        confirmTitle={this.state.confirmTitle}
                    />

                    {/*اخطار عدم ثبت فرمول*/}
                    <AlertMessage
                        visible={this.state.showAlertFormula}
                        title={this.state.alertTitle}
                        message={this.state.alertMessage}
                        onConfirm={() => this.goToFormula(this.state.nominateToFormula)}
                        onDismiss={() => this.onAlertDismiss()}
                        confirmTitle={this.state.confirmTitle}
                    />

                    {/*اخطار ثبت تکراری در یک دوره*/}
                    {this.state.showDuplicate && (
                        <AlertMessage
                            visible={this.state.showDuplicate}
                            title={this.state.type ? 'هزینه تکراری' : 'درآمد تکراری'}
                            message={
                                this.state.showDuplicateMessage +
                                ' \n آيا میخواهید ادامه دهید؟'
                            }
                            onConfirm={() => {
                                this.setState({showDuplicate: false});
                                this.processCalc(1);
                            }}
                            onDismiss={() => this.setState({showDuplicate: false})}
                            confirmTitle="ادامه"
                            // onFinish={() => this.shutdownModal()}
                        />
                    )}

                    {this.state.showUnitFailedAndGo && (
                        <AlertMessage
                            visible={this.state.showUnitFailedAndGo}
                            title='اطلاعات واحد'
                            message={this.state.unitFailedMessage + '\n' +
                            'واحد(های) اعلامی را بررسی نمایید!'
                            }
                            onConfirm={() => {
                                this.setState({showUnitFailedAndGo: false});
                                this.goToUnits();
                            }}
                            onDismiss={() => this.setState({showUnitFailedAndGo: false})}
                            confirmTitle="تنظیمات واحد"
                            // onFinish={() => this.shutdownModal()}
                        />
                    )}
                    <SimpleSnake
                        visible={this.state.showFormulaDetailPopup}
                        //toolbarTitle=" "
                        //items={sortItems}
                        onClose={() => this.setState({showFormulaDetailPopup: false})}
                        fromTop
                    >
                        <FormulaDetailPopUp
                            item={this.state.nominateToDetail}
                            calculateList={this.state.calculates}
                            supplierList={this.state.supplierList}
                            dismiss={() => this.dismiss()}
                        />
                    </SimpleSnake>


                    <LoadingPopUp
                        visible={this.state.loading}
                        message={this.state.loadingMessage}
                        // onFinish={() => this.finishLoadingIos()}
                    />
                </View>
            </MobileLayout>
        );
    }

    onEditPress() {
        if (!this.state.showFabMenu) {
           //saeed LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        }
        this.setState({showFabMenu: !this.state.showFabMenu, showFabOverlay: !this.state.showFabOverlay});
    }

    checkValidation() {
        if ( !this.state.typeSelected) {
            return false;
        }

        //ToDo min Price validation
        if (Number(this.state.selectedCostTypeID)>0 && this.state.price < 1000) {
            return false;
        }

        if (!this.checkHasPeriod()) {
            return false;
        }

        if(!this.state.periodSelected)
            return false;


        return true;
    }

    /* finishLoadingIos() {
      if (this._showProcessCalcIos) this.setState({showProcessCalc: true});
      else if (this._showAlertPeriodIos) this.setState({showAlertPeriod: true});
      else if (this._showAlertFiscalYearIos) this.setState({showAlertFiscalYear: true});
      else if (this._showFormulaDetailPopupIos) this.setState({showFormulaDetailPopup: true});

      this._showProcessCalcIos = false;
      this._showAlertPeriodIos = false;
      this._showAlertFiscalYearIos = false;
      this._showFormulaDetailPopupIos = false;
      }*/

    shutdownModal() {
        if (this.hideProcessCalcAfterAlertSettingIos) {
            this.navigateSettingAfterProcessCalc = true;
            this.setState({showProcessCalc: false});
        }
        if (this.navigateAfterAlertFiscalYear) {
            navigation.navigate('Years');
        }

        this.hideProcessCalcAfterAlertSettingIos = false;
        this.navigateAfterAlertFiscalYear = false;
    }

    onAlertDismiss() {
        this.setState({showAlertFormula: false});
    }

    onBackPress() {
        if (this.state.showSearchType) {
            this.setState({showSearchType: false});
            return;
        } else if (this.state.showSortType) {
            this.setState({showSortType: false});
            return;
        }
        if (this.state.showProcessCalc && this.state.hasResultProcess && this.state.requestState) {
           //saeed LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            this.setState({showProcessCalc: false});
            return;
        }
        if (this.state.showCostDetails) {
            this.setState({
                showOverlay: false,
                showCostDetails: false,
            });
            return;
        }
        navigation.goBack();
    }

    checkHasPeriod() {
        return this.fiscalYear.HasPeriod; //(this.periods.length > 0 && this.periods.HasPeriod === true)
    }

    dismiss() {
        this.setState({
            showOverlay: false,
            showTitlePicker: false,
            showSortPicker: false,
            showSearchPicker: false,
            showCostDetails: false,
            selectedItem: null,
            showFormulaDetailPopup: false,
            showFabMenu: false,
            showFabOverlay: false,
        });
    }

    closeModalProcessCalcPopup() {
        //this._showProcessCalcIos
        this.setState({
            showAlertFiscalYear: false,
            showAlertPeriod: false,
        });
        if (this.state.resultProcess.length > 0) {
            this.setState({showProcessCalc: false});
        } else {
            this.onBackPress();
        }
    }

    showTitlePicker() {
        this.setState({
            showOverlay: true,
            showTitlePicker: true,
            validationType: true,
        });
    }

    /* showPeriodPicker() {
      this.setState({
      showOverlay: true,
      showPeriodPicker: true,
      periodValidation: true,
      })
      }*/

    showSortPicker() {
        this.setState({
            showOverlay: true,
            showSortPicker: true,
        });
    }

    showSearchPicker() {
        this.setState({
            showOverlay: true,
            showSearchPicker: true,
        });
    }

    showCostDetails(item) {
        this.setState({
            showOverlay: true,
            showCostDetails: true,
            selectedItem: item,
        });
    }

    async getFormulaDetail() {
        this.setState({loading: true, loadingMessage: 'در حال دریافت جزئیات ...'});
        await getCostSettingDetailQuery(this.state.typeSelected.CostTypeID)
            .then(result => {
                if (result.length > 0) {
                    // this.setInCalculateData(objDetail[0]);
                    const item = Object.assign(this.state.typeSelected, {detail: result[0]});

                    this.setState({
                        nominateToDetail: item,
                        showFormulaDetailPopup: true,
                    });
                }
            }).catch(e => {
            }).finally(() => this.setState({loading: false}));
    }

    finishProcesCalc() {
        if (this.navigateSettingAfterProcessCalc) {
            navigation.navigate('Setting');
        }

        this.navigateSettingAfterProcessCalc = false;
    }

    //ToDo goTo AddSetting
    goToFormula(item) {
        const settingItem = {
            buildingId: item.BuildingID,
            title: item.CostTypeName,
            isPeriodical: item.IsPeriodical,
            costTypeId: item.CostTypeID,
            costClassId: item.CostClassID,
            state: item.HasChecked,
            hasFormul: item.HasFormul,
        };
        this.setState({showAlertFormula: false}, () =>
            navigation.navigate('AddSetting', {
                settingItem,
                costClassList: this.state.costClassList,
                costCalculateList: this.state.calculates,
                occupationList: null,
            }),
        );
        // this.setState({showSubmitDetail: true})
    }

    goToUnits() {
        navigation.navigate('Units');
    }

    goToSetting() {
        this.setState(
            {
                showAlertSelectSetting: false,
                showProcessCalc: false,
            },
            () => navigation.navigate('Setting'),
        );
    }

    goToSelectYear() {
        this.setState(
            {
                showAlertFiscalYear: false,
                showAlertPeriod: false,
            },
            () => navigation.navigate('Years'),
        );

        /* ToDo if year fix goto Period
        * navigation.navigate('Period', {
            year: item.name,
            startDate: item.startDate,
            endDate: item.endDate,
            hasPeriod: item.hasPeriod,
            defaultPeriodsCount: 12,
        });*/
    }

    goToPeriod() {
        this.setState(
            {showAlertPeriod: false}, () =>
                navigation.navigate('Period', {year: this.fiscalYear.ID, defaultPeriodsCount: 12}),
        );
    }

    changeType(item) {
        console.warn('############# changeType itme: ', item);
        if (this.firstChangeType) {
            this.firstChangeType = false;
        }
        if (item.HasFormul) {
            // this.dismiss();
            this.setState({
                typeSelected: item,
                selectedCostTypeID:item.CostTypeID,
                hasFormul:item.HasFormul,
                validationType: true,
                costTitle: item.CostTypeName,
                costClassName: item.CostClassName,
                costRoleName: item.RoleID === '2' ? ' مالک' : 'ساکن',
            });
        } else {
            console.log('^^^^^^^^^^^^AddCost itemDetail item:', item);
            this.setState({
                showAlertFormula: true,
                selectedCostTypeID:item.CostTypeID,
                hasFormul:item.HasFormul,
                alertMessage:
                    'شما برای " ' +
                    item.CostTypeName +
                    '" فرمول تعریف نکرده اید! \n فرمول را اضافه نمایید و یا نوع هزینه/درآمد را تغییر دهید.',
                confirmTitle: 'ثبت فرمول',
                alertTitle: 'ثبت فرمول',
                nominateToFormula: item,
            });

            this.getSettingDetail(item);
        }
    }

    async getSettingDetail(item) {
        let itemSettingDetial = {
            buildingId: item.BuildingID,
            title: item.CostTypeName,
            isPeriodical: item.IsPeriodical,
            costTypeId: item.CostTypeID,
            costClassId: item.CostClassID,
            price: item.PriceInFixedCharge,
            state: item.HasChecked,
            hasFormul: item.HasFormul,
        };

        // this.setState({loading: true, loadingMessage: 'در حال دریافت جزئیات ...'});
        await getCostSettingDetailQuery(itemSettingDetial.costTypeId)
            .then(result => {
                let detailItem = {};
                if (result.length > 0) {
                    detailItem = result[0];
                } else {
                    detailItem = {
                        OccupationTypeID: 1,
                        CostOwner: false,
                        Description: '',
                        NumberOfPeopleForEmptyUnit: 0,
                    };
                }
                itemSettingDetial = Object.assign(itemSettingDetial, {detail: detailItem});
                this.setState({nominateToSubmitDetail: itemSettingDetial});
            }).catch(e => {
            }).finally(() => {
            });


        await getCostCalculateQuery()// Enum CostCalculate
            .then(result => this.setState({calculates: result}))
            .catch(e => {
            });
    }

    changePeriod(item) {
        this.dismiss();
        this.setState({periodSelected: item, periodValidation: true});
    }

    changeSort(item) {
        this.setState({sortItem: item});
        this.sortProcessCalc(item);
    }

    sortProcessCalc(item) {
        // if (item) key = Object.keys(item)[0];
        // else key = Object.keys(this.state.sortItem)[0];
        let arraySortProcess = this.state.resultProcess;
        arraySortProcess.sort(compare2sort(item.codeName));
        if (item.isDescending) {
            arraySortProcess.reverse();
        }
        // let key = Object.keys(item)[0];
        // arraySortProcess.sort(this.compareValues(key));
        this.setState({resultProcess: arraySortProcess});
    }

    changeSearchType(item) {
        this.setState({searchItem: item},
            () => this.searchProcessCalc(this.state.searchText));
    }

    searchProcessCalc(text) {
        if (text) {
            text = mapNumbersToEnglish(text);
            if (!this.state.showProcessCalc) {
                this.setState({searchText: text});
                let key = this.state.searchItem ? this.state.searchItem.codeName : '';
                const searchedProcess = this.resultProcess.filter(item => {
                    const itemData = `${item[key]}`;
                    return (this.state.searchItem.Name === 'مالک' ? (item.RoleID == 2 || item.RoleName === 'مالک و ساکن') :
                            this.state.searchItem.Name === 'ساکن' ? item.RoleID == 3 : true
                    ) && itemData.indexOf(text) > -1;
                });
                this.setState({resultProcess: searchedProcess});
            }
        } else {
            this.setState({resultProcess: this.resultProcess, searchText: ''});
        }
    }


    changeSearch(item) {
        this.dismiss();
        this.setState({searchItem: item, searchText: ''});
        this.searchProcessCalc('');
    }

    /*
* //exec dbo.EnumCalculateType_Select
go
 // exec dbo.EnumCostClass_Select
go
// exec Setting.Year_Select @BuildingID=9,@UserID=15
go
// exec dbo.EnumCostType_Select @BuildingID=9
go
exec Setting.Period_Select @BuildingID=9,@UserID=15,@Year=1398
go
exec Setting.Cost_Select @BuildingID=9,@UserID=15
go*/

    async getQueryNeed() {
        this.setState({loading: true, loadingMessage: 'در حال دریافت .. ..'});



        await getCostSettingQuery()
            .then(result => {
                console.log(result);
                this.costSettings = result
            })

            .catch(e => {
            });

        await getCostCalculateQuery()
            .then(result => this.setState({calculates: result}))
            .catch(e => {
            });

        await getYearQuery()
            .then(async result => {
                this.fiscalYear = result.find(o => o.IsDefaultYear == true);

                if (this.fiscalYear) {
                    await getPeriodQuery(this.fiscalYear.ID, null)
                        .then(pResult => {
                            this.periodsDetail = pResult.length > 0 ? JSON.parse(pResult[0].Detail) : [];
                        });
                }
            })
            .catch(e => {
            });


        // this.setState({loading: false});
    }

    // showWithoutPeriod() {
    // this.setState({
    // showOverlay: true,
    // showNoPeriodPopup: true,
    // })
    // }

    async processCalc(confirmDuplicate = 0) {
        Keyboard.dismiss();
        if (!this.state.typeSelected) {
            this.setState({validationType: false});
            Toast.show('هزینه یا درآمد را انتخاب کنید', Toast.LONG);
            return;
        }
        // if (!this.state.typeSelected.HasFormul) {
        // this.setState({typeValidation: false});
        // this.showWithoutFormula(this.state.typeSelected);
        // return;
        // }
        //ToDo min Price validation
        if (Number(this.state.selectedCostTypeID)>0 && this.state.price < 1000) {
            this.setState({priceValidation: false});
            Toast.show('مبلغ وارد نشده یا صحیح نمی باشد!', Toast.LONG);
            return;
        }

        //ToDo Period Validation
        if (!this.checkHasPeriod()) {
            this.setState({periodValidation: false});
            // this.showWithoutPeriod();
            return;
        }
        if (!this.state.periodSelected) {
            this.setState({periodValidation: false});
            Toast.show('دوره انتخاب نشده', Toast.LONG);
            return;
        }

        if (
            this.state.startDate &&
            this.state.endDate &&
            jMoment(this.state.startDate).format('YYYY-MM-DD') >=
            jMoment(this.state.endDate).format('YYYY-MM-DD')
        ) {
            this.setState({dateValidation: false});
            Toast.show('تاریخ شروع و پایان اشتباه است!', Toast.LONG);
            return;
        }

        this.setState({loading: true, loadingMessage: 'در حال محاسبه نتایج ...'});
        const item = {
            BuildingID: userStore.BuildingID,
            UnitID: userStore.UnitID,
            CostTypeID: this.state.typeSelected.CostTypeID,
            Price: this.state.price,
            PeriodDetailID: this.state.periodSelected.ID,
            HasConfirmed: confirmDuplicate,
        };

        if (this.cost) {
            Object.assign(item, {ID: this.cost.CalculationHeaderID});
        }

        await getProcessCalc(item)
            .then(result => {
                console.warn('############### getProcessCalc result', result);
                this.setResultProcess(result);
                this.setState({showProcessCalc: false, requestState: true});

            })
            .catch(e => {
                console.log(e);
                if (e.errCode === -26) {
                    this.setState({showDuplicate: true, showDuplicateMessage: e.errMessage});
                } else if (e.errCode === -19) {
                    this.setState({showUnitFailedAndGo: true, unitFailedMessage: e.errMessage});
                } else if (e.errCode === -36) {
                    showMassage('لیست هزینه انتخابی خالی است.',"پیام ",'error');
                }
                else {
                    globalState.showToastCard();
                }
                this.setState({requestState: false});
            })
            .finally(() => this.setState({loading: false}));
    }

    setResultProcess(dataList) {
        if (dataList.length > 0) {
            this.resultProcess = dataList;
            let calculatePrice=0;
            dataList.map(item=>calculatePrice+=Number(item.CalculatePrice));
            this.setState({
                resultProcess: dataList,
                price:this.state.price,
                calculatePrice:calculatePrice,
                hasResultProcess: true,
            });
        }
    }

    /*onSettingDetailResultSave(item) {
      if (Platform.OS === 'android') this.setState({showSubmitDetail: false});
      if (item.result) this.init()
      }*/

    async submitCost() {
        Keyboard.dismiss();

        globalState.showBgLoading();
        const item = {
            BuildingID: userStore.BuildingID,
            UnitID: userStore.UnitID,
            CostTypeID: this.state.typeSelected.CostTypeID,
            TotalPrice: this.state.price,
            BillNumber: this.state.billNumber,
            StartDate: this.state.startDate
                ? jMoment(this.state.startDate).format('YYYY-MM-DD')
                : null,
            EndDate: this.state.endDate
                ? jMoment(this.state.endDate).format('YYYY-MM-DD')
                : null,
            PeriodDetailID: this.state.periodSelected.ID,
            CostTypeDetailName: this.state.costDescription?this.state.costDescription:null,

        };
        if(this.state.installmentList && this.state.installmentList.length > 0)
          item.InstallmentData= this.state.installmentList;

        if (this.cost) {
            Object.assign(item, {ID: this.cost.CalculationHeaderID});
        }
        console.log(item);
        await submitAddCost(item)
            .then(() => {
                this.setState({loading: false});
                navigation.goBack();
                globalState.showToastCard();

            })
            .catch(e => {
                globalState.showToastCard();
            })
            .finally(() => globalState.hideBgLoading());

    }

    onScrollFab = event => {
        const fabStatus = onScrollFab(event, this._listViewOffset);
        this._listViewOffset = fabStatus.currentOffset;
        if (fabStatus.isFabVisible !== this.state.isFabVisible) {
           //saeed LayoutAnimation.configureNext(fabStatus.customLayoutLinear);
            this.setState({isFabVisible: fabStatus.isFabVisible});
        }
    };
}

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        fontFamily:
            Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        marginStart: 10,
        marginTop: 5,
        marginBottom: 7,
    },
    buttonIn: {
        // flex: 1,
        borderWidth: 0.5,
        alignItems: 'center',
        borderRadius: 4,
        height: 33,
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7,
    },
    noneBorder: {
        borderWidth: 0,
    },
});

const sortItems = [
    {
        Name: ' شماره واحد(کم به زیاد)',
        codeName: 'UnitNumber',
        isDescending: false,
    },
    {Name: ' شماره واحد(زیاد به کم)', codeName: 'UnitNumber', isDescending: true},
    {Name: 'مساحت(کم به زیاد)', codeName: 'Area', isDescending: false},
    {Name: 'مساحت(زیاد به کم)', codeName: 'Area', isDescending: true},
];

const searchItems = [
    {Name: 'مالک', codeName: 'Name'},
    {Name: 'ساکن', codeName: 'Name'},
    {Name: 'شماره واحد', codeName: 'UnitNumber'},
    {Name: 'مساحت', codeName: 'Area'},
];
