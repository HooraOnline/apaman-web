import React, {PureComponent} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {deviceWide, getHeight} from "../utils";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Poppers from "@material-ui/core/Popper";
import {bgScreen, bgWhite} from "../constants/colors";

export default class PopupBase extends PureComponent {
    constructor(props) {
        super();
        //this.animatedFromBottom = new Animated.Value(0);
        this.state = {
            open:true,
        };
        //this.height = height - height / 4;
    }


    handleClickAway = (event) => {
        if(this.props.visible){
            event.stopPropagation();
            this.setState({open:false});
            this.props.onClose && this.props.onClose();
        }

    }
    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible) {
            this.setState({open:this.props.visible})
        }
         this.setState({deviceWide:deviceWide()})
    }

    render() {
        const {
            visible,
            style={},
            children,
            dialogOpacity=0.7,
            contentStyle={}
        } = this.props;
        if(!style.zIndex)
          style.zIndex= 100
        if(!style.height)
          style.height='93%';
        if(!style.backgroundColor)
         style.backgroundColor= bgScreen
        //style.opacity=1;
        return(

                <Poppers
                    open={Boolean(visible)}
                    anchorEl={visible}
                    transition
                    disablePortal
                    style={style}
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            placement="center top"
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={[contentStyle,{transformOrigin:  placement === "bottom" ? "center top" : "center bottom"}].reduce(function(acc, x) {
                                for (var key in x) acc[key] = x[key];
                                return acc;
                            } )}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClickAway}>
                                    <div>
                                        {this.state.open? (
                                            <div style={{}} >
                                                {children}
                                            </div>
                                        ) : null}
                                    </div>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Poppers>

        )
        /*if (visible) {
            return (
                <div style={{position: 'relative' }}>
                    <div style={{ minWidth:150, position: 'absolute',zIndex:100,right: 0, left: 0, top:top,bottom:bottom, height:dialogOpacity>-1?getHeight():undefined,}}>
                        <ClickAwayListener id={'clickAwayListener'} onClickAway={this.handleClickAway}>
                            <div>
                                {this.state.open? (
                                    <div style={{
                                        border: '0px solid',
                                    } }>
                                        <div style={style} >
                                            {children}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </ClickAwayListener>

                    </div>
                    <div style={{
                        position: 'absolute',
                        zIndex:99,
                        right: 0,
                        left: 0,
                        height:getHeight(),
                        display:'flex',
                        flex:1,
                        border: '0px solid',
                        width:'100%',
                        background:'#000',
                        opacity:dialogOpacity,
                    } } >

                    </div>
                </div>
            );
        } else {
            return (<div/>);
        }*/
    }

    onSelect(item) {
        //this.animateSnake(false, this.props.onClose);
        this.props.onItemSelected(item);
    }
}



