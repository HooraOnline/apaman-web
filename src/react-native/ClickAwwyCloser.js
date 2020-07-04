import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import TouchableOpacity from "./TouchableOpacity";

const useStyles = makeStyles(() =>
    createStyles({
        wrapper: {

        },
        container: {

        },
    }),
);

export default function ClickAwwyCloser(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const {children,onPress,onClose}=props;
    const handleClick = () => {
        setOpen((prev) => !prev);
        onClose && onClose();
    };

    const handleClickAway = (event) => {
        event.stopPropagation();
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div>
                {open ? (
                    <TouchableOpacity onPress={onPress} className={classes.container}>
                        {children}
                    </TouchableOpacity>
                ) : null}
            </div>
        </ClickAwayListener>
    );
}


