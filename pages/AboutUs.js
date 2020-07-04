// pages/mycart.js

import PanelLayout from "../src/components/layouts/panelLayout";
import React, {Component} from "react";
import MobileLayout from "../src/components/layouts/MobileLayout";
import {bgWhite, primaryDark} from "../src/constants/colors";
import {Toolbar,AndroidBackButton} from "../src/components";
import images from "../public/static/assets/images";
import Typography from "@material-ui/core/Typography";
import Router from "next/router";
import {View} from "../src/react-native";
import {navigation} from "../src/utils";
const onBackPressed=()=> {
    //window.history.back();
    Router.back();
}


const residents=[
    ' امکان رویت هزینه ها و درآمد ساختمان',
    'پرداخت شارژ و قبوض با امکان اتصال مستقیم و بی واسطه به درگاه مدیریت ساختمان',
    'امکان رزرو امکانات رفاهی ساختمان',
    'امکان درج انتقادات و پیشنهادات به مدیریت ساختمان','امکان شرکت در نظرسنجی','مشاهده ی تابلوی اعلانات',
    ' مشاهدهی قوانین و مقررات ساختمان',
    'اطلاع از هرنوع رویداد تازه در ساختمان',
    'تماس با لابی، تأسیسات، مدیریت و اعضای هیئت مدیره ی ساختمان'
    ,'و ده ها امکان دیگر'
]
const manager=[
    'تعریف و ثبت مشخصات واحدها و اطلاعات ساکنین',
    'امکان تعریف هزینه و درآمد، جریمه ی دیرکرد و اعلام به ساکنین',
    'مکان دریافت شارژ و کلیه ی پرداخت های ساکنین با امکان اتصال مستقیم و بی واسطه به درگاه مدیریت ساختمان',
    'امکان ثبت پرداخت های دستی به تفکیک هر واحد',
    'مشاهده ی لیست پرداختها',
    'امکان ثبت برنامه و رزرو امکانات رفاهی ساختمان',
    'امکان ثبت نظرسنجی و تعیین دسترسی سطوح مختلف افراد',
    'ثبت اعلان در تابلوی اعلانات',
    'اطلاع رسانی قوانین و مقررات ساختمان',
    'و ...'
]

export default class AboutUs extends Component{

    render(props) {
        const toolbarStyle = {
            start: {
                onPress: this.onBackPress.bind(this),
                content: images.ic_back,
            },
            title: 'درباره ی ما',

        };
        return (
            <MobileLayout
                title={`درباره ما`}
                header={ <Toolbar color={"rgb(232,93,63,0.6)"} customStyle={toolbarStyle}/>}
                footer={<View style={{backgroundColor:'white',textAlign:'center',padding:10,}}>
                    <Typography variant={"subtitle1"} >
                    <span style={{fontSize:12}}>
                    کلیه حقوق متعلق به شرکت «افق فردای نواندیشان خلاق» است
                    </span>
                        </Typography>
                        <Typography variant={"subtitle2"}>2000 4915 021</Typography>
                    </View>}
                    style={{padding:'0',height:'fit-content'}}>

                <View style={{flex: 1, backgroundColor: '#F5F1F1'}}>
                    <div style={{height:80,background:"rgb(239,105,63,0.9)",position:'absolute',left:0,right:0,top:0}}></div>
                    <img src={images.bg_About_Shadow} style={{maxWidth:'100%',maxHeight:'100%',position:'sticky',top:-190}}/>
                <div style={{justifyContent:'flextStart',padding:'4%',maxWidth:'100%',paddingTop:0}}>
                    <Typography variant={"subtitle1"} style={{marginBottom:'5%',fontWeight:'bold'}}>با ما بیشتر آشنا شوید</Typography>
                    <Typography variant={"subtitle1"} style={{lineHeight:'200%',marginBottom:'5%'}}>شرکت «افق فردای نواندیشان خلاق» در سال 1397 با تکیه بر به روزترین دستاوردهای فناوری و با هدف هوشمندسازی و بهبود کیفیت سطح زندگی به طور رسمی فعالیت خود را آغاز کرده است. اپلیکیشن «اپامن» درصدد است تا با ایجاد یک بستر شفاف بین تمامی ارکان ساختمان ها، هرنوع تعامل بین افراد ساختمان را تسهیل و تسریع نماید. درصورت نیاز به هر نوع راهنمایی یا سؤال، با شماره ی 0214915200 در تماس باشید:</Typography>
                    <Typography variant={"subtitle1"} style={{color:'#EA4523',fontWeight:'bold',marginBottom:'3%'}}>در ساختمان شما چه خبر است؟</Typography>
                    <Typography variant={"subtitle1"} style={{marginBottom:'5%'}}>ساکن، مستأجر، مالک یا مدیر فرقی نمی‌کند </Typography>
                    <Typography variant={"subtitle1"} style={{marginBottom:'5%'}}>با اپلیکیشن اپامن شما می‌توانید تمامی رویدادها و نیازهای جاری ساختمانتان را به ساده‌ترین و شفاف‌ترین شکل مدیریت کنید.</Typography>
                    <Typography variant={"h6"} style={{marginBottom:'5%'}}>ویژه ساکنین</Typography>
                    <ul style={{listStyleType:'none'}}>
                        {residents.map(val=><li><Typography variant={"subtitle2"}>- {val}</Typography></li>)}
                    </ul>
                    <Typography variant={"h6"}>ویژه مدیریت ساختمان </Typography>
                    <ul style={{listStyleType:'none'}}>
                        {manager.map(val=><li><Typography variant={"subtitle2"}>- {val}</Typography></li>)}
                    </ul>
                </div>

                <style jsx >{`
    li{
    margin-bottom:1%;
    }
@media screen and (max-width: 738px) {
    .footer-mobile{
    font-size:14px
    }
    }
    `}
                </style>
                </View>
            </MobileLayout>);
    }
    onBackPress=()=> {
        navigation.goBack();
    }
}
