import React, {PureComponent} from 'react';
import {
    Animated,
    Easing,
    Image,
    Keyboard,
    Platform,
    Progress,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from '../src/react-native';
import {MenuItem, Select} from '@material-ui/core';
import images from "../public/static/assets/images";
import {border, lightRed, primaryDark, subTextItem, textItem, textItemBlack} from '../src/constants/colors';
import {accountsStore, globalState, persistStore, userStore} from '../src/stores';
import {loginQuery, roleQuery} from '../src/network/Queries';
//import * as Progress from 'react-native-progress';
import {
    fetchStore,
    getCookie,
    getWidth,
    inputNumberValidation,
    logger,
    mapNumbersToEnglish,
    saveCookie
} from '../src/utils';
import {FloatingLabelTextInput, LoadingPopUp} from '../src/components';
//import DeviceInfo from 'react-native-device-info';
import translate from "../src/language/translate";
import {LNGList} from "../src/language/aaLngUtil";
import Router from 'next/router'
import BaseLayout from "../src/components/layouts/BaseLayout";
import LinearProgress from "@material-ui/core/LinearProgress";

//import {NavigationActions, StackActions} from 'react-navigation';

//import firebase from '@react-native-firebase/app';
//import '@react-native-firebase/messaging';

//import Communications from 'react-native-communications';
//import RNRestart from "react-native-restart";


const loginInput = [];
export default class LoginPage extends PureComponent {
    constructor(props) {
        super(props);
        //StatusBar.setTranslucent(true);
        globalState.changeStatusBarColor('rgba(255,255,255,0)');
        this.topPosition = (global.height / 7) * 2;
        this.animatedHeight = new Animated.Value(global.height);
        this.animatedWidth = new Animated.Value(global.width);
        this.animatedBorderRadius = new Animated.Value(0);
        this.animatedLogoSize = new Animated.Value(120);
        this.animatedLogoPosition = new Animated.Value(this.topPosition);
        this.animatedLoginOpacity = new Animated.Value(0);


        this.state = {
            haveNewVersion: false,
            newVersionUrl: null,
            userName: '',
            userNameValidation: true,

            userPass: '',
            userPassValidation: true,


            showLogin: false,
            showPassword: false,
            language: LNGList[0],
            languageIndex: LNGList[0].index,
            focusIndex:1,
        };
        this.passInput =
            React.createRef();
    }

    animatedSplash() {
        this.setState({showLogin: true});
        Animated.parallel([
            Animated.spring(
                this.animatedHeight, {
                    toValue: 334, //height / 2 + 50
                    duration: 500,
                    easing: Easing.out,
                }),
            Animated.spring(
                this.animatedWidth, {
                    toValue: global.width - 48,
                    duration: 500,
                    easing: Easing.out,
                }),
            Animated.spring(
                this.animatedBorderRadius, {
                    toValue: 30,
                    duration: 500,
                    easing: Easing.out,
                }),
            Animated.spring(
                this.animatedLogoSize, {
                    toValue: 60,
                    duration: 500,
                    easing: Easing.out,
                }),
            Animated.spring(
                this.animatedLogoPosition, {
                    toValue: -30,
                    duration: 500,
                    easing: Easing.out,
                }),
            Animated.spring(
                this.animatedLoginOpacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.in,
                }),
        ]).start(() => loginInput[0].focus());//setTimeout(function() {this.refs.loginInput.focus()}.bind(this), 300)


    }

    async componentDidMount() {
        this.applyRTLfromUserLanguage();
        this.setState({
            progressWidth: getWidth() - 50,
            boxWidth: getWidth() > 500 ? 400 : getWidth() - 50,
            bgImage: getWidth() > 600 ? images.bg_loginweb : images.bg_login
        });

        await fetchStore();

        console.warn('**** SpLogin Start componentDidMount **** ', persistStore.token);
        if (persistStore.token) {
            console.warn('**** Have Token ****');
            try {
                if (accountsStore.accounts.length > 1) {
                    if (persistStore.selected === 0) {
                        userStore.setUser(accountsStore.accounts[0]);
                    } else {
                        userStore.setUser(accountsStore.accounts.find(account => account.ID === persistStore.selected));
                    }
                } else if (accountsStore.accounts.length === 1) {
                    userStore.setUser(accountsStore.accounts[0]);
                }

                loginQuery(persistStore.username, null)
                    .then(() => this.navigateToMain());


            } catch (error) {
                console.warn('catch Token : ', error);
                this.showLogin();
            }
        } else {
            console.warn('*** not have Token ***');
            this.showLogin();
        }
    }

    //1
    async checkPushPermission() {
        /* firebase.messaging().hasPermission()
             .then(enabled => {
                 if (enabled) {
                     this.getPushToken();
                 } else {
                     this.requestPushPermission();
                 }
             });*/
    }


    //2
    async requestPushPermission() {
        /* if (!firebase.messaging().isRegisteredForRemoteNotifications) {
             await firebase.messaging().registerForRemoteNotifications();
         }
         firebase.messaging().requestPermission()
             .then(() => {
                 this.getPushToken();
             })
             .catch(error => {

                 console.log('permission rejected');
             });*/
    }

    //   //3
    async getPushToken() {
        /* firebase.messaging().getToken()
             .then(fcmToken => {
                 setPushTokenQuery(fcmToken)
                     .catch(e => console.warn('!!!!!!!!!! onTokenRefresh catch', e));
             });*/

    }


    componentWillUnmount() {
        globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

    }

    async applyRTLfromUserLanguage() {
        let lng = getCookie('lng');
        if (lng) {
            global.slanguage = lng.key;
            global.isRtl = lng.rtl;
            this.setState({languageIndex: lng.index});

        }
        /* await this.getDataStorage('LNG_KEY')
            .then(async (result='فارسی') => {
                let rtl= lngRTL[result] || false;
                global.slanguage=LNGEnum[result];
                global.isRTL=rtl;
                I18nManager.allowRTL(rtl);
                I18nManager.forceRTL(rtl);
                this.setState({language:result});
            }).catch(()=>{
                global.slanguage='fa';
                global.isRTL=true;
                I18nManager.allowRTL(true);
                I18nManager.forceRTL(true);
                this.setState({language:'فارسی'});
            });
*/
    }

    async applyLanguage(lng) {
        global.slanguage = lng.key;
        global.isRtl = lng.rtl;
        this.setState({languageIndex: lng.index});
        saveCookie('lng', lng);

        /* await this.storeDataStorage('LNG_KEY', value)
            .then(() => {
                if(currentLng.rtl!= lngRTL[value] ){
                    RNRestart.Restart();
                }else{
                    global.slanguage=LNGEnum[value];
                    this.setState({language:value});
                }
            });*/

    }

    storeDataStorage = async (key, value) => {
        /* try {
             await AsyncStorage.setItem(key, value);
         } catch (e) {
             console.warn('!!!!!! storeDataStorage Catch !!!!!! e:', e);
         }*/
    };
    getDataStorage = async (key) => {
        /* try {
             const value = await AsyncStorage.getItem(key);
             if (value !== null) {
                 return value;
             }
         } catch (e) {
             console.warn('!!!!!! getDataStorage Catch !!!!!! e:', e);
         }*/
    };

    keyPress=(e)=>{
        if(e.keyCode === 13){
            this.onLogin()
        }
    }
    render() {
        console.log(global.isRtl)
        if (!this.state.showLogin) {
            return (
                <BaseLayout title={'لاگین'} maxWidth={'100%'} style={{
                    justifyContent: 'center',
                    backgroundImage: "url(" + this.state.bgImage + ")",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'center top',
                    backgroundAttachment: 'fixed',

                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        backgroundPosition: "top center",
                    }}>
                        <ScrollView
                            // keyboardDismissMode='on-drag'
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={this.state.showLogin}
                            style={{
                                flexGrow: 0,
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                //backgroundColor: 'rgba(255,255,255,.8)',
                            }}>
                            <Animated.View
                                style={{
                                    width: this.state.boxWidth,
                                    borderRadius: 30,//this.animatedBorderRadius,
                                    backgroundColor: 'rgba(255,255,255,.8)',
                                    marginTop: 0,
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                <Animated.View
                                    style={[styles.logoContainer, {
                                        marginTop: 0,// this.animatedLogoPosition,
                                        position: 'absolute',
                                        top: -60,
                                    }]}>
                                    <Animated.Image source={images.logo} style={{
                                        width: 120,//this.animatedLogoSize,
                                        height: 120,// this.animatedLogoSize,
                                    }}/>

                                </Animated.View>
                                <Text style={{
                                    paddingTop: 100,
                                    fontWeight: 1000,
                                    fontSize: 25,
                                    alignSelf: 'center',
                                    fontFamily: 'IRANYekan-ExtraBold'
                                }}>Apaman</Text>
                                <View
                                    style={{
                                        // position: 'absolute',
                                        //bottom:0,
                                        flex: 1,
                                        height: '100%',
                                        marginTop: 100,
                                    }}>

                                    <LinearProgress style={{width: this.state.progressWidth, maxWidth: 400}}
                                                    color="secondary"></LinearProgress>

                                    <Text
                                        style={{
                                            marginTop: 16,
                                            marginBottom: 16,
                                            textAlign: 'center',
                                            color: textItem,
                                        }}
                                    >{'نسخه ' + '2.52.40'}</Text>
                                </View>
                            </Animated.View>
                        </ScrollView>

                    </View>
                    <style jsx global>{`
                        .MuiLinearProgress-barColorSecondary {
                           background-color: ${primaryDark} !important;
                         }
                         .MuiLinearProgress-colorSecondary {
                                background-color: ${border} !important;
                            }
                    `}</style>
                </BaseLayout>
            )
        }
        return (

            <BaseLayout title={'لاگین'} maxWidth={'100%'}
               style={{
                    backgroundImage: "url(" + this.state.bgImage + ")",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'center top',
                    backgroundAttachment: 'fixed',
                    justifyContent: 'center',
            }}>

                <ScrollView
                    // keyboardDismissMode='on-drag'
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={this.state.showLogin}
                    style={{
                        flexGrow: 0,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Animated.View
                        style={{
                            width: this.state.boxWidth,
                            borderRadius: 30,//this.animatedBorderRadius,
                            backgroundColor: 'rgba(255,255,255,.8)',
                            marginTop: 0,
                            position: 'relative',

                        }}>
                        <Animated.View
                            style={[styles.logoContainer, {
                                marginTop: 0,// this.animatedLogoPosition,
                                position: 'absolute',
                                top: -35,
                            }]}>
                            <Animated.Image source={images.logo} style={{
                                width: 70,//this.animatedLogoSize,
                                height: 70,// this.animatedLogoSize,
                            }}/>
                        </Animated.View>
                        <Animated.View
                            style={{
                                flex: 1,
                                opacity: 1,// this.animatedLoginOpacity,
                            }}>
                            <View style={{
                                flex: 1,
                                margin: 24,
                            }}>
                                <Select
                                    style={{marginTop: 30, width: 100, alignSelf: 'center'}}
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={this.state.languageIndex}
                                    onChange={(value, itemIndex) => {

                                        this.applyLanguage(LNGList[value.target.value], value.target.value);
                                    }}
                                >
                                    {LNGList.map((lng, index) => <MenuItem value={index}>{lng.title}</MenuItem>)}
                                </Select>

                                <Text style={{
                                    marginTop: 30,
                                    fontSize: 20,
                                    fontWeight:800,
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',
                                    textAlign: 'center',
                                }}>
                                    {translate('welcome_to_app')}
                                </Text>
                                <Text style={{
                                    marginTop: 6,
                                    marginBottom: 35,
                                    fontSize: 14,
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Light' : 'IRANYekanLight(FaNum)',
                                    textAlign: 'center',
                                }}>
                                    {
                                        translate('enter_your_phone_number')
                                    }
                                </Text>
                                <FloatingLabelTextInput
                                    refInput={input => loginInput[0] = input}
                                    floatingLabelEnable={false}
                                    floatingOffsetX={0}
                                    floatingLabelFont={{color: textItem}}
                                    editable={true}
                                    multiline={false}
                                    maxLength={11}
                                    autoFocus={this.state.focusIndex==1}
                                    keyboardType="number-pad"
                                    type={'number'}
                                    returnKeyType="next"
                                    onSubmitEditing={() => loginInput[1].focus()}
                                    style={{textAlign: global.isRtl ? 'right' : 'left',}}
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.userNameValidation ? textItem : lightRed
                                    }
                                    textInputStyle={{
                                        fontWeight: 'normal',
                                        fontFamily: Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',
                                        color: textItemBlack,
                                        fontSize: 14,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        textAlign: global.isRtl ? 'right' : 'left',

                                    }}
                                    underlineSize={1}
                                    placeholder={translate('example')}

                                    // style={{flex: 1}}
                                    onChangeText={text => {
                                        this.checkValidation();
                                        this.setState({
                                            userName: inputNumberValidation(text, this.state.userName, /[\d]+$/),
                                            userNameValidation: true,
                                        }, () => {
                                            this.state.userName.length === 11 ? loginInput[1].focus() : null;
                                        });

                                    }}
                                    highlightColor={primaryDark}
                                    value={this.state.userName}
                                />

                                <View
                                    style={{

                                        flexDirection: 'row',
                                        marginTop: 24,
                                    }}
                                >
                                    <FloatingLabelTextInput
                                        refInput={input => loginInput[1] = input}
                                        type={this.state.showPassword ? 'text' : 'password'}
                                        floatingLabelEnable={false}
                                        floatingOffsetX={0}
                                        floatingLabelFont={{color: textItem}}
                                        editable={true}
                                        multiline={false}
                                        maxLength={100}
                                        autoFocus={this.state.focusIndex==2}
                                        onKeyDown={(e)=>this.keyPress(e)}
                                        keyboardType="default"
                                        returnKeyType="done"
                                        numberOfLines={1}
                                        tintColor={
                                            this.state.userPassValidation ? textItem : lightRed
                                        }
                                        textInputStyle={{
                                            fontWeight: 'normal',
                                            fontFamily: 'IRANYekan-ExtraBold',
                                            color: textItemBlack,
                                            fontSize: 14,
                                            paddingStart: 4,
                                            paddingTop: 1,
                                            paddingBottom: 3,
                                            textAlign: global.isRtl ? 'right' : 'left',
                                        }}
                                        underlineSize={1}
                                        placeholder={
                                            translate('password')
                                        }
                                        style={{flex: 1,paddingLeft:2}}
                                        onChangeText={text => {
                                            this.checkValidation();
                                            this.setState({
                                                userPass: text,
                                                userPassValidation: true,
                                            });
                                        }}
                                        highlightColor={primaryDark}
                                        value={this.state.userPass}
                                        adornment={
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({showPassword: !this.state.showPassword});
                                                }}
                                                style={{position: 'absolute', end: global.isRtl ? 5 : 0, top: -2}}
                                            >
                                                <Image
                                                    source={this.state.showPassword ? images.ic_ShowPassword : images.ic_HidePassword}
                                                    style={{
                                                        height: 24,
                                                        width: 24,
                                                        //tintColor: textItem
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        }
                                    />
                                </View>
                            </View>

                            {this.state.loading &&
                            <LinearProgress style={{marginTop: 25, width: this.state.progressWidth - 10, maxWidth: 400}}
                                            color="secondary"></LinearProgress>
                            }
                            <TouchableOpacity
                                onPress={() => this.onLogin()}
                                style={{
                                    paddingVertical: 10,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: subTextItem,
                                    borderRadius: 10,
                                    marginHorizontal: 24,
                                    marginTop: 10,
                                    marginBottom: 24,
                                    backgroundColor: this.checkValidation() ? primaryDark : 'transparent',
                                }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',
                                    color: this.checkValidation() ? 'white' : subTextItem,
                                }}
                                >
                                    {
                                        translate('login')
                                    }
                                </Text>
                            </TouchableOpacity>

                        </Animated.View>

                    </Animated.View>
                </ScrollView>
                <LoadingPopUp visible={this.state.loading} login={true} message="در حال بررسی و ورود ..."/>
                <style jsx global>{`
                        .MuiLinearProgress-barColorSecondary {
                           background-color: ${primaryDark} !important;
                         }
                         .MuiLinearProgress-colorSecondary {
                                background-color: ${border} !important;
                            }
                    `}</style>
            </BaseLayout>

        );
    }

    showLogin() {
        setTimeout(() => {
            //this.animatedSplash();
            this.setState({showLogin: true});
        }, 2000);
        console.warn('*** Show login Start ***');
    }

    checkValidation() {
        return this.state.userName.length === 11 && this.state.userPass.length >= 6;
    }

    navigateToMain()
    {
        /* const resetAction = StackActions.reset({
             index: 0,
             actions: [NavigationActions.navigate({routeName: 'Main'})],
         });
         this.props.navigation.dispatch(resetAction);*/

        Router.replace('/Main');
    }
    async onLogin() {

        Keyboard.dismiss();
        if (this.state.userName.length !== 11) {
            this.setState({userNameValidation: false});
            return;
        }
        if (this.state.userPass.length < 6) {
            this.setState({userPassValidation: false});
            return;
        }

        this.setState({loading: true});
        logger(this.state.userName + ' *** Login onLogin Start ***');
        persistStore.userName = this.state.userName;

        await loginQuery(mapNumbersToEnglish(this.state.userName), mapNumbersToEnglish(this.state.userPass))
            .then(async () => {
                logger(this.state.userName + ' ********** loginQuery success ****');

                persistStore.selected = 0;
                this.checkPushPermission();
                await roleQuery()
                    .then(() => {
                        logger(this.state.userName + ' ********** roleQuery success ****');
                        this.setState({loading: false});
                        this.navigateToMain();
                    })
                    .catch(e => {
                        logger(this.state.userName + ' !!!!!!!! roleQuery catch', e.errMessage);
                    })
                    .finally(() => logger('******finily roleQuery******'));
            })
            .catch(e => {
                if(e.message=='Failed to fetch'){
                    globalState.responseMessage='خطا وضعیت اینترنت خود را برسی کنید.';
                }
                globalState.toastType='error';
                globalState.showToastCard();
                this.setState({loading: false});
                logger(this.state.userName + ' !!!!!!!! loginQuery catch', e.errMessage);
            })
            .finally(() => {

                logger(this.state.userName + ' ******finily loginQuery******');
            });
        }





}

const styles = StyleSheet.create({
    container: {},
    background: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        resizeMode: 'stretch',
        justifyContent: 'center',
        // marginBottom: 16,
    },
    logoContainer: {
        position: 'absolute',
        borderRadius: 40,
        alignSelf: 'center',
        elevation: 7,
        shadowColor: primaryDark,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
    },
    logo: {
        height: 60,
        width: 60,
    },
});
