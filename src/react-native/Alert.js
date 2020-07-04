import React,{PureComponent} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
    TextInput
} from './index';
import Slide from '@material-ui/core/Slide';
import {
    bgScreen, bgWhite, border,
    borderSeparate,
    gray, lightGrey,
    overlayColor,
    primaryDark,
    subTextItem,
    textItem
} from '../constants/colors';
import images from "../../public/static/assets/images";
import PopupBase from "../components/PopupBase";

const Alert={
    alert:function (title,message,actions,snake) {
        return (
            <View style={{flex:1,}}>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth={'sm'}
                >
                    <DialogTitle id="alert-dialog-title">
                        <View style={{
                            flex:1,
                            backgroundColor:bgScreen
                        }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    // alignItems: 'flex-start',
                                    // justifyContent: 'center',
                                    borderBottomWidth: 1,
                                    borderColor: borderSeparate,
                                    alignItems: 'center',

                                }}>
                                <TouchableOpacity
                                    onPress={this.handleClose}
                                    style={{paddingHorizontal: 16, height: '100%'}}>
                                    <Image
                                        source={images.ic_close}
                                        style={{
                                            tintColor: textItem,
                                            width: 24,
                                            height: 24,
                                            marginTop: 30,
                                            marginBottom: 21,
                                        }}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        // paddingHorizontal: 24,
                                        paddingTop: 24,
                                        paddingBottom: 16,
                                        alignSelf: 'flex-start',
                                    }}>
                                    {title}
                                </Text>
                            </View>

                            {
                                this.props.searchField &&
                                <View
                                    style={{
                                        height:44,
                                        flexDirection:'row',
                                        alignItems:'center',
                                        borderColor: border,
                                        borderWidth: 1,
                                        border:'1px solid #ececec',
                                        borderRadius:10,
                                        justifyCenter:'center',
                                        margin:10,
                                        padding:0,
                                        backgroundColor:'#fff'

                                    }}>
                                    <Image
                                        source={images.ic_search}
                                        style={{
                                            tintColor: textItem,
                                            width: 24,
                                            height: 24,
                                            marginHorizontal:10,
                                        }}
                                    />


                                </View>

                            }
                        </View>
                    </DialogTitle>
                    <DialogContent dividers={true}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: snake ? 'flex-end' : 'center',
                                alignItems: 'center',
                                backgroundColor: overlayColor,
                            }}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    // minHeight: 170,
                                    maxHeight: this.props.height || this.height ,
                                    // position: 'absolute',
                                    // left: 0,
                                    // right: 0,
                                    borderBottomStartRadius: snake ? 0 : 10,
                                    borderBottomEndRadius: snake ? 0 : 10,
                                    borderTopStartRadius: snake ? 20 : 10,
                                    borderTopEndRadius: snake ? 20 : 10,
                                    elevation: 7,
                                    minWidth: snake ? '100%' : minWidth,
                                    bottom:  0,
                                    paddingBottom:  0,
                                }}>
                                {message}

                            </View>
                        </View>
                    </DialogContent>
                    <DialogActions>
                        {
                            actions.map((act)=>{
                                return(
                                    <TouchableOpacity onPress={this.onPress} color="primary">
                                        {act.text}
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </DialogActions>
                </Dialog>

            </View>
        );

    }
}
export default Alert;


