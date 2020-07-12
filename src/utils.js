import {accountsStore, globalState, persistStore, userStore} from './stores';
import {uploadUrl} from './constants/values';
import React from 'react';
const jMoment = require('moment-jalaali');
import fetch from 'isomorphic-unfetch';
import version from './version';
import {create} from 'mobx-persist';
import Router from "next/router";
// var serverUrl;
const SERVER_URL = version.release ? "https://www.monta.ir/apaman" : 'http://monta.ir:5000';
const SERVER_NAME = '/apaman198';
let firsTime = true;
import accounting from 'accounting';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';



export async function fetchFactory(url, options) {
    console.log("*********fetchFactory Start*******");
    const {body, ...rest} = options;
    const requestURL = SERVER_URL + SERVER_NAME + url;
    console.log('fetchFactory utils serverURL: ', SERVER_URL);
    console.info('fetchFactory utils url: ', url);
    console.info('fetchFactory utils body: ', body);
    // ToDo Ios check
    console.warn('********** fetch SERVER_URL + SERVER_NAME + url: ', requestURL);
    const headersSetting={
        'Access-Control-Allow-Origin': '*',
        'Accept'        : 'application/json',
        'Content-Type'  : 'application/json',
        'Authorization' : 'Bearer ' + persistStore.token,
    }
        const response = await fetch(requestURL, {
            headers: headersSetting,
            body: JSON.stringify(body),
            ...rest,
        });
        const message = unicodeToChar(response.headers.get('errMessage'));

        logger('%%%%%%%%%%%%%%%% fetchFactory response.url : ', response.url);
        logger('%%%%%%%%%%%%%%%% fetchFactory response.message : ', message);
        if (response.status === 200) {
            if (parseInt(response.headers.get('errCode')) === 1000) {
                globalState.toastType = 'success';
                globalState.setResponseCode(1000);
                globalState.setResponseMessage('');
            } else {
                globalState.toastType = 'success';
                globalState.setResponseCode(parseInt(response.headers.get('errCode')));
                globalState.setResponseMessage(message);
            }
            return await response.json();
        } else if (response.status === 507) {
            alert(message, Toast.LONG);
        } else if (response.ok && response.status !== 200) {
            logger('%%%%%%%%%%%%%%%% fetchFactory errMessage: ', message);
            if (message !== 'لیست خالی') {
                const errCode = parseInt(response.headers.get('errCode'));
                globalState.setResponseCode(errCode);
                globalState.setResponseMessage(message);
                globalState.toastType = errCode === -1 ? 'error' : 'warning';
            }

            // noinspection ExceptionCaughtLocallyJS
            throw {errCode: parseInt(response.headers.get('errCode')), errMessage: message};
        } else {
            logger('%%%%%%%%%%%%%%%% fetchFactory throw new Error() url:', response.url);
            const errMessage = '!!! Error ' + response.status + ' !!!';
            globalState.setResponseCode(response.status);
            globalState.setResponseMessage(errMessage);
            globalState.toastType = 'error';
            globalState.showToastCard();
            throw {errCode: 0, errMessage: errMessage};
        }
}

export async function testFetch() {
    console.log("*********testFetch Start*******");
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjIiLCJpYXQiOjE1NzY0ODYwODgsImV4cCI6MTU3OTA3ODA4OCwiaXNzIjoiQXV0aG9yaXphdGlvbi9SZXNvdXJjZS9Nb250YSBzZXJ2ZXIiLCJzdWIiOiJoZWphemkucHBwQGdtYWlsLmNvbSJ9.LAfXR4ekc8_GSk6yBTa6pP03hLIag3b-MgPS1ToxsobD2lkFbVv4xhMDCyJnrHMdZYuuvVH-w9eqdMzfC5-att3rPWrL8JwQgFGQ5iGa4PKT_Mko6Jr5vWclpOtonqEYxCKlMBGY_w8lGw0G3pq1wRWM4BjFiR8AFiD2cgkGqhA";
    return await fetch("http://monta.ir:5000/apaman198/user/search/10/null.null.null", {
        headers: {
            'Accept'        : 'application/json',
            'Content-Type'  : 'application/json',
            'Authorization' : 'Bearer ' + token,
        },
        method: 'GET',
    })
        .then(result => result.json())
        .then(data => data);
}

async function netConnection() {
    let connectionResult = true;
    // await NetInfo.fetch().then(async state => {
    //     logger('@@@@@@@@@@ netConnection type: ', state.type);
    //     logger('@@@@@@@@@@ netConnection details: ', state.details ? state.details : '');
    //     logger('@@@@@@@@@@ netConnection type wifi ip: ', state.type === 'wifi' ? state.details.ipAddress : state.details.isConnectionExpensive);
    //     connectionResult = state.isConnected;
    // }).catch(e => {
    //     connectionResult = false;
    //     firsTime = true;
    //     logger('!!!!!!!!!!!!!!!! fetchFactory Internet Connection Field ', e);
    //     globalState.setResponseCode(0);
    //     globalState.setResponseMessage('!!!خطا اینترنت!!!' + e.message);
    //     globalState.toastType = 'error';
    //     globalState.showToastCard();
    //     throw e;
    // });
    return connectionResult;
}

class CheckInternetTimeOutError extends Error {
    constructor(...params) {
        super(...params);
        this.name = 'CheckInternetTimeOutError';
    }
}


async function fetchWithTimeout(url, errMessage, options = {method: 'GET'}, timeout = 5000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new CheckInternetTimeOutError(errMessage)), timeout)),
    ]);
}

export function unicodeToChar(text) {
    if (text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    } else return 'مشکلی پیش آمده! با پشتیبانی تماس بگیرید.';
}

export async function uploadFile(path) {

    console.warn('&&&&&&&&&& uploadFile path: ', path);
    var formData = new FormData();
    formData.append('userFile', {
        uri: path,
        type: 'image/jpeg',
        name: path.replace(/^.*[\\\/]/, ''),
    });


    const response = await fetch(SERVER_URL + SERVER_NAME + '/upload', {
        method: 'POST',
        body: formData,
        headers: {
            // 'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + persistStore.token,
        },
    });

    if (response.ok) {
        return await response.json();
    }
}
export async function uploadFileByFormData(formData) {

    const response = await fetch(SERVER_URL + SERVER_NAME + '/upload', {
        method: 'POST',
        body: formData,
        headers: {
            // 'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + persistStore.token,
        },
    });

    if (response.ok) {
        return await response.json();
    }
}

export function parseTimeToJalaali(date, isTime = true) {
    return (
        jMoment(date, 'YYYY-M-D HH:mm:ss').format('jYYYY/jM/jD') +
        (isTime ? '   ' + jMoment(date, 'YYYY-M-D HH:mm:ss').format('HH:mm') : '')
    );
}

export function parseToGregorian(date) {
    return jMoment(date, 'jYYYY/jM/jD').format('YYYY-M-D');
}

export function parseTimeToGregorian(year, month, day) {
    return parseToGregorian(year + '/' + month + '/' + day);
}

export function getTimeJalaaliNow() {
    return jMoment().format('jYYYY/jM/jD HH:mm');
}

export function parseTimeToString(time) {
    let timeString = ':';
    if (time.getHours() < 10) {
        timeString = '0' + time.getHours() + timeString;
    } else {
        timeString = time.getHours() + timeString;
    }

    if (time.getMinutes() < 10) {
        timeString = timeString + '0' + time.getMinutes();
    } else {
        timeString = timeString + time.getMinutes();
    }
    return timeString;
}

export function mapNumbersToEnglish(string) {
    return string.toString().replace(/[\u0660-\u0669\u06f0-\u06f9]/g, function (c) {
        return c.charCodeAt(0) & 0xf;
    });
}

export function inputNumberValidation(string, beforeValue, validRegex = /[\d-.]+$/) {
    let text = mapNumbersToEnglish(string);
    if (text.length > 0 && !validRegex.test(text)) {
        text = beforeValue;
    }
    return text;
}

export function toPersianNum(string) {
    let persianNums = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return string.replace(/[0-9]/g, function (c) {
        return persianNums[c.charCodeAt(0) - 48];
    });
}

export function priceFormatter(price) {
    let formattedPrice = '';
    let index = 1;
    while (price > 0) {
        formattedPrice = (price % 10) + formattedPrice;
        price = Math.floor(price / 10);
        if (index % 3 === 0 && price !== 0) {
            formattedPrice = ',' + formattedPrice;
        }
        index++;
    }
    return formattedPrice;
}

export function commaSeparate(digits) {
    let ss = '';
    // StringBuilder ss = new StringBuilder();
    let count = 0;
    if (digits) {
        for (let i = digits.length - 1; i >= 0; i--) {
            count++;
            if (count === 3 && i !== 0) {
                count = 0;
                ss = ss + digits.charAt(i);
                ss = ss + ',';
            } else {
                ss = ss + digits.charAt(i);
            }
        }
    }
    return ss;
}

export function inputPriceFormatter(inputPrice) {
    if (inputPrice === '') {
        return '';
    }
    let formattedPrice = '';
    let price = parseInt(inputPrice.replace(/\D/g, ''));
    let index = 1;
    while (price > 0) {
        formattedPrice = (price % 10) + formattedPrice;
        price = Math.floor(price / 10);
        if (index % 3 === 0 && price !== 0) {
            formattedPrice = ',' + formattedPrice;
        }
        index++;
    }
    return formattedPrice;
}

export function clearPriceFormat(inputPrice) {
    if (inputPrice === '') {
        return '';
    }
    return inputPrice.replace(/\D/g, '');
}

export async function sleep(time) {
    return await new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
}

export async function fetchStore() {
    const hydrate = create({
        storage: localStorage,
        jsonify: true,
    });
     hydrate('persistStore', persistStore);
    await hydrate('accountsStore', accountsStore);
}
export function fetchStore2() {
    const hydrate = create({
        storage: localStorage,
        jsonify: true,
    });
     hydrate('persistStore', persistStore);
     hydrate('accountsStore', accountsStore);
     return hydrate;
}

export function getFileDownloadURL(filename) {
    if (filename && filename !== '') {
        let filePath=SERVER_URL + SERVER_NAME + uploadUrl + '/' + filename;
        console.log(filePath);
        return filePath;
    }
    return null;
}

export function isValidate(item, type = 'isEmpty') {
    switch (type) {
        case 'isEmpty':
            console.warn('isValidate: Type isEmpty', item);
            if (item == null) {
                console.warn('isValidate: Null');
                return false;
            } else if (Array.isArray(item)) {
                console.warn('*********** isValidate: Array', item);
                return item && item.length > 0;
            } else if (
                item instanceof String ||
                Object.prototype.toString.call(item) === '[object String]'
            ) {
                console.warn('isValidate: String', item);
                return !!item;
                // if (!item) {
                //   // console.warn("isValidate: String", false);
                //   return false;
                // } else {
                //   // console.warn("isValidate: String", true);
                //   return true;
                // }
            } else {
                return false;
            }
        default:
            console.warn('isValidate: default False....', item);
            return false;
    }
}

export function cardFormat(value) {
    if (value) {
        value = mapNumbersToEnglish(value);
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        var matches = v.match(/\d{4,16}/g);
        var match = (matches && matches[0]) || '';
        var parts = [];
        for (var i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join('-');
        } else {
            return value;
        }
    } else {
        return '';
    }
}
export function cardMask(cardNumber) {
    if (cardNumber.length >= 16) {
        let masked = cardNumber.match(new RegExp('.{1,4}', 'g'));
        if (cardNumber.length === 19) {
            masked = cardNumber.split('-');
        }
        if (Platform.OS === 'ios') masked = masked.reverse();
        masked[1] = masked[1].replace(/\d/g, '*');
        masked[2] = masked[2].replace(/\d/g, '*');
        return masked.join('-');
    }
}
export function shebaFormat(value) {
    if (value) {
        value = mapNumbersToEnglish(value);
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        var matches = v.match(/\d{4,22}/g);
        var match = (matches && matches[0]) || '';
        var parts = [];
        for (var i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    } else {
        return '';
    }
}


export function findByInArray(array, value, key = 'ID') {
    return array.find(o => o[key] == value);
}



export function logger(logMessage, consoleValue = '') {
    // firebase.crashlytics().setUserId(userStore.userID ? userStore.userID : '0');
    // firebase.crashlytics().setUserName(persistStore.username ? persistStore.username : 'NoUser');
    // firebase.crashlytics().log('Log: ' + logMessage + consoleValue);
    // firebase.crashlytics().recordError(new Error(logMessage + consoleValue));
    console.warn(logMessage, consoleValue);
}

export function compare2sort(key) {
    return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }

        const validRegex = /[-\d.]+$/;

        const varA = validRegex.test(a[key]) ? parseInt(a[key]) : a[key];
        const varB = validRegex.test(b[key]) ? parseInt(b[key]) : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }

        return comparison;
    };
}

export function getTabWidth(width, number, margin = 48) {
    return (width - margin) / number;
}

export function showMassage(msg, title='', type) {
    globalState.toastType = type;
    globalState.toastTitle = title;
    globalState.setResponseMessage(msg);
    globalState.showToastCard();

}
export function showWarning(msg) {
    globalState.toastType = 'warning';
    globalState.toastTitle = 'پیام';
    globalState.setResponseMessage(msg);
    globalState.showToastCard();

}

export const xPackeger={
    theme: version.release ? '' : 'gray',
    modules:[],
};

export function isRtl(lang) {
    const rtlLanguages = ['fa', 'ar'];
    return rtlLanguages.includes(lang)
};
export function isMobile(){
    /* if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
         || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
        return  true;
     }*/

    return  window.innerWidth < 500;
}

export function height(){
    return  Math.min(window.innerHeight, 700);
}

export function width(){
    return  Math.min(window.innerWidth, 700);
}

export function getHeight(){
    return  Math.min(window.innerHeight, 700);
}
export function getWidth(){
    return Math.min(window.innerWidth, 700);
}
export function setScreenSize(){
    let width=Math.min(window.innerWidth, 700);
    let height=globalState.innerHeight;
    global.width=width;
    global.height=height;
    globalState.width=width;
    globalState.height=height;
}
export function deviceWide(){
    return  window.innerWidth>700;
}

export function Platform(){
    var ua = navigator.userAgent;
    var checker = {
        android: ua.match(/Android/),
        iphone: ua.match(/(iPhone|iPod|iPad)/),
        blackberry: ua.match(/BlackBerry/),
        operaMini: ua.match(/Opera Mini/),
        ieMobile: ua.match(/IEMobile/),
    };
    if (checker.android){
        return 'android'
    }
    else if (checker.iphone){
        return 'ios'
    }
    else if (checker.blackberry){
        return 'blackberry'
    } else if (checker.operaMini){
        return 'operaMini'
    } else if (checker.ieMobile){
        return 'ieMobile'
    }
    else {
        return 'web'
    }
}
export var onScrollFab = (event, prevOffset) => {
    const currentOffset ={}// event.nativeEvent.contentOffset.y;
    const direction = currentOffset > 0 && currentOffset > prevOffset ? 'down' : 'up';
    let isFabVisible = direction === 'up';

/*    if (Platform.OS === 'ios') {
        const maxOffsetY = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height;
        const targetIosOffsetY = maxOffsetY - maxOffsetY / 6;
        // If the user is scrolling down (and the action-button is still visible) hide it
        isFabVisible = direction === 'up' && currentOffset < targetIosOffsetY;
    }*/

    return {currentOffset, isFabVisible, };
};
//by yousefi
//prototype
String.prototype.replaceAll = function(str1, str2)
{
    return this.split(str1).join(str2);
}



export function saveCookie(key,value){
    value=JSON.stringify(value);
    bake_cookie(key, value);
}
export function getCookie(key){
   let val= read_cookie(key);
   if(!val || typeof(val)!=='string' ) return;
   return JSON.parse(val);
}

export function deleteCookie(key){
    delete_cookie(key);
}

//test
global.navigateData={};
export const navigation={
    goBack:()=>{
        Router.back('/main');
    },

    navigate:(screenPath,params)=>{
        screenPath=screenPath.startsWith('/')?screenPath:'/'+screenPath;
        const navigateData={
            pathname: screenPath,
        };
        if(params){
            let jsonStr=JSON.stringify(params);
            let encodeParam=encodeURIComponent(jsonStr);
            navigateData.query={params: encodeParam,}
        }
        Router.push(navigateData);
    },
    replace:(screenPath,params)=>{

        let jsonStr=JSON.stringify(params);
        let encodeParam=encodeURIComponent(jsonStr);
        screenPath=screenPath.startsWith('/')?screenPath:'/'+screenPath;
        Router.push({
            pathname: screenPath,
            query: {params: encodeParam,},
        })
    },
    getParam:(paramName,defaultValue)=>{
       if(!Router.query.params)
           return null;
        let encodeParam=decodeURIComponent(Router.query.params);
        let paramsToJson=JSON.parse(encodeParam);
        return paramsToJson[paramName] || defaultValue;
    },
    encodeParams:(params)=>{
        let encodeParam=decodeURIComponent(params);
        /*let paramsToJson=JSON.parse(encodeParam);*/
        return encodeParam;
    },
    getQueryParams:(paramName)=>{
        var params = {};
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        if(paramName)
            return params[paramName];
        return params;
    }
}

export function waitForData(func){

    setTimeout(func,persistStore.token?0:20)
}

export function doDelay(time){
    time=time || 200;
    let delayPromise = new Promise((resolve, reject) => {
        setTimeout( function() {
            resolve("Success!")
        }, time)
    });

    return delayPromise;
}


