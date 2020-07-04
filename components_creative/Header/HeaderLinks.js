/*eslint-disable*/
import React, { useState, useEffect } from "react";
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

import styles from "assets/jss/nextjs-material-kit/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

import { i18n, withTranslation} from '../../i18n'
import {isRtl, fetchStore} from "../../src/utils";
import classNames from "classnames";
import Icon from "@material-ui/core/Icon";
import InputAdornment from "@material-ui/core/InputAdornment";
import Router from 'next/router'
import { persistStore } from "../../src/stores";
import { createBrowserHistory } from "history";


function HeaderLinks(props) {
    const classes = useStyles();
    const {t} = props;
    const [token, setToken] = useState(false);
    const logout=()=>{
        persistStore.token=null;
        let browserHistory = createBrowserHistory();
        browserHistory.replace({ firstPage: true });
         Router.push('/login');
     }
     const init=async()=> {
        await fetchStore();
        if(persistStore.token)
         setToken(true);
    }

    useEffect(() => {
      init();
    }, []);

    return (
            <List className={classes.list}>
            {token?
                <ListItem className={classes.listItem}>
                <Button
                    href="/Main"
                    color="transparent"
                    //target="_blank"
                    className={classes.navLink}
                >
                    <i style={{padding:3}} className="fas fa-home fa-stack-2x"></i>
                ساختمان من
                </Button>
            </ListItem>
         :
            <ListItem className={classes.listItem}>
                    <CustomDropdown
                        noLiPadding
                        navDropdown
                        buttonText="ورود به ساختمان"
                        buttonProps={{
                            className: classes.navLink,
                            color: "transparent"
                        }}
                        buttonIcon={Apps}
                        dropdownList={[
                            <Link href="/login">
                                <a className={classes.dropdownLink}>ساختمان من</a>
                            </Link>,
                            <a
                                href="/signup"
                                //target="_blank"
                                className={classes.dropdownLink}
                            >
                                ثبت نام
                            </a>
                        ]}
                    />
            </ListItem>

           }

            <ListItem className={classes.listItem}>
                <Button
                    href="https://www.monta.ir/apaman/"
                    color="transparent"
                    target="_blank"
                    className={classes.navLink}
                >
                    <CloudDownload className={classNames(classes.icons,{[classes.iconsRTL22]:isRtl(i18n.language)})}/>
                    {t('download_app')}
                </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
                <CustomDropdown
                    noLiPadding
                    navDropdown
                    buttonText={isRtl(i18n.language)? '(' + i18n.language + ') ' + t('language') : t('language') + ' (' + i18n.language + ') '}
                    buttonProps={{
                        className: classes.navLink,
                        color: "transparent"
                    }}
                    buttonIcon={Language}
                    dropdownList={[
                        <Button color="info" onClick={() => i18n.changeLanguage('fa')}>فارسی</Button>,
                        <Button color="info" onClick={() => i18n.changeLanguage('en')}>English</Button>
                    ]}
                />
            </ListItem>

        </List>
    );
}

export default withTranslation('translation')(HeaderLinks)
