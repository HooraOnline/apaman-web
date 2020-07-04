import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Button from "@material-ui/core/Button";
import Notifications from "@material-ui/icons/Notifications";

import styles from "assets/jss/material-dashboard-react/dropdownStyle.js";

const useStyles = makeStyles(styles);

export default function Dropdown(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(null);
    const handleToggle = event => {
        if (open && open.contains(event.target)) {
            setOpen(null);
        } else {
            setOpen(event.currentTarget);
        }
    };

    const handleClose = () => {
        setOpen(null);
        props.onClose && props.onClose();
    };
    return (
        <div>
            <div className={classes.manager}>
                <div  onClick={handleToggle}>
                    {

                        (props.openerComponent || <Button

                            aria-owns={open ? "menu-list-grow" : null}
                            aria-haspopup="true"

                            className={classes.buttonLink}
                        >
                            <Notifications className={classes.icons} />
                            <span className={classes.notifications}>I am SnakePopup. Click me and see my reflex</span>
                            <Hidden mdUp implementation="css">
                                <p onClick={handleClose} className={classes.linkText}>
                                    Notification
                                </p>
                            </Hidden>
                        </Button> )
                    }
                </div>

                <Poppers
                    open={Boolean(open)}
                    anchorEl={open}
                    transition
                    disablePortal

                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{
                                transformOrigin:
                                    placement === "bottom" ? "center top" : "center bottom"
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <div  >
                                        {props.render?props.render(handleClose):
                                            (<div onClick={handleClose} style={{width:global.width}} >
                                                <div style={{padding:10}} >
                                                    clic me to close
                                                </div>
                                                <div style={{padding:10}} >
                                                    clic me to close
                                                </div>
                                                <div style={{padding:10}} >
                                                    clic me to close
                                                </div>
                                            </div> )
                                        }
                                    </div>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Poppers>
            </div>
        </div>
    );
}
