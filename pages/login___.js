import React,{ useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import CircularProgress from '@material-ui/core/LinearProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components_creative/Header/Header.js";
import HeaderLinks2 from "components_creative/Header/HeaderLinks2.js";
import Footer from "components_creative/Footer/Footer.js";
import GridContainer from "components_creative/Grid/GridContainer.js";
import GridItem from "components_creative/Grid/GridItem.js";
import Button from "components_creative/CustomButtons/Button.js";
import Card from "components_creative/Card/Card.js";
import CardBody from "components_creative/Card/CardBody.js";
import CardHeader from "components_creative/Card/CardHeader.js";
import CardFooter from "components_creative/Card/CardFooter.js";
import CustomInput from "components_creative/CustomInput/CustomInput.js";
import clsx from 'clsx';
import styles from "assets/jss/nextjs-material-kit/pages/loginPage.js";
import Typography from "@material-ui/core/Typography";
import image from "assets/img/bg8.jpg";
import apamanImage from "assets/img/logo.png"
import backgroundImage from 'public/static/assets/images/theme/background-test.png'
import callIcon from 'public/static/assets/images/theme/ic_call.svg'
import Input from "@material-ui/core/Input";



import {loginQuery, roleQuery} from "../src/network/Queries";
import {logger,mapNumbersToEnglish} from "../src/utils";
import persistStore from "../src/stores/PersistStore";

import Router from 'next/router'
import {bgScreen} from "../src/constants/colors";
import ToastCard from "../src/components/ToastCard";
import {globalState} from "../src/stores";

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showMessage,setShowMessage]=useState(false)
    const [screenwidth, setScreenwidth] = useState(900);
    const [userNameValidation, setUserNameValidation] = useState("");
    const [passwordValidation,setPasswordValidation] = useState("");
    const [showPassword,setShowPassword]=useState(false);
    const [invalidLogin,setInvalidLogin]=useState(false)
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    setTimeout(function() {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    const { ...rest } = props;

    const validateForm=()=> {
        return userName.length > 0 && password.length > 0;
    }
    const onLogin =async (event)=>{
        console.log("*********onLogin Start*******");
        event.preventDefault();
        if (!validateForm()) {
            if (userName.length !== 11) {
                setUserNameValidation(false);
                return;
            }
            if (password.length < 6) {
                setPasswordValidation(false);
                return;
            }
        }
        persistStore.userName = userName;
        setLoading(true);
        await loginQuery(mapNumbersToEnglish(userName), mapNumbersToEnglish(password))
            .then(async () => {
                logger(userName + ' ********** loginQuery success ****');
                persistStore.selected = 0;
                //this.checkPushPermission();
                await roleQuery()
                    .then((res) => {
                        logger(userName + ' ********** roleQuery success ****');
                        Router.push('/Main');

                    })
                    .catch(e => {
                        logger(userName + ' !!!!!!!! roleQuery catch', e.errMessage);
                    })
                //.finally(() => setLoading(false));
            })
            .catch(e => {
                globalState.showToastCard()
                setLoading(false);
                //globalState.showToastCard();
                // logger(userName + ' !!!!!!!! loginQuery catch', e.errMessage);
            })
            .finally(() => {
                //this.setState({loading: false});
                // logger(userName + ' ******finily loginQuery******');
            });
    }
    const loginFailed=()=>{
        setInterval(()=>setShowMessage(true),5000)
        return
    }
    const keyPress=(e)=>{
        if(e.keyCode === 13){
            onLogin(e)
        }
    }
    return (
        <div>
            {/*<Header
                absolute
                color="transparent"
                brand="در صورتی که اکانت اپامن دارید وارد شوید"
                rightLinks={<HeaderLinks2 />}
                {...rest}
            />*/}
            <div
                className={classes.pageHeader}
                style={{
                    backgroundImage:screenwidth<700?"url(" + backgroundImage + ")":"url(" + backgroundImage + ")",
                    backgroundPosition: "top center",
                }}
            >
                <div className={classes.container}>
                    <GridContainer justify="center">
                        <GridItem xs={12} sm={8} md={4}>
                            <Card style={{borderRadius:'7%'}} className={classes[cardAnimaton]}>
                                <form className={classes.form}>
                                    <CardHeader style={{marginTop:-60,marginBottom:0}} className={classes.cardHeader}>
                                        <img style={{width:80}} src={apamanImage}/>
                                    </CardHeader>
                                    {/*<p className={classes.divider}>Or Be Classical</p>*/}
                                    <CardBody style={{paddingTop:0}}>
                                        <Typography variant='h5' align='center' style={{marginBottom:8}}>به اپامن خوش آمدید</Typography>
                                        <Typography variant='subtitle2' align='center' noWrap>برای ورود، شماره خود را وارد نمایید</Typography>
                                        <CustomInput
                                            labelText="مثال 09123456789"
                                            id="email"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                value:userName,
                                                onChange:e=>setUserName(e.target.value),
                                                type: "number",
                                                maxLength:"11",
                                                //onChange:{function(e){setUserName(e.target.value)}},
                                                endAdornment: (
                                                    <img src={callIcon}/>

                                                )
                                            }}
                                        />
                                        <CustomInput
                                            labelText="رمز عبور"
                                            id="pass"
                                            type={showPassword ? 'text' : 'password'} formControlProps={{
                                            fullWidth: true,

                                        }}
                                            inputProps={{
                                                value:password,
                                                onChange:(e)=>setPassword(e.target.value),
                                                onKeyDown:keyPress,
                                                type: showPassword ? "text" : "password",
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            style={{padding:0}}
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                autoComplete: "off",

                                            }}
                                        />

                                    </CardBody>
                                    { loading &&
                                    <LinearProgress color="secondary" />
                                    }

                                    <CardFooter className={classes.cardFooter}>

                                        <Button style={{margin:15,height:50,borderRadius:8}} block color="danger"
                                                onClick={onLogin}
                                        >ورود</Button>
                                    </CardFooter>


                                </form>
                            </Card>
                        </GridItem>
                        <div style={{backgroundColor:'white'}}>
                            <ToastCard
                                visible={globalState.toastCard}
                                type={globalState.toastType}
                                title={globalState.toastTitle}
                                message={globalState.responseMessage}
                                onClose={() => globalState.hideToastCard()}
                            />
                        </div>
                    </GridContainer>
                </div>
                <Footer whiteFont />
            </div>
            <style jsx global>{`
            .MuiInputLabel-shrink{
            display:none!important;
            }
            `}</style>
        </div>
    );
}

