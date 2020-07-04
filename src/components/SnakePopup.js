import React, {PureComponent} from 'react';
import PopupBase from "./PopupBase";
import accountsStore from "../stores/Accounts";

import {
    bgItemRed,
    bgScreen,
    bgWhite,
    textItemRed,
    borderSeparate,
    border,
    primaryDark,
    lightGrey, borderLight
} from "../constants/colors";

import ButtonBase from '@material-ui/core/ButtonBase';
import images from "../../public/static/assets/images";
import {getHeight} from "../utils";
import Grow from "@material-ui/core/Grow";
import {TouchableOpacity,View ,Text,Image} from "../react-native";

export default class SnakePopup extends PureComponent {
    constructor() {
        super();
        this.state = {open:false};
    }

    animateSnake(open, fn) {
        this.setState({open:false});
    }
    handleClose=()=>{
        this.setState({open:false});
        this.props.onClose && this.props.onClose();
    }
    render() {
        const {
            visible,
            toolbarTitle,
            items,
            fieldItem,
            search = false,
            itemComponent,
            primaryColor = primaryDark,
            fromTop = false,
            onClose,
            catchTouch = true,
            reRender = false,
            ListHeaderComponent=()=>{return null},
            ListHeaderComponentStyle={},
            style,
            dialogOpacity,
            position,
            contentStyle={},
            children,
        } = this.props;

        if (visible) {
            this.animateSnake(true, () => { });


        }
        console.log(items);
            let cStyle={
                marginTop:'80%',
                width:global.width,backgroundColor:bgWhite, borderTopRightRadius: 40,borderTopLeftRadius:40,borderColor:bgScreen};
            if(fromTop)
                cStyle={ width:global.width,backgroundColor:bgWhite, borderBottomRightRadius: 40,borderBottomLeftRadius:40,borderColor:bgScreen};
        return (
                <PopupBase
                    opener={this.item}
                    top={false}
                    visible={visible}
                    onClose={onClose}
                    dialogOpacity={dialogOpacity}
                    style={style || {marginTop:fromTop || 60,height:'80%',backgroundColor:bgScreen,opacity:1}}
                    contentStyle={[contentStyle,cStyle].reduce(function(acc, x) {
                        for (var key in x) acc[key] = x[key];
                        return acc;
                    } )}
                >

                    <View>
                        <TouchableOpacity
                            onPress={ ()=> this.handleClose()}
                            style={{
                                paddingRight: 24,
                                paddingLeft: 24,
                                paddingVertical:16,
                                height: 50,
                                //marginBottom:16,
                                // backgroundColor: primaryColor,
                                flexDirection: 'row',
                                // justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <img
                                src={catchTouch ? images.ic_close : images.ic_circleDone}
                                style={styles.img}
                            />

                            <Text
                                style={{
                                    paddingHorizontal:5,
                                    color: 'black',
                                    fontSize: 16,
                                    fontFamily:'IRANYekanFaNum-Bold',
                                }}>
                                {toolbarTitle}
                            </Text>
                        </TouchableOpacity>
                        <View style={{borderWidth:0,borderBottomWidth:1, borderColor:borderLight,  borderStyle:'dotted',marginBottom:20 }}/>
                        {items.map((item,index) => {
                                return (
                                    <View style={{ cursor: 'pointer',}}
                                          onClick={()=>this.onSelect(item)}>
                                        {itemComponent ? (
                                            itemComponent(item,index)
                                        ) : (
                                            <View style={{
                                                marginRight: 16,
                                                marginLeft:16,
                                                display:'flex',
                                                flexDirection:'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <View style={{height:1,width:'100%',backgroundColor:lightGrey,opacity:0.3,}} />
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        padding: 13,
                                                    }}>
                                                    {fieldItem ? item[fieldItem] : item.Name}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )
                            }
                        )}
                        {children}
                    </View>
                    <style jsx global>{`
                     .MuiPaper-rounded {
                        border-radius: 0px;
                      }
                      `}
                    </style>
                </PopupBase>


        );
    }

    onSelect(item) {
        this.animateSnake(false, this.props.onClose);
        this.props.onItemSelected(item);
    }
}

const styles ={
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
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    fromTop: {
        top: 0,
    },
    fromBottom: {
        bottom: 0,

    },
    img: {
        tintColor: bgWhite,
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
};
