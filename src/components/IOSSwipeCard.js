import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View,SwipeOut} from '../react-native';
//import Swipeout from 'react-native-swipeout';
import {primaryDark} from '../constants/colors';
import images from "../../public/static/assets/images";
import Grow from "@material-ui/core/Grow";

function BtnSwipe({icon, color, text, corner, noPadding = false,disabled}) {
    return (
        <View style={{ width:60, backgroundColor: '#f5f1f1', paddingTop: noPadding ? 0 : 10, paddingBottom: noPadding ? 0 : 6, flex: 1}}>
            <View
                style={[styles.btn, {backgroundColor: color}, {
                    borderTopEndRadius: corner ? 10 : 0,
                        borderBottomEndRadius: corner ? 10 : 0,
                }]}
            >
                <Image
                    source={icon}
                    style={{
                        height: 24,
                            width: 24,
                            tintColor: 'white',
                    }}
                    />
                    <Text
                    style={{
                        fontSize: 14,
                            color: 'white',
                    }}
                >
                    {text}
                </Text>
             </View>
        </View>
);
}

export default class IOSSwipeCard extends PureComponent {
    constructor(props) {
        super(props);
        console.warn('****** SwipeCard constructor props.onDelete: ', props.onDelete);
        this.addLeftBtns(props)

    }
    addLeftBtns(props){
        let disabledBtn =props.permission && !props.permission.deleteAccess;
        let deleteBtn = props.onDelete ? {
            text: 'حذف',
            component: (<BtnSwipe noPadding={props.noPadding} disabled={disabledBtn}   corner={props.deleteBtnCorner }  icon={images.ic_delete} color='#e95959' text='حذف'/>),

        onPress: () => {
            props.onDelete(this.props.data);
        },
            disabled: disabledBtn,
    } : false;
        let moreBtn = props.onMore ? {
            component: (<BtnSwipe noPadding={props.noPadding } corner={props.noPadding && !props.moreBtnCorner ? false: true} icon={ this.props.moreIcon || images.ic_more} color={this.props.moreColor || '#8a7e7e'} text={this.props.moreLabel || 'بیشتر'}/>),
        onPress: () => {
            props.onMore(this.props.data);
        },
            disabled: props.permission && !props.permission.writeAccess,
    } : false;

        let editBtn = props.onEdit ? {
            component: (<BtnSwipe noPadding={props.noPadding} icon={this.props.editIcon || images.ic_edit} color='#1CC4AD' text={this.props.editLabel || 'ویرایش'} corner={this.props.editCorner} />),
        onPress: () => {
            props.onEdit(this.props.data);
        },
            disabled: props.permission && !props.permission.writeAccess,

    } : false;
        this.swipeBtnsLeft = [];

        if (deleteBtn) {
            this.swipeBtnsLeft.push(deleteBtn);
        }
        if (editBtn) {
            this.swipeBtnsLeft.push(editBtn);
        }
        if (moreBtn) {
            this.swipeBtnsLeft.push(moreBtn);
        }
    }
    render() {

        this.addLeftBtns(this.props);
        const {title, permission, onItemPress, bgTitleColor = primaryDark, index, idSwipeOpened,disabled} = this.props;
        const props=this.props;
        return (
            /*<Swipeout
                sensitivity={10}
                autoClose={true}
                right={this.swipeBtnsLeft}
                style={[styles.container,
                {
                    borderTopEndRadius: this.props.noPadding ? 0: 7,
                        borderBottomEndRadius: this.props.noPadding ? 0: 7,},this.props.style,
                ]}
                disabled={disabled ||( permission && !permission.deleteAccess && !permission.writeAccess)}
                onOpen={() => {
                    this.props.onOpen(index);
                }}
                onClose={() => {
                    this.props.onClose(index);
                }}
                close={index !== idSwipeOpened}
            >*/
            <SwipeOut
                right={this.swipeBtnsLeft}
                sensitivity={10}
                autoClose={true}
                style={[styles.container,{borderTopEndRadius: props.noPadding ? 10: 7, borderBottomEndRadius:props.noPadding ? 10: 7,},this.props.style]}
                disabled={disabled ||( permission && !permission.deleteAccess && !permission.writeAccess)}
                onOpen={() => {
                    this.props.onOpen(index);
                }}
                onClose={() => {
                    this.props.onClose(index);
                }}
                close={index !== idSwipeOpened}
            >
                <TouchableOpacity
                    onPress={onItemPress}
                    disabled={!onItemPress}
                    style={{
                        borderTopEndRadius: 10,
                            borderBottomEndRadius: 10,
                            overflow: 'hidden',
                    }}
                >
                    {title && (
                    <View
                        style={[styles.title, {backgroundColor: 'black'}]}
                    >
                    <Text
                        style={{
                        color: 'white',
                            fontSize: 16,
                    }}
                    >
                        {title}
                    </Text>
                    </View>
                    )}
                    {this.props.children}
                </TouchableOpacity>
            </SwipeOut>

    );
    }
}

const styles = StyleSheet.create({
    container: {
        //overflow:  'hidden',
        backgroundColor: '#f5f1f1',
        marginTop:16,
    },
    title: {
        // paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // marginVertical: 10,
        // maxHeight: 99
    }
});
