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
} from '../react-native';
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
import PopupBase from "./PopupBase";


export default class ModalList extends PureComponent {
    constructor() {
        super();
        this.height = global.height - global.height / 4;
        this.state = {
            open: false,
        };

    }
    handleOpen=()=>{
        this.setState({open:true})
    }
    handleClose=()=>{
        this.setState({open:false})
    }
    onSearch(text){
        this.setState({keyWord: text})
        let items=this.props.items.filter((item)=> item[this.props.searchField].search(text)>-1);
        this.setState({searchItems:items})
    }
    select(item,index) {
        this.props.onValueChange(item);
        this.handleClose();

    }
    render() {
        const {
            title,
            items,
            itemComponent,
            validation = true,
            disabled,
            selectedItem,
            defaultTitle = '',
            minWidth = 250,
            selectedItemCustom,
            selectedComponentCustom,
            primaryColor = primaryDark,
            placeholder = '',
            fieldItem,
            onFinish,
            snake,
            styleText,
            hasBorderBottom = true,
            horizontal=false,
            numColumns=1,
            listStyle,
            catchTouch,
            dialogOpacity,
            dialogStyle,
        } = this.props;
        let selectedTitle = defaultTitle;
        if (selectedItem) {
            if (fieldItem) {
                selectedTitle = selectedItem[fieldItem];
            } else if (selectedItem.name) {
                selectedTitle = selectedItem.name;
            } else if (selectedItem.Name) {
                selectedTitle = selectedItem.Name;
            } else if (selectedItem.title) {
                selectedTitle = selectedItem.title;
            } else if (selectedItem.Title) {
                selectedTitle = selectedItem.Title;
            }
        }

        let listItems= this.state.searchItems || items ;
        return (
            <View style={{flex:1,}}>
                <TouchableOpacity
                    style={[{
                        flex: 1,
                        width:'100%',
                        flexDirection: 'row',
                        borderWidth: 1,
                        // alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: validation ? subTextItem : primaryColor,
                        borderRadius: 10,
                        // marginVertical: 7
                    },this.props.style]}
                    onPress={this.handleOpen}
                    disabled={disabled}>
                    {selectedComponentCustom ? (
                        selectedComponentCustom
                    ) : (
                        <View
                            style={[{
                                flexDirection: 'row',
                                // minHeight: 37,
                                alignItems: 'center',
                                backgroundColor: 'white',
                                flex: 1,
                                // paddingTop: 4,
                                // paddingBottom: 3,
                                paddingHorizontal: 4,
                                borderRadius: 10,
                                opacity: disabled ? 0.3 : 1,
                            },this.props.selectedItemStyle]}>
                            <View style={{flex: 1}}>
                                {selectedItemCustom ? (
                                    selectedItemCustom
                                ) : selectedTitle ? (
                                    <Text
                                        style={[
                                            styles.text,
                                            {
                                                alignSelf: 'flex-start',
                                                marginStart: 8,
                                            },
                                            styleText,
                                        ]}>
                                        {selectedTitle}
                                    </Text>
                                ) : (
                                    <Text
                                        style={[
                                            styles.text,
                                            {
                                                alignSelf: 'center',
                                                marginStart: 8,
                                                color: '#8A7E7E',
                                            },
                                            styleText,
                                        ]}>
                                        {title}
                                    </Text>
                                )}
                            </View>

                            <Image
                                source={images.ic_dropdown}
                                style={{
                                    height: 24,
                                    width: 24,
                                    tintColor: textItem,
                                }}
                            />
                        </View>
                    )}
                </TouchableOpacity>
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
                                    <TextInput
                                        style={{
                                            textAlign:'right',
                                            fontFamily:'IRANYekanFaNum',
                                        }}
                                        placeholder={"جستجو کنید"}
                                        onChangeText={text => this.onSearch(text)}
                                        value={this.state.keyWord}
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


                                <FlatList
                                    style={{flexGrow: 0}}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={numColumns}
                                    data={listItems}
                                    horizontal={horizontal}
                                    renderItem={({item, index}) => (
                                        <TouchableOpacity
                                            key={item}
                                            onPress={this.select.bind(this, item,index)}
                                            style={[{
                                                borderBottomWidth: hasBorderBottom ? 1 : 0,
                                                borderColor: borderSeparate,
                                                marginHorizontal: 24,
                                            },listStyle]}>
                                            {itemComponent ? (
                                                itemComponent(item,index)
                                            ) : (
                                                <View>
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            paddingVertical: 16,
                                                        }}>
                                                        {fieldItem ? item[fieldItem] : item.Name}
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>

            </View>
        );
    }

}


