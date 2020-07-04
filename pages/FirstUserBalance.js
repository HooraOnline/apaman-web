import {
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from '../src/react-native';
import React, {PureComponent} from 'react';
import {AndroidBackButton, CardUnitInfo, LoadingPopUp, Overlay, SnakePopup, Toolbar,FloatingLabelTextInput} from '../src/components';
import {globalState, userStore} from '../src/stores';
import {black, gray, primary, primaryDark} from '../src/constants/colors';
import {permissionId} from '../src/constants/values';
import {getFirstUserBalanceNew, setFirstUserBalance} from '../src/network/Queries';
import {parseTimeToJalaali, compare2sort, mapNumbersToEnglish, waitForData,} from '../src/utils';
import accounting from 'accounting';
import jMoment from 'moment-jalaali';
import images from "../public/static/assets/images";
import MobileLayout from "../src/components/layouts/MobileLayout";

//const PersianCalendarPicker = require('react-native-persian-calendar-picker');

class FirstUserBalanceElement extends PureComponent {
    render() {
        const {
            Name, RoleName, UnitID, UnitNumber, FloorNumber, Area, Price, HasPaid, Sign,flatList
        } = this.props.item;
        const balanceAmount = Math.abs(parseInt(Price)).toString();
        return <View style={styles.container}>
            <CardUnitInfo unitNumber={UnitNumber} floorNumber={FloorNumber} area={Area}
                          borderColor={!HasPaid ? Sign ? '#ea4523' : '#0CB59F' : '#8A7E7E'}>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                    }}>
                    <View style={{
                        flexDirection: 'column',
                        paddingVertical: 18,
                        paddingHorizontal: 0,
                        flex: 1,
                        alignItems: 'center',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginBottom: 19,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={{
                                flex: 1,
                                marginRight: 7,
                                marginLeft: 0,
                                color: black,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                fontSize: 18,
                                textAlign: 'left',
                            }}>
                                {Name}
                            </Text>
                            <Text style={{
                                marginRight: 20,
                                marginLeft: 0,
                                color: gray,
                                fontSize: 11,
                            }}>
                                {RoleName}
                            </Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {HasPaid ? (
                                <Text style={{flex: 1, fontSize: 14, textAlign: 'left', marginEnd: 5}}>
                                    {Price ? accounting.formatMoney(balanceAmount, '', 0, ',') : '0'}
                                </Text>
                            ) : (
                                <FloatingLabelTextInput
                                    ref="textInput"
                                    //onFocus={()=>{if(Platform.OS === 'ios' && this.props.isLastItem) this.props.flatList.scrollToEnd()}}
                                    multiline={false}
                                    maxLength={11}
                                    numberOfLines={1}
                                    keyboardType='number-pad'
                                    returnKeyType="done"
                                    tintColor={this.props.color}
                                    textInputStyle={{
                                        fontFamily:  'IRANYekanFaNum',
                                        fontSize: 14,
                                        color: 'black',
                                        textAlign: 'right',
                                        marginEnd: 20,
                                    }}
                                    underlineSize={1}
                                    placeholder='0'
                                    style={{
                                        flex: 1,
                                    }}
                                    onChangeText={text => {
                                        if (text === '') {
                                            text = '0';
                                        }
                                        text = mapNumbersToEnglish(text);
                                        this.props.onValueChanged(this.props.id, parseInt(accounting.unformat(text)), 10);
                                    }}
                                    highlightColor={primaryDark}
                                    value={balanceAmount ? accounting.formatMoney(balanceAmount, '', 0, ',') : ''}
                                />
                            )
                            }

                            <Text style={{
                                    fontSize: 10,
                                    color: black,
                                    textAlign: 'left',
                                    position: 'absolute',
                                    // top: -4,
                                    end: 21,
                                  }}

                            >
                                {userStore.CurrencyID}
                            </Text>

                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            marginEnd: -16,
                            width: 41,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottomEndRadius: 10,
                            borderTopEndRadius: 10,
                            overflow: 'hidden',
                        }}>

                        <View
                            style={{
                                flex: 1,
                                width: 41,
                                backgroundColor: Sign ? '#F5F1F1' : '#0CB59F',
                                borderTopEndRadius: 8,
                                marginTop: 1,
                                marginEnd: 2,
                            }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                disabled={HasPaid}
                                onPress={() => {
                                    if (!HasPaid) {
                                        this.props.onSignChanged(this.props.id, 0);
                                    }
                                }}
                            >
                                <Image
                                    source={images.ic_plus}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: Sign ? '#D5CBCB' : '#FFFFFF',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={{
                                flex: 1,
                                width: 41,
                                backgroundColor: Sign ? '#ea4523' : '#F5F1F1',
                                borderBottomEndRadius: 8,
                                marginBottom: 1,
                                marginEnd: 2,
                            }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                disabled={HasPaid}
                                onPress={() => {
                                    if (!HasPaid) {
                                        this.props.onSignChanged(this.props.id, 1);
                                    }
                                }}
                            >
                                <Image
                                    source={images.ic_minus}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: Sign ? '#FFFFFF' : '#D5CBCB',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </CardUnitInfo>
        </View>;
    }
}

export default class FirstUserBalance extends PureComponent {
    constructor() {
        super();

        this.usersBalance = [];
        this.pageSize = 100;
        this.permission = userStore.findPermission(permissionId.defineFirstUserBalance);
        this.state = {
            showDatePickerDialog: false,
            unitsCount: 0,
            priceSum: 0,
            pristine: true,
            searchItem: searchItems[0],
            showSearchType: false,
            showSortType: false,
            usersBalance: []
        };
    }


    componentDidMount() {
        waitForData(()=>{
            this.getUserBalanceList();
        });

    }

    async getUserBalanceList(pageIndex) {
        if(!pageIndex){
            this.usersBalance=[];
            this.showLoading();
        }
       this.setState({loadingMorDara:true})
        await getFirstUserBalanceNew(this.pageSize, pageIndex)
            .then(result => {

                this.lastList = result;
                this.usersBalance = this.usersBalance.concat(result);
                this.state.usersBalance = result;//this.usersBalance;
                this.initUsersBalance();
            })
            .catch(e => globalState.showToastCard())
            .finally(()=> this.hideLoading());

    }

    initUsersBalance() {
        let priceSum = 0;
        this.usersBalance.map(item => {
            priceSum += Number(item.Price);
        });
        this.setState({
            deadline: this.usersBalance[0].LastPayDate || null,
            usersBalance: this.usersBalance,
            unitsCount: this.usersBalance.length,
            priceSum: priceSum,
        });
    }

    showLoading(message = 'در حال دریافت اطلاعات...') {
        this.setState({loading: true, loadingMessage: message});
    }

    hideLoading() {
        this.setState({loading: false,loadingMorDara:false});
    }

    onSignChange(index, sign) {
        this.state.usersBalance[index].Sign = sign;
        let newPrice = -Number(this.state.usersBalance[index].Price);
        this.state.priceSum += 2 * newPrice;
        this.state.usersBalance[index].Price = newPrice.toString();
        this.setState({usersBalance: this.state.usersBalance, priceSum: this.state.priceSum, pristine: false});
        this.forceUpdate();
    }

    updatePrice(index, price) {
        let userbalance = this.state.usersBalance;
        if (userbalance[index].Sign == 1)
            price = -price;
        userbalance[index].Price = price;
        let priceSum = 0;
        userbalance.map(item => {
            priceSum += Number(item.Price);
        });
        this.setState({usersBalance: userbalance, priceSum: priceSum, pristine: false});
        this.forceUpdate();
    }

    async submitPrices() {
        this.setState({loading: true});
        let data = [];
        this.state.usersBalance.map(o => {
            data.push({UserId: o.UserID, UnitId: o.UnitID, Price: o.Price});
        });

        const item = {
            Data: data,
            LastPayDate: this.state.deadline
        };

        await setFirstUserBalance(item)
            .then(() => {
               globalState.showToastCard();

                this.getUserBalanceList();
            })
            .catch(e => globalState.showToastCard())
            .finally(() => {
                this.setState({loading: false});
            });
    }

    showDatePicker() {
        this.setState({showDatePickerDialog: true});
    }

    hideDatePicker() {
        this.setState({showDatePickerDialog: false});
    }

    onBackPressed() {
        if (this.state.showSearchType) {
            this.setState({showSearchType: false});
            return;
        } else if (this.state.showSortType) {
            this.setState({showSortType: false});
            return;
        }
        this.props.navigation.goBack();
    }

    changeSort(item) {
        this.setState({sortItem: item});
        this.sortList(item);
    }

    sortList(item) {
        let arraySortProcess = this.usersBalance;
        arraySortProcess.sort(compare2sort(item.codeName));
        if (item.isDescending) {
            arraySortProcess.reverse();
        }
        this.initUsersBalance();
        this.setState({usersBalance: arraySortProcess});
    }

    changeSearchType(item) {
        this.setState({searchItem: item},
            () => this.search(this.state.searchText));
    }

    search(text) {
        if (text) {
            text = mapNumbersToEnglish(text);
            this.setState({searchText: text});
            // let key = Object.keys(this.state.searchItem)[1];
            let key = this.state.searchItem.codeName;
            const searchedProcess = this.usersBalance.filter(item => {
                const itemData = `${item[key]}`;
                return itemData.indexOf(text) > -1;
            });
            this.initUsersBalance();
            this.setState({usersBalance: searchedProcess});
        } else {
            this.setState({usersBalance: this.usersBalance, searchText: ''});
        }
    }

    changeSearch(item) {
        this.dismiss();
        this.setState({searchItem: item, searchText: ''});
        this.search('');
    }


    onDateChange(date) {
        this.setState({deadline: date, pristine: false});
        this.hideDatePicker();
    }

    render() {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPressed.bind(this),
                content: images.ic_back,
            },
            title: 'وضعیت اولیه کاربران',
            search: {
                onPressType: () => this.setState({showSearchType: true}),
                onTextChange: text => this.search(text),
                typeName: this.state.searchItem.Name,
            },
            sort: {
                onPress: () => this.setState({showSortType: true}),
            },
        };

        return (
            <MobileLayout style={{padding:0}} title={`فرم شارژ ثابت`}>
                <View style={{flex: 1, backgroundColor: '#f5f1f1'}}>
                    <Toolbar customStyle={toolbarStyle}/>
                    <AndroidBackButton
                        onPress={() => {
                            this.onBackPressed();
                            return true;
                        }}
                    />
                    <SnakePopup
                        visible={this.state.showSearchType}
                        toolbarTitle="جستجو بر اساس"
                        items={searchItems}
                        onItemSelected={item => {
                            this.changeSearchType(item);
                            this.setState({showSearchType: false});
                        }}
                        onClose={() => this.setState({showSearchType: false})}
                        fromTop={60}
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
                        fromTop={60}
                    />

                    <View style={{
                        height: 52,
                        marginTop: 0,
                        paddingTop: 0,
                        borderBottomWidth: 2,
                        borderBottomColor: 'rgba(182, 182, 182, 0.3)',
                        elevation: 6,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.5,
                        backgroundColor: '#FFFFFF',
                    }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 16,
                            }}
                            onPress={() => {
                                this.showDatePicker();
                                Keyboard.dismiss();
                            }}
                        >
                            <Image
                                source={images.ic_hourglass}
                                style={{
                                    tintColor: '#8a7e7e',
                                    height: 24,
                                    width: 24,
                                }}
                            />
                            <Text
                                style={{
                                    marginStart: 4,
                                    flex: 1,
                                    color: '#847f7b',
                                    fontSize: 12,
                                }}>
                                آخرین مهلت پرداخت
                            </Text>
                            {this.state.deadline &&
                            <Text
                                style={{
                                    flex: 1,
                                    color: '#847f7b',
                                    fontSize: 12,
                                    textAlign: 'right',
                                }}>
                                {parseTimeToJalaali(jMoment(this.state.deadline).format('YYYY-M-D HH:mm:ss'), false)}
                            </Text>
                            }

                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            marginTop: 16,
                            marginBottom: 6,
                            height: 25,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'space-between',
                                paddingHorizontal: 16,
                                borderEndWidth: 1,
                                borderEndColor: '#E5DEDE',
                            }}
                        >
                            <Text
                                style={{
                                    flex: 1,
                                    fontFamily:'IRANYekanFaNum-Light',
                                    color: '#8A7E7E',
                                    fontSize: 12,
                                }}>تعداد واحد</Text>
                            <Text
                                style={{
                                    color: '#8A7E7E',
                                    fontSize: 14,
                                }}>{this.state.unitsCount}</Text>
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'space-between',
                                paddingHorizontal: 16,
                            }}
                        >
                            <Text
                                style={{
                                    flex: 1,
                                    fontFamily: 'IRANYekanFaNum-Light',
                                    color: '#8A7E7E',
                                    fontSize: 12,
                                }}>جمع کل</Text>
                            <Text
                                style={{
                                    color: '#8A7E7E',
                                    fontSize: 14,
                                    writingDirection: 'ltr'
                                }}>{accounting.formatMoney(this.state.priceSum, '', 0, ',')}</Text>
                        </View>
                    </View>

                    <FlatList
                        ref={ref=>this.flatList=ref}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.usersBalance}
                        extraData={this.state.usersBalance.length}
                        renderItem={({item, index}) => (
                            <FirstUserBalanceElement
                                key={index}
                                id={index}
                                item={item}
                                isLastItem={this.state.usersBalance.length==index+1}
                                flatList={this.flatList}
                                onValueChanged={(itemIndex, price, count) => this.updatePrice(itemIndex, price)}
                                onSignChanged={(itemIndex, sign) => this.onSignChange(itemIndex, sign)}
                            />
                        )}
                        onEndReachedThreshold={1}
                        onEndThreshold={0}
                        onEndReached={({distanceFromEnd}) => {
                            if (this.pageSize > this.lastList.length)
                                return;
                            this.pageIndex = this.pageIndex + 1;


                            if (this.pageSize > this.lastList.length) {
                                return
                            }
                            ++this.pageIndex ;

                            this.getUserBalanceList(this.pageIndex);
                        }}
                        ListFooterComponent={()=>{


                            return (
                                <View style={{flex:1,height:300}}>

                                </View>
                            );

                        }}
                    />

                    {this.state.usersBalance.length > 0 && this.permission.writeAccess &&
                    <TouchableOpacity
                        onPress={() => {
                            this.submitPrices();
                        }}
                        disabled={this.state.pristine}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <View
                                style={{
                                    flex: 4,
                                    height: 48,
                                    backgroundColor: (!this.state.pristine) ? primaryDark : '#D5CBCB',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{fontSize: 18, color: 'white'}}>ثبت</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    }

                    {this.state.showDatePickerDialog && (
                        <Overlay catchTouch={true} onPress={() => {
                            this.hideDatePicker();
                        }}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    elevation: 3,
                                    borderRadius: 4,
                                }}>

                               {/* <PersianCalendarPicker
                                    onDateChange={date => this.onDateChange(date)}
                                    selectedStartDate={this.state.deadline}
                                    selectedDayColor={primary}
                                    selectedDayTextColor={'white'}
                                    initialDate={this.state.deadline}
                                    // minDate={jMoment()}
                                />*/}
                                <TouchableOpacity
                                    style={{alignSelf: 'flex-end', paddingHorizontal: 13, paddingBottom: 13}}
                                    onPress={() => this.onDateChange(jMoment())}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{marginRight: 7, marginLeft: 7, color: primaryDark}}>امروز</Text>
                                        <Image
                                            source={images.goToTodayIcon}
                                            style={{tintColor: primaryDark, height: 18, width: 18}}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Overlay>
                    )}
                    <LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage}/>
                </View>
            </MobileLayout>
        );
    }


}

const styles = StyleSheet.create({});
const sortItems = [
    {Name: ' مانده(کم به زیاد)', codeName: 'Price', isDescending: false,},
    {Name: ' مانده(زیاد به کم)', codeName: 'Price', isDescending: true,},
    {Name: ' شماره واحد(کم به زیاد)', codeName: 'UnitNumber', isDescending: false,},
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
