/*eslint-disable*/
import React, {useEffect, useState} from "react";
import Link from "next/link";
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import {Apps, CloudDownload, Language} from "@material-ui/icons";
// core components
import CustomDropdown from "components_creative/CustomDropdown/CustomDropdown.js";
import Button from "components_creative/CustomButtons/Button.js";
import accounting from 'accounting';
import styles from "assets/jss/nextjs-material-kit/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

import { i18n, withTranslation} from '../../i18n'
import {isRtl, fetchStore} from "../../src/utils";
import classNames from "classnames";
import Icon from "@material-ui/core/Icon";
import InputAdornment from "@material-ui/core/InputAdornment";
//import persistStore from "../../library/stores/PersistStore";
import Router from 'next/router'
import { createBrowserHistory } from "history";
import { accountsStore,userStore,persistStore } from '../../src/stores';
import {logger} from "../../src/utils";
import {permissionId} from '../../src/constants/values';
import {bgItemRed, textItemRed} from "../../src/constants/colors";
import {getUserBalance} from "../../src/network/Queries";
function PanelHeaderLinks(props) {
    const [roleName, setRoleName] = useState();
    const [loadingBalance, setLoadingBalance] = useState(false);
    const classes = useStyles();
    const {t} = props;
    let costPermission=[];
    let payAnnouncePermissioin={};
    const logout=()=>{

       persistStore.token=null;
       let browserHistory = createBrowserHistory();
       browserHistory.replace({ firstPage: true });
       Router.push('/home');
    }

    const  onRoleSelected=(item)=> {
        console.log(item);
        persistStore.selected = item.ID;
        userStore.setUser(item);
        userStore.setUnitBalance(item.UnitBalance);
        costPermission = userStore.findPermission(permissionId.costCalculation);
        payAnnouncePermissioin = userStore.findPermission(userStore.RoleID === 1 ? permissionId.manualPay : permissionId.pay);
        setRoleName(item.RoleName);
        console.info('%%%%%%%%%%% onRoleSelected item selected: ', item);
        props.onRoleSelected && props.onRoleSelected(item);

    }
    const  getBalance=async()=> {
        setLoadingBalance(true);
        getUserBalance()
            .then(result => {
                logger('********* getUserBalance success result:', result);
                updateBalance(result);
            })
            .catch(e => {
                logger('********* getUserBalance catch e:', e);
                setLoadingBalance(false);
            });
    }

    const updateBalance=(newBalance)=> {
        accountsStore.accounts = accountsStore.accounts.map(function (item) {
            if (item.UnitID) {
                const target = newBalance.find(obj => obj.UnitID === item.UnitID);
                item.UnitBalance = target.UnitBalance;
                return item;
            } else {
                return item;
            }
        });
        setLoadingBalance(false);
    }
    useEffect(() => {
        setTimeout(()=>setRoleName( userStore.RoleName),100)

    }, []);
    return (
        <div style={{display: 'flex',flexDirection:'row',alignItems:'flex-start'}}>
            <div  onClick={getBalance}>
                <CustomDropdown
                    noLiPadding
                    navDropdown
                    buttonText={roleName}
                    buttonProps={{
                        className: classes.navLink,
                        color: "transparent"
                    }}
                    buttonIcon={Language}
                    dropdownList={accountsStore.accounts.map(item=>{
                        return(
                            <div dir={'rtl'} style={{display: 'flex',flex:1, padding:10,margin:3,borderRadius:4, backgroundColor:'#cecece'}}>
                                <div style={{display: 'flex',flex:1,flexDirection:'column',alignItems:'flex-start' ,margin:10}}>
                                  <span  style={{fontSize:16 }}  onClick={() => onRoleSelected(item)}>{item.RoleName}</span>
                                  <span  style={{  }}  onClick={() => onRoleSelected(item)}>{item.BuildingName}</span>
                                </div>
                                {item.UnitBalance && item.UnitBalance != 0 && (
                                    <div
                                        style={{
                                            flexDirection: 'row',
                                            backgroundColor: bgItemRed,
                                            padding: 8,
                                            borderRadius: 5,
                                            height:35,
                                        }}>
                                        <span
                                            style={{
                                                color: item.UnitBalance < 0 ? textItemRed : 'black',
                                                fontSize: 12,
                                                writingDirection: 'ltr',
                                            }}>
                                            {accounting.formatMoney(item.UnitBalance.replace('-', ''), '', 0, ',')}
                                        </span>
                                        <span
                                            style={{
                                                color:
                                                    item.UnitBalance < 0 ? textItemRed : 'black',
                                                fontSize: 12,
                                            }}>
                                            {' '}
                                            {item.CurrencyID}{' '}
                                        </span>
                                    </div>

                                )}
                            </div>
                        )
                        }
                        )}
                />
            </div>

            <Button
                style={{}}
                color="transparent"
                className={classes.navLink}
                onClick={logout}
                //href="/home"
            >
                <Icon className={classes.inputIconsColor}>
                    track_changes
                </Icon>
                خروج
            </Button>
        </div>
        /*<List  className={classes.list}>
            <ListItem className={classes.listItem}>
                <CustomDropdown
                    noLiPadding
                    navDropdown
                    buttonText="مدیر"
                    buttonProps={{
                        className: classes.navLink,
                        color: "transparent"
                    }}
                    buttonIcon={Language}
                    dropdownList={[
                        <Button color="info" onClick={() => i18n.changeLanguage('fa')}>مدیر</Button>,
                        <Button color="info" onClick={() => i18n.changeLanguage('en')}>ساکن</Button>
                    ]}
                />
            </ListItem>

            <ListItem style={{}} className={classes.listItem}>
                <Tooltip
                    id="instagram-tooltip"
                    title="خروج از پنل"
                    placement={"top"}
                    classes={{tooltip: classes.tooltip}}
                >
                    <Button
                        color="transparent"
                        className={classes.navLink}
                        onClick={logout}
                        //href="/home"
                    >
                        <Icon className={classes.inputIconsColor}>
                            track_changes
                        </Icon>
                        خروج
                    </Button>
                </Tooltip>
            </ListItem>
        </List>*/
    );
}

export default withTranslation('translation')(PanelHeaderLinks)
