/*eslint-disable*/
import React from "react";
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
import classNames from "classnames";
import { i18n, withTranslation} from '../../i18n'
import {isRtl} from "../../src/utils";

function HeaderLinks2(props) {
    const classes = useStyles();
    const {t} = props;
    return (
        <List className={classes.list}>
            <ListItem className={classes.listItem}>
                <Button
                    color="transparent"
                    href="home"
                    target="_blank"
                    className={classes.navLink}
                >
                    <i style={{padding:3}} className="fas fa-home fa-stack-2x"></i>
                    خانه

                </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
                <Button
                    href="https://www.monta.ir/apaman/"
                    color="transparent"
                    target="_blank"
                    className={classes.navLink}
                >
                    <CloudDownload className={classNames(classes.icons,{[classes.iconsRTL22]:isRtl(i18n.language) })} />
                     {t('download_app')}
                </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
                <CustomDropdown
                    noLiPadding
                    navDropdown
                    buttonText={isRtl(i18n.language) ? '(' + i18n.language + ') ' + t('language') : t('language') + ' (' + i18n.language + ') '}
                    buttonProps={{
                        className: classes.navLink,
                        color: "transparent"
                    }}
                    buttonIcon={Language}
                    dropdownList={[
                        <Button color="info" block onClick={() => i18n.changeLanguage('fa')}>فارسی</Button>,
                        <Button color="info" block onClick={() => i18n.changeLanguage('en')}>English</Button>
                    ]}
                />
            </ListItem>

        </List>
    );
}

export default withTranslation('translation')(HeaderLinks2)
