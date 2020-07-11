import React, {PureComponent} from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Keyboard,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,

} from '../src/react-native';
//import ImagePicker from 'react-native-image-crop-picker';


import {
    bgScreen, border, borderLight,
    drawerItem,
    fab, lightRed,
    overlayColor,
    placeholderTextColor,
    primary,
    primaryDark,
    subTextItem
} from '../src/constants/colors';
import {
    AlertMessage,
    AndroidBackButton,
    Overlay,
    SelectTypePhoto,
    SwitchText,
    Toolbar,
    ImageCacheProgress,
    ImageSelector,
} from '../src/components';
import images from "public/static/assets/images";
import {accountsStore, globalState, persistStore, userStore} from '../src/stores';
import {
    getFileDownloadURL,
    mapNumbersToEnglish,
    navigation,
    parseTimeToGregorian,
    parseTimeToJalaali,
    uploadFile
} from '../src/utils';
import {changeUserPassword, changeUserPhotoQuery, changeUserProfile} from '../src/network/Queries';

//import FastImage from 'react-native-fast-image';
//import * as Progress from 'react-native-progress';
//import {createImageProgress} from 'react-native-image-progress';
//const ImageCacheProgress = createImageProgress(FastImage);
//import Permissions from 'react-native-permissions';
import FloatingLabelTextInput from '../src/components/FloatingLabelTextInput';
import {observer} from 'mobx-react';
import {showMassage} from "../src/utils";
//import Toast from 'react-native-simple-toast';


import MobileLayout from "../src/components/layouts/MobileLayout";
import Progress from "../src/react-native/Progress";
class ListSelect extends PureComponent {
    render() {
        const {items} = this.props;
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                    borderRadius: 2,
                    width: 250,
                    padding: 8,
                }}
            >
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={items}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingVertical: 8,
                                borderBottomWidth: 0.5,
                            }}
                            onPress={this.onItemSelect.bind(this, item.onPress, item.type)}
                        >
                            <Text style={{flex: 1, color: 'black', alignSelf: 'flex-start'}}>{item.title}</Text>
                            <Image
                                source={item.icon}
                                style={{tintColor: primaryDark, height: 24, width: 24, marginHorizontal: 7}}
                            />
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    }

    onItemSelect(value, type) {
        this.props.onItemSelected(value, type);
    }
}

function UserImageSection({image, onPress, onImageLoad, imageExists}) {
    return (
        <View style={userImageSectionStyle.container}>
            <TouchableOpacity
                onPress={onPress}
                style={userImageSectionStyle.imageContainer}
            >

                <ImageCacheProgress
                    style={{
                        height: imageExists ? 160 : 1,
                        width: imageExists ? 160 : 1,
                        borderRadius: 80,
                        overflow: `hidden`,
                        resizemode: 'cover',
                    }}
                    source={{
                        uri: image,
                        headers: {Authorization: 'Bearer ' + persistStore.token},
                       // priority: FastImage.priority.high,
                    }}
                    //indicator={Progress.Pie}
                    indicatorProps={{
                        borderWidth: 0,
                        color: primaryDark,
                        unfilledColor: primary,
                    }}
                    onLoad={onImageLoad}
                />
                {!imageExists &&
                <Image source={images.user_image} style={{tintColor: primaryDark}}/>
                }

            </TouchableOpacity>
        </View>
    );
}

export class PasswordChangePopUp extends PureComponent {

    constructor() {
        super();
        this.init = false;
        this.animatedFromBottom = new Animated.Value(0);

        this.state = {
            keyboardSpace: 0,
            confirmPassword: '',
            newPassword: '',
            pristine: true,

            showConfirmPassword: false,
            showNewPassword: false,
        };

        //for get keyboard height
        Keyboard.addListener('keyboardDidShow', (frames) => {
            if (!frames.endCoordinates) {
                return;
            }
            this.setState({keyboardSpace: frames.endCoordinates.height});
        });
        Keyboard.addListener('keyboardDidHide', (frames) => {
            this.setState({keyboardSpace: 0});
        });
    }

    componentDidMount() {
        this.animateSnake(true, () => {
        });

        this.setState({
            showClosePopup: false,
        });
    }

    animateSnake(open, fn) {
        Animated.timing(
            this.animatedFromBottom,
            {
                toValue: open ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            },
        ).start(fn);
    }

    isContainPersian(text) {
        const regex = /[\u0600-\u06FF]/;
        for(let i = 0; i < text.length; i++) {
            if (regex.test(text[i])) {
                return true;
            }
        }
        return false;
    }

    async onSubmitPressed() {
        if (this.state.newPassword.length<6) {
            this.setState({errMassage:'رمز عبور حداقل باید 6 حرف باشد'})

            // showMassage('رمز عبور حداقل باید 6 حرف باشد.', 'خطا', 'error');
            return;
        }
        if (this.state.newPassword != this.state.confirmPassword) {

            //showMassage('رمز عبور مطابقت ندارد', 'خطا', 'error');
            this.setState({errMassage:'تکرار رمز عبور مطابقت ندارد'})
            return;
        }

        Keyboard.dismiss();
        this.animateSnake(false, () => this.props.onClose());
        const item = {newPassword: this.state.newPassword, confirmPassword: this.state.confirmPassword};
        // const item = {oldPassword: this.state.oldPassword, newPassword: this.state.newPassword};

        await changeUserPassword(item)
            .then(() => {
                globalState.showToastCard();
            })
            .catch(e => globalState.showToastCard());
    }

    render() {
        const {title, onClose} = this.props;
        const animateTranslateY = this.animatedFromBottom.interpolate({
            inputRange: [0, 1],
            outputRange: [470, 0],
        });
        return (
            <Modal
                animationType="fade"
                transparent={true}
                presentationStyle="overFullScreen"
                onRequestClose={onClose}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: overlayColor,
                }}>

                    <Animated.View
                        style={{
                            transform: [{translateY: animateTranslateY}],
                            minHeight: 270,
                            maxHeight: 470,
                            position: 'absolute',
                            backgroundColor: 'white',
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                            bottom: Platform.OS === 'ios' ? this.state.keyboardSpace : 0,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={this.state.pristine ? () => this.animateSnake(false, () => onClose()) : () => this.setState({showClosePopup: true})}
                            style={{
                                elevation: 2,
                                shadowColor: '#000',
                                shadowOffset: {width: 0, height: 1},
                                shadowOpacity: 0.5,
                                backgroundColor: 'white',
                            }}
                        >
                            <View
                                style={[styles.actionIcon, {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#E5DEDE',
                                    flex: 1,
                                }]}>

                                <Image
                                    source={images.ic_close}
                                    style={[styles.img]}
                                />

                                <Text style={{
                                    color: 'black',
                                    fontSize: 20,
                                }}>{title}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <View
                            style={{
                                backgroundColor: 'white',
                                paddingTop: 16,
                                paddingBottom: 20,
                                paddingHorizontal: 10,
                                // height: 370,
                                flex: 1,
                                // justifyContent: 'space-between',
                                borderRadius: 4,
                            }}
                        >

                            <View
                                style={{
                                    flex: 1,
                                    marginVertical: 10,
                                    flexDirection: 'row',
                                    marginHorizontal: 24,
                                }}
                            >

                                <View
                                    style={{flex: 1.5, flexDirection: 'row', alignItems: 'center'}}
                                >
                                    <Text style={{fontSize: 12}}>رمز عبور جدید</Text>
                                </View>
                                <FloatingLabelTextInput
                                    password={!this.state.showNewPassword}
                                    multiline={false}
                                    numberOfLines={1}
                                    returnKeyType="done"
                                    textInputStyle={{
                                        fontSize: 13,
                                        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                        color: 'black',
                                        textAlign: 'right',
                                    }}

                                    underlineSize={1}
                                    placeholder='حداقل ۶ حرف غیر فارسی'
                                    style={{flex: 3}}

                                    onChangeText={text => {
                                        if (text != '') {
                                            if (this.isContainPersian(text)) {
                                                showMassage('پیام','کلمه عبور نباید حروف فارسی باشد!','info')
                                                return;
                                            }
                                            this.setState({newPassword: text, pristine: false});
                                        } else {
                                            this.setState({newPassword: null, pristine: false});
                                        }
                                    }
                                    }
                                    highlightColor={primaryDark}
                                    value={this.state.newPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({showNewPassword: !this.state.showNewPassword});
                                    }}
                                    style={{position: 'absolute', end: 5, top: 0}}
                                >

                                    <Image
                                        source={this.state.showNewPassword ? images.ic_ShowPassword : images.ic_HidePassword}
                                        style={{height: 24, width: 24, tintColor: '#D5CBCB'}}
                                    />

                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    marginVertical: 10,
                                    flexDirection: 'row',
                                    marginHorizontal: 24,
                                }}
                            >
                                <View
                                    style={{flex: 1.5, flexDirection: 'row', alignItems: 'center'}}
                                >
                                    <Text style={{fontSize: 12}}>تکرار رمز جدید</Text>
                                </View>
                                <FloatingLabelTextInput
                                    password={!this.state.showConfirmPassword}
                                    multiline={false}
                                    numberOfLines={1}
                                    returnKeyType="done"
                                    textInputStyle={{
                                        fontSize: 13,
                                        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                        color: 'black',
                                        textAlign: 'right',
                                    }}

                                    underlineSize={1}
                                    // placeholder='رمز عبور جدید را مجدد وارد کنید'
                                    style={{flex: 3}}

                                    onChangeText={text => {
                                        if (text != '') {
                                            if (this.isContainPersian(text)) {
                                                showMassage('پیام','کلمه عبور نباید حروف فارسی باشد!','info')
                                                return;
                                            }
                                            this.setState({confirmPassword: text, pristine: false});

                                        } else {
                                            this.setState({confirmPassword: null, pristine: false});
                                        }
                                    }
                                    }
                                    highlightColor={primaryDark}
                                    value={this.state.confirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({showConfirmPassword: !this.state.showConfirmPassword});
                                    }}
                                    style={{position: 'absolute', end: 5, top: 0}}
                                >

                                    <Image
                                        source={this.state.showConfirmPassword ? images.ic_ShowPassword : images.ic_HidePassword}
                                        style={{height: 24, width: 24, tintColor: '#D5CBCB'}}
                                    />

                                </TouchableOpacity>

                            </View>
                            <View
                                style={{flex: 1,alignSelf:'center'  }}
                            >
                                <Text style={{fontSize: 12,color:primaryDark}}>{this.state.errMassage}</Text>
                            </View>

                            <TouchableOpacity
                                style={{marginTop: 13, marginHorizontal: 15}}
                                onPress={() => this.onSubmitPressed()}
                                disabled={!this.state.newPassword || !this.state.newPassword.length ||
                                !this.state.confirmPassword || !this.state.confirmPassword.length}
                            >
                                <View style={{flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            height: 47,
                                            backgroundColor: (this.state.newPassword && this.state.newPassword.length &&
                                                this.state.confirmPassword && this.state.confirmPassword.length) ? primary : '#D5CBCB',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 10,
                                        }}
                                    >
                                        <Text style={{fontSize: 18, color: 'white'}}>ثبت</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>

                <AlertMessage
                    visible={this.state.showClosePopup}
                    title="خروج از صفحه؟"
                    message="در صورت خروج از صفحه، تغییرات ذخیره نخواهد شد."
                    onConfirm={() => {
                        this.setState({showClosePopup: false}, () => this.animateSnake(false, () => onClose()));
                    }}
                    onDismiss={() => this.setState({showClosePopup: false})}
                    confirmTitle="خروج"
                    dismissTitle="ادامه"
                    // onFinish={() => this.state.iosShowAlertClose ? this.onBackPress() : {}} //for onModal -> ios
                />
            </Modal>
        );
    }
}

class ImageProfile extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            sliderActiveSlide: 1,
            userImageIndeterminate: true,
            userImageProgress: 0,
        };
        this.bannerHeight = global.width * 9 / 16;
    }

    render() {
        const {image, onUplodedFile,onRemoveImage,onSelectFile} = this.props;

        return (
            /*<ImageBackground
                source={image ? {
                    uri: image,
                    headers: {Authorization: 'Bearer ' + persistStore.token},
                    priority: FastImage.priority.high,
                } : images.es_proflepicture}
                resizemode="cover"
                style={{
                    height: this.bannerHeight,
                    width: global.width,
                    backgroundColor: 'rgba(166, 214, 208, .4)',
                    marginBottom: 30,
                }}
                blurRadius={10}
            >*/
                <ImageSelector
                    style={{
                        //flex: 1,
                        justifyContent: 'center',
                        //alignItems: 'center',
                        borderColor: subTextItem ,
                        borderWidth:0,
                        borderStyle:'solid' ,
                        borderRadius: 0,
                        height:global.height/3, }}
                    canUpload={true}
                    imageStyle={{borderRadius:50}}
                    image= {image}
                    //noImage={images.bg_addphoto}
                    //hideDeleteBtn={false}
                    onUplodedFile={(fileName)=>onUplodedFile(fileName)}
                    onRemoveImage={onRemoveImage}
                    onSelectFile={onSelectFile}
                   >
                </ImageSelector>

            /*</ImageBackground>*/
        );
    }
}

@observer
export default class Profile extends PureComponent {
    constructor() {
        super();

        this.state = {

            image: userStore.UserImage?userStore.UserImage:null,// getFileDownloadURL(userStore.UserImage) : null,
            imageExists: false,
            sex: userStore.Sex,
            nationalCode: userStore.NationalCode,
            day: userStore.BirthDate ? parseTimeToJalaali(userStore.BirthDate, false).split('/')[2] : '',
            month: userStore.BirthDate ? parseTimeToJalaali(userStore.BirthDate, false).split('/')[1] : '',
            year: userStore.BirthDate ? parseTimeToJalaali(userStore.BirthDate, false).split('/')[0].substring(2, 4) : '',
            pristine: true,

            showTypePhoto: false,
        };
    }


    componentDidMount() {

    }

    render() {

        const toolbarStyle = {
            start: {
                onPress: ()=>this.onBackPress(this),
                content: images.ic_back,
            },
            title: 'صفحه کاربر',
        };

        return (
            <MobileLayout style={{padding:0,}} title={`ساکنین`}
                          header={<Toolbar ref='refToolbar' customStyle={toolbarStyle}/>}
                          footer={
                              <TouchableOpacity
                                  style={{}}
                                  onPress={() => this.onSubmitPressed()}
                                  disabled={!(this.state.nationalCode != null && this.state.nationalCode != '' &&
                                      this.state.day != null && this.state.day != '' &&
                                      this.state.month != null && this.state.month != '' &&
                                      this.state.year != null && this.state.year != '')}
                              >
                                  <View style={{flexDirection: 'row'}}>
                                      <View
                                          style={{
                                              flex: 1,
                                              height: 48,
                                              backgroundColor: (this.state.nationalCode != null && this.state.nationalCode != '' &&
                                                  this.state.day != null && this.state.day != '' &&
                                                  this.state.month != null && this.state.month != '' &&
                                                  this.state.year != null && this.state.year != '') ? primary : '#D5CBCB',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                          }}
                                      >
                                          <Text style={{color: 'white'}}>ثبت</Text>
                                      </View>
                                  </View>
                              </TouchableOpacity>
                          }

            >
                <View style={styles.container}>
                    <AndroidBackButton
                        onPress={() => {
                            this.onBackPress();
                            return true;
                        }}
                    />
                    <ScrollView>
                        <View style={[styles.subcontainer]}>

                            <ImageProfile
                                image={this.state.image}
                                onUplodedFile={(fileName) => this.setState({showTypePhoto: true})}
                                onRemoveImage={() => this.setState({showRemovePhoto: true})}
                                onSelectFile={(formData,file0,url,filebase64) => this.setState({image: null})}
                                onErrorImage={() => this.setState({image: null})}
                            />
                            <View
                                style={{
                                    paddingTop: 16,
                                    paddingBottom: 20,
                                    paddingHorizontal: 24,
                                    // height: 370,
                                    flex: 1,
                                    // justifyContent: 'space-between',
                                    borderRadius: 4,
                                }}
                            >
                                <View
                                    style={{
                                        paddingStart: 5,
                                        borderBottomWidth: 1,
                                        borderBottomColor: drawerItem,
                                        marginBottom: 25,
                                    }}>
                                    <Text style={{
                                        fontSize: 12, textAlign: 'right', color: '#8A7E7E', marginBottom: 30,
                                    }}>{userStore.RoleName === 'مدیر' ? (
                                        userStore.RoleName + ' ' + userStore.BuildingName
                                    ) : (
                                        userStore.RoleName + ' واحد ' + userStore.UnitNumber
                                    )}</Text>
                                    <Text style={{
                                        fontSize: 16, textAlign: 'left', color: '#5D4A4A',
                                        fontFamily: Platform.OS === 'ios' ? 'IRANYekan-Black' : 'IRANYekanBlack',
                                    }}>{userStore.NameOfUser}</Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginBottom: 25,
                                    }}
                                >
                                    <View
                                        style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
                                    >

                                        <Image
                                            source={images.ic_Phone}
                                            style={{
                                                //tintColor: drawerItem,
                                                height: 24,
                                                width: 24}}
                                        />
                                        <Text style={{fontSize: 12}}>شماره همراه</Text>
                                    </View>
                                    <Text
                                        style={{
                                            flex: 2,
                                            fontSize: 16, textAlign: 'left', color: '#BFACAC',
                                        }}
                                    >{persistStore.username}</Text>
                                </View>


                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginBottom: 25,
                                    }}
                                >
                                    <View
                                        style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
                                    >
                                        <Image
                                            source={images.ic_Kind}
                                            style={{
                                               // tintColor: drawerItem,
                                                height: 24,
                                                width: 24
                                            }}
                                        />
                                        <Text style={{fontSize: 12}}>جنسیت</Text>
                                    </View>
                                    <View
                                        style={{flex: 2}}
                                    >

                                        <SwitchText
                                            value={this.state.sex}
                                            onValueChange={(val) => {
                                                this.setState({sex: val, pristine: false});
                                            }}
                                            activeText={'آقا'}
                                            inactiveText={'خانم'}
                                            backgroundActive={primaryDark}
                                            backgroundInactive={'white'}
                                            activeTextStyle={{paddingHorizontal: 9, paddingVertical: 7}}
                                            inactiveTextStyle={{paddingHorizontal: 9, paddingVertical: 7}}
                                        />
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginBottom: 25,
                                    }}
                                >
                                    <View
                                        style={{flex: .5, flexDirection: 'row', alignItems: 'center'}}
                                    >
                                        <Image
                                            source={images.ic_idCard}
                                            style={{
                                                //tintColor: drawerItem,
                                                height: 24,
                                                width: 24
                                            }}
                                        />
                                        <Text style={{fontSize: 12, marginStart: 5}}>کد ملی</Text>
                                    </View>
                                    <FloatingLabelTextInput
                                        keyboardType='number-pad'
                                        multiline={false}
                                        maxLength={10}
                                        numberOfLines={1}
                                        returnKeyType="done"
                                        // floatingLabelEnable={true}
                                        tintColor={placeholderTextColor}
                                        textInputStyle={{
                                            fontSize: 14,
                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                            color: 'black',
                                            textAlign: 'right',
                                        }}

                                        underlineSize={1}
                                        placeholder='کد ملی ۱۰ رقمی'
                                        style={{flex: 1}}

                                        onChangeText={text => {
                                            if (text != '') {
                                                text = mapNumbersToEnglish(text);
                                                this.setState({nationalCode: text, pristine: false});

                                            } else {
                                                this.setState({nationalCode: null, pristine: false});
                                            }
                                        }}
                                        highlightColor={primaryDark}
                                        value={this.state.nationalCode}
                                    />
                                </View>

                                <View
                                    style={{
                                        marginBottom: 25,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View
                                        style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
                                    >
                                        <Image
                                            source={images.ic_birthday}
                                            style={{
                                                //tintColor: drawerItem,
                                                height: 24, width: 24}}
                                        />
                                        <Text style={{fontSize: 12, marginStart: 5}}>تاریخ تولد</Text>
                                    </View>

                                    <View
                                        style={{flex: 2, flexDirection: 'row'}}>

                                        <FloatingLabelTextInput
                                            ref="textInput"
                                            editable={true}
                                            multiline={false}
                                            maxLength={2}
                                            keyboardType='number-pad'
                                            numberOfLines={1}
                                            returnKeyType="done"
                                            // onSubmitEditing={() => this.processCalc()}
                                            floatingLabelEnable={true}
                                            tintColor={placeholderTextColor}
                                            textInputStyle={{
                                                fontSize: 14,
                                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                                color: 'black',
                                                textAlign: 'right',
                                            }}
                                            underlineSize={1}
                                            placeholder='روز'
                                            style={{flex: 1, marginEnd: 8}}
                                            onChangeText={text => {
                                                if (text != '') {
                                                    text = mapNumbersToEnglish(text);
                                                    this.setState({
                                                        day: text, pristine: false,
                                                    });

                                                } else {
                                                    this.setState({day: null, pristine: false});
                                                }
                                            }}
                                            highlightColor={primaryDark}
                                            value={this.state.day}
                                        />

                                        <FloatingLabelTextInput
                                            ref="textInput"
                                            editable={true}
                                            multiline={false}
                                            maxLength={2}
                                            keyboardType='number-pad'
                                            numberOfLines={1}
                                            returnKeyType="done"
                                            // onSubmitEditing={() => this.processCalc()}
                                            floatingLabelEnable={true}
                                            tintColor={placeholderTextColor}
                                            textInputStyle={{
                                                fontSize: 14,
                                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                                color: 'black',
                                                textAlign: 'right',
                                            }}
                                            underlineSize={1}
                                            placeholder='ماه'
                                            style={{flex: 1, marginEnd: 8}}
                                            onChangeText={text => {
                                                if (text != '') {
                                                    text = mapNumbersToEnglish(text);
                                                    this.setState({
                                                        month: text, pristine: false,
                                                    });

                                                } else {
                                                    this.setState({month: null, pristine: false});
                                                }
                                            }}
                                            highlightColor={primaryDark}
                                            value={this.state.month}
                                        />

                                        <FloatingLabelTextInput
                                            ref="textInput"
                                            editable={true}
                                            multiline={false}
                                            maxLength={2}
                                            keyboardType='number-pad'
                                            numberOfLines={1}
                                            returnKeyType="done"
                                            // onSubmitEditing={() => this.processCalc()}
                                            floatingLabelEnable={true}
                                            tintColor={placeholderTextColor}
                                            textInputStyle={{
                                                fontSize: 14,
                                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                                color: 'black',
                                                textAlign: 'right',
                                            }}
                                            underlineSize={1}
                                            placeholder='سال'
                                            style={{flex: 1}}
                                            onChangeText={text => {
                                                if (text != '') {
                                                    text = mapNumbersToEnglish(text);
                                                    this.setState({
                                                        year: text, pristine: false,
                                                    });

                                                } else {
                                                    this.setState({year: null, pristine: false});
                                                }
                                            }}
                                            highlightColor={primaryDark}
                                            value={this.state.year}
                                        />

                                        <Text style={{alignSelf: 'flex-end', paddingBottom: 2}}>13</Text>
                                    </View>


                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginBottom: 25,
                                    }}
                                >
                                    <View
                                        style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
                                    >
                                        <Image
                                            source={images.ic_password}
                                            style={{
                                                //tintColor: drawerItem,
                                                height: 24,
                                                width: 24}}
                                        />
                                        <Text style={{fontSize: 12, marginStart: 5}}>رمز عبور</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{
                                            flex: 2, borderWidth: 1, padding: 8,
                                            alignItems: 'center', borderColor: '#BFACAC', borderRadius: 10,
                                        }}
                                        onPress={() => this.setState({showPasswordChangePopUp: true})}
                                    >
                                        <Text style={{color: '#8A7E7E'}}>تغییر رمز عبور</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>

                            {/*<TouchableOpacity
                                style={{marginVertical: 24}}
                                onPress={() => this.logout()}
                            >
                                <View style={{flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            height: 48,
                                            alignItems: 'center',
                                            borderColor: '#D5CBCB',
                                            borderBottomWidth: 1,
                                            borderTopWidth: 1,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text style={{color: primaryDark}}>خروج از حساب کاربری</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>*/}


                        </View>
                    </ScrollView>

                    {this.state.showSelectPicker && (
                        <Overlay
                            catchTouch={true}
                            onPress={() => this.hideSelectPicker()}
                        >
                            <ListSelect
                                items={[
                                    {title: 'دوربین', onPress: true, icon: images.cameraIcon, type: 'camera'},
                                    {title: 'گالری', onPress: false, icon: images.galleryIcon, type: 'gallery'},
                                ]}
                                onItemSelected={(isCamera, type) => this.onUserImagePress(isCamera)}
                            />
                        </Overlay>
                    )}

                    {this.state.showPasswordChangePopUp &&
                    <PasswordChangePopUp
                        title={'تغییر رمز عبور'}
                        onClose={() => this.setState({showPasswordChangePopUp: false})}
                        mobileNumber={this.state.userToBeMobileNumber}
                        onSubmitPressed={body => this.createUser(body)}
                    />
                    }

                    <SelectTypePhoto
                        visible={this.state.showTypePhoto}
                        onCameraPress={() => this.onPhotoSelector(true)}
                        onGalleryPress={() => this.onPhotoSelector(false)}
                        onDismiss={() => this.setState({showTypePhoto: false})}
                    />

                    <AlertMessage
                        visible={this.state.showRemovePhoto}
                        title='حذف تصویر!'
                        message='آیا از حذف تصویر کاربر مطمئن هستید؟'
                        onConfirm={() => this.removeUserPhoto()}
                        onDismiss={() => this.setState({showRemovePhoto: false})}
                        confirmTitle='حذف'
                        dismissTitle='انصراف'
                    />

                    <AlertMessage
                        visible={this.state.showClosePopup}
                        title="خروج از صفحه؟"
                        message="در صورت خروج از صفحه، تغییرات ذخیره نخواهد شد."
                        onConfirm={() => {
                            navigation.goBack();
                        }}
                        onDismiss={() => this.setState({showClosePopup: false})}
                        confirmTitle="خروج"
                        dismissTitle="ادامه"
                        // onFinish={() => this.state.iosShowAlertClose ? this.onBackPress() : {}} //for onModal -> ios
                    />

                </View>
            </MobileLayout>
        );
    }

    onBackPress() {
        if (!this.state.pristine) {
            this.setState({showClosePopup: true});
        } else {
            navigation.goBack();
        }

    }

    async onSubmitPressed() {

        let birthDate = parseTimeToGregorian('13' + this.state.year, this.state.month, this.state.day);

        await changeUserProfile({
            sex: this.state.sex,
            nationalCode: this.state.nationalCode,
            birthDate: birthDate,
        })
            .then(() => {
                //TODO store these somewhere permanent
                userStore.Sex = this.state.sex;
                userStore.NationalCode = this.state.nationalCode;
                userStore.BirthDate = birthDate;
                this.setState({pristine: true});
                globalState.showToastCard();
            })
            .catch(e => globalState.showToastCard());
    }

    async logout() {
        persistStore.clearStore();
        navigation.navigate('SpLogin');
    }

    showSelectPicker() {
        this.setState({
            showSelectPicker: true,
        });
    }

    hideSelectPicker() {
        this.setState({
            showSelectPicker: false,
        });
    }

    removeUserPhoto() {
        this.setState({showRemovePhoto: false});
        const userPhoto = {IsDisabled: true};
        changeUserPhotoQuery(userPhoto).then(() => {
            accountsStore.updateUserImage(null);
            userStore.UserImage = null;
            this.setState({image: null});
        })
            .catch(e => globalState.showToastCard())
            .finally(() => globalState.hideBgLoading());
    }

    onPhotoSelector(isCamera) {
        globalState.showBgLoading();
        this.setState({showTypePhoto: false});

        /*if (isCamera) {
            if (this.state.cameraPermission === 'authorized') {
                ImagePicker.openCamera({
                    width: 600,
                    height: 600,
                    cropping: true,
                }).then(async image => {
                    const {path} = image;
                    await uploadFile(path)
                        .then(result => {
                            const fileName = result.fileName;
                            userStore.UserImage = fileName;
                            accountsStore.updateUserImage(fileName);

                            this.setState({
                                image: getFileDownloadURL(fileName),
                            });
                            const userPhoto = {Image: fileName};
                            changeUserPhotoQuery(userPhoto)
                                .catch(e => globalState.showToastCard())
                                .finally(() => globalState.hideBgLoading());
                        })
                        .catch(e => console.warn('!!!!!!!!!!!!! uploadFile catch e:', e))
                        .finally(() => globalState.hideBgLoading());
                }).finally(() => globalState.hideBgLoading());
            } else if (this.state.cameraPermission !== 'restricted') {
                if (Platform.OS === 'ios' && this.state.cameraPermission === 'denied') {
                    this.alertForIosPermission('دوربین');
                } else {
                    this._requestPermission('camera');
                }
            }
        } else {

            if (this.state.photoPermission === 'authorized') {
                ImagePicker.openPicker({
                    width: 600,
                    height: 600,
                    cropping: true,
                }).then(async image => {
                    const {path} = image;
                    console.log('saeed33',path);
                    await uploadFile(path)
                        .then(result => {
                            const fileName = result.fileName;

                            userStore.UserImage = fileName;
                            accountsStore.updateUserImage(fileName);
                            let filePath=getFileDownloadURL(fileName);
                            console.log('saeed',filePath);
                            this.setState({
                                image: filePath,
                            });
                            const userPhoto = {Image: fileName};
                            changeUserPhotoQuery(userPhoto)
                                .catch(e => globalState.showToastCard())
                                .finally(() => globalState.hideBgLoading());
                        })
                        .catch(e => showMassage('خطا در آپلود فایل','خطا','error') )
                        .finally(() => globalState.hideBgLoading());
                }).finally(() => globalState.hideBgLoading());
            } else if (this.state.photoPermission !== 'restricted') {
                if (Platform.OS === 'ios' && this.state.photoPermission === 'denied') {
                    this.alertForIosPermission('گالری تصاویر');
                } else {
                    this._requestPermission('photo');
                }
            }
        }*/
    }

    _requestPermission(type) {
        Permissions.request(type).then(response => {
            if (type === 'camera') {
                this.setState({cameraPermission: response});
            } else {
                this.setState({photoPermission: response});
            }
            if (response === 'authorized') {
                this.onPhotoSelector(type === 'camera');
            }
        });
    }

    alertForIosPermission(title) {
        Alert.alert(
            'اجازه دسترسی به ' + title,
            'شما مجوز لازم را صادر نکرده اید از طریق تنظیمات اقدام نمایید!',
            [
                {
                    text: 'لغو',
                    onPress: () => console.log('Permission denied'),
                    style: 'cancel',
                },
                {text: 'باز کردن تنظیمات', onPress: Permissions.openSettings},
            ],
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F1F1',
        paddingBottom: 30
    },
    subcontainer: {
        flex: 1,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingEnd: 13,
        paddingStart: 13,
        height: 45,
    },
    rowTitle: {
        flex: 1,
    },
    button: {
        flex: 1,
        borderWidth: 0.5,
        borderRadius: 4,
        height: 33,
        marginHorizontal: 7,
    },
    fromTop: {
        top: 0,
    },
    fromBottom: {
        bottom: 0,
    },
    img: {
        tintColor: 'black',
        height: 24,
        width: 24,
        marginEnd: 24,
    },
    actionIcon: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        height: '100%',
    },
});

const userImageSectionStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        margin: 8,
        justifyContent: 'center',
        marginBottom: 32,
    },
    imageContainer: {
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        borderRadius: 80,
    },
    image: {
        height: 160,
        width: 160,
        borderRadius: 80,
        resizemode: 'cover',
    },
});
