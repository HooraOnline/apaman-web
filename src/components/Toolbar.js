import React, {PureComponent} from 'react';

import images from "../../public/static/assets/images";
import {clearPriceFormat, inputPriceFormatter, mapNumbersToEnglish} from '../utils';
import {globalState, persistStore} from '../stores';
import {observer} from 'mobx-react';
import {TextField,LinearProgress} from '@material-ui/core';
import {bgEmpty, bgItemRed, drawerHeaderSubTitle, primary, textItemRed, toolbarItem} from "../constants/colors";
import Typography from "@material-ui/core/Typography";
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from '../../src/react-native';


@observer
export default class Toolbar extends PureComponent {
    constructor(props) {
        super(props);

        this.animatedExpandValue = null;
        this.animatedSearchIconValue = null;
        this.animatedCloseSearchIconValue = null;
        this.state = {
            showStart: !!props.customStyle.start,
            showSearch: false,
            isSort: false,
            titleWidth: 0,
        };
    }


    componentDidMount() {
        /*if (this.props.customStyle.main) {
            this.animateExpand(false);
        }*/
        if (this.props.customStyle.search) {
            this.animatedSearchIcon(false);
        }
    }


    animateExpand(isExpand, fromPress) {
        fromPress ? this.props.customStyle.main.onPress() : null;
        /*  Animated.spring(this.animatedExpandValue, {
            toValue: isExpand ? 1 : 0,
            duration: 500,
            useNativeDriver: true,
          }).start();*/
    }

    animatedSearchIcon(isOpen) {
        this.setState({showSearch: isOpen});
        /* Animated.parallel([
           Animated.timing(this.animatedSearchIconValue, {
             toValue: isOpen ? 1 : 0,
             duration: 400,
           }),
           Animated.timing(this.animatedCloseSearchIconValue, {
             toValue: isOpen ? 0 : 1,
             duration: 400,
           }),
         ]).start(() => {
           LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
           this.setState({showSearch: isOpen});
         });*/
    }

    getSearchComponent = (search) => {
        return search.component || <TextField
            style={styles.textSearch}
            InputProps22={{underline:{
                "&&&:before": { borderBottom: "none" },
                "&&:after": { borderBottom: "none"}
            }}}
            InputLabelProps={{
                style: {

                    color: 'green'
                } }}
            InputProps={{
                min: 0,
                max: 10,
                maxLength:5,
                guide: false,

            }}
            placeholder={search.placeholder || 'جستجو کنید'}
            onChange={event => {
                let searchText=event.target.value;
                search.onTextChange(search.number ? clearPriceFormat(mapNumbersToEnglish(searchText)) : mapNumbersToEnglish(searchText));
                this.setState({searchText: searchText});
            }}
            maxLength={100}
            keyboardType={search.number ? 'number-pad' : ''}
            multiline={false}
            numberOfLines={1}
            //value={search.number ? inputPriceFormatter(this.state.searchText) : this.state.searchText}

        />;
    };

    render() {
        const {
            start,
            title,
            subTitle,
            main,
            end,
            search,
            sort,
            actionList,
            expanderItem,
        } = this.props.customStyle;
        const titleAllowWidth = 280;// width - (start ? 56 : 0) - (end ? 56 : 0) - (search ? 56 : 0);
        const titleAllowLength = Math.floor(titleAllowWidth / (search ? 14 : 11));
        let animateExpandRotate, animateSearchIcon, animateCloseSearchIcon;
        const {isExpand} = this.props;


        if (search) {
            /* animateSearchIcon = this.animatedSearchIconValue.interpolate({
               inputRange: [0, 1],
               outputRange: ['0deg', '90deg'],
             });
             animateCloseSearchIcon = this.animatedCloseSearchIconValue.interpolate({
               inputRange: [0, 1],
               outputRange: ['0deg', '90deg'],
             });*/
        }
        if (this.state.showSearch) {
            return (
                <View
                    style={{
                       //flex:1,
                        flexDirection: 'row',
                        backgroundColor:this.props.color || primary,
                        height: 50,
                        elevation: 4,
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                    <View style={{
                        flex:1,
                        flexDirection: 'row',
                        height: 40,
                        margin:10,
                        backgroundColor: 'white',
                        alignItems:'center',
                        borderRadius: 10,
                    }}>
                        {search.typeName && (
                            <TouchableOpacity
                                style={styles.searchTypeBtn}
                                onPress={search.onPressType}>
                                  <Text
                                      style={{
                                          fontSize: 14,
                                          color: textItemRed,
                                      }}>
                                    {search.typeName.length > 13
                                        ? search.typeName.substring(0, 10) + '...'
                                        : search.typeName}
                                  </Text>
                            </TouchableOpacity>
                        )}
                        {
                            this.getSearchComponent(search)
                        }

                    </View>

                    <TouchableOpacity
                        onPress={() => {
                             search.onTextChange('');
                            this.setState({searchText: ''});
                            this.animatedSearchIcon(!this.state.showSearch);
                        }}
                        style={styles.actionIcon}>
                        <Image
                            source={images.ic_close}
                            style={styles.img}
                        />
                    </TouchableOpacity>
                    <style jsx global>{`
                     .MuiInput-underline:before{
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom:0px solid;
                    position: absolute;
                    transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                    pointer-events: none;
                }
                .MuiInput-underline:after{
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-bottom:0px solid;
                    position: absolute;
                    transform: scaleX(0);
                    transition: transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
                    pointer-events: none
                }
      `}</style>
                </View>
            )
        }




        return (
                    <View
                        style={{
                            width: '100%',
                            backgroundColor:this.props.color || primary,
                            height: 55,
                            elevation: 4,
                        }}>
                        {/* <StatusBar backgroundColor={globalState.statusBarColor} barStyle="light-content"/>*/}

                        <View style={{

                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                            width: '100%',
                            justifyContent: 'space-between',
                        }}>

                            {this.state.showStart ? (
                                <TouchableOpacity
                                    disabled={isExpand && persistStore.selected === 0}
                                    onPress={isExpand ? () => this.animateExpand(false, true) : start.onPress}
                                    style={styles.actionIcon}>
                                    <Image
                                        source={isExpand ? persistStore.selected === 0 ? images.checked_icon : images.ic_close : start.content}
                                        style={styles.img}/>
                                </TouchableOpacity>
                            ) : (
                                <View style={{marginStart: 72}}/>
                            )}
                            {title && (
                                <View style={{flexDirection: 'column', paddingTop: 3, flex: 1}}>
                  <Text style={styles.title}>
                    {title.length < titleAllowLength
                        ? title
                        : title.substring(0, titleAllowLength) + '...'}
                  </Text>
                                    {subTitle && (
                                        <Text style={styles.subTitle}>
                        {subTitle.length < titleAllowLength
                            ? subTitle
                            : subTitle.substring(0, titleAllowLength) + '...'}
                      </Text>
                                    )}
                                    {/*<Text> w:{titleAllowWidth} | l:{titleAllowLength} | tl:{title.length}</Text>*/}
                                </View>
                            )}
                            {main && (
                                <View
                                    style={{

                                        flexDirection: 'row',
                                        flex: 1,
                                        margin: 0,
                                        // alignItems: 'center',
                                        // justifyContent: 'center'
                                    }}>
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.animateExpand(!isExpand, true);
                                        }}
                                        disabled={!main.onPress || (isExpand && persistStore.selected === 0)}
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: 'transparent',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <View style={{ flex: 1,paddingLeft:5}}>
                                       <Text align={'left'}
                                          style={{
                                              color: 'white',
                                              fontSize:16,
                                              fontWeight:800,
                                              fontFamily:'IRANYekanExtraBold',
                                          }}>
                                        {main.title ? main.title : 'انتخاب نقش'}
                                       </Text>
                                            <Text
                                                align={'left'}
                                                style={{
                                                    color: 'white',
                                                    marginTop:3,
                                                    fontSize:13
                                                }}>
                                        {(main.subTitle && main.subTitle !== 'null') ? main.subTitle : ''}
                                       </Text>
                                        </View>

                                        {main.onPress && (
                                            <Image
                                                source={images.ic_expand}
                                                style={styles.img}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}

                            {end && (
                                <View>
                                    {end.itemComponent ? (
                                        end.itemComponent
                                    ) : end.icon ? (
                                        <TouchableOpacity
                                            onPress={end.onPress}
                                            style={styles.actionIcon}>
                                            <Image source={end.icon} style={styles.img}/>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text
                                            style={{
                                                color: toolbarItem,
                                                fontFamily: 'IRANYekanBold(FaNum)',
                                                alignSelf: 'flex-start',
                                            }}>
                        {end.text}
                      </Text>
                                    )}
                                </View>
                            )}
                            {sort && (
                                <TouchableOpacity
                                    onPress={() => {
                                        sort.onPress();
                                        this.setState({isSort: true});
                                    }}
                                    style={styles.actionIcon}>
                                    <Image source={images.ic_filter} style={styles.img}/>
                                </TouchableOpacity>
                            )}


                            {actionList && (
                                actionList.map(item => <TouchableOpacity
                                    onPress={item.onPress}
                                    style={styles.actionIcon}>
                                    <Image source={item.icon || images.ic_filter} style={styles.img}/>
                                </TouchableOpacity>)
                            )}

                            {search && (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.state.showSearch ? search.onTextChange('') : null;
                                        this.setState({searchText: ''});
                                        this.animatedSearchIcon(!this.state.showSearch);
                                    }}
                                    style={styles.actionIcon}>
                                    <Image
                                        source={images.ic_search}
                                        style={{
                                            tintColor: toolbarItem,
                                            height: 24,
                                            width: 24,
                                            transform: [
                                                {rotateY: animateSearchIcon},
                                                {rotateZ: animateSearchIcon},
                                            ],
                                        }
                                        }
                                    />


                                </TouchableOpacity>
                            )}


                        </View>


                        {globalState.bgLoading && (
                            <View style={{position: 'absolute', backgroundColor: bgEmpty, bottom: 0}}>
                                <LinearProgress variant="query" color="#8f2e1a"/>
                            </View>
                        )}
                    </View>



        );
    }
}
const styles = StyleSheet.create({
    img: {
        tintColor: toolbarItem,
        height: 24,
        width: 24,
    },
    title: {
        color: toolbarItem,
        fontSize: 16,
        fontFamily: 'IRANYekanMedium',
        alignSelf: 'flex-start',
    },
    subTitle: {
        color: drawerHeaderSubTitle,
        fontSize: 12,
        alignSelf: 'flex-start',
        marginBottom: 7,
    },
    actionIcon: {
        padding: 16,
        //paddingTop: 24,
        //paddingBottom: 16,
        //height: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        height: 40,
        //position: 'absolute',
        bottom: 10,
        start: 8,
        end: 48,
        // width: 350,
        backgroundColor: 'white',
        borderRadius: 10,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    textSearch: {
        height: 40,
        flex: 1,
        alignSelf: 'flex-start',
        textAlign: 'right',
        fontSize: 14,
        fontFamily: 'IRANYekanMedium',
        paddingTop: 8,
        paddingBottom: 5,
        paddingRight: 8,

    },
    searchTypeBtn: {
        cursor:'pointer',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minWidth: 80,
        maxWidth: 100,
        backgroundColor: bgItemRed,
        paddingLeft: 8,
        paddingRight: 8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
});

