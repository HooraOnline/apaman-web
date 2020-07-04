import React, { PureComponent} from 'react';
import {Image, Platform, Text, View} from '../react-native';
// import {ShowDateTime} from './index';
import IOSSwipeCard from "./IOSSwipeCard";
import {gray, primaryDark} from '../constants/colors';
import images from "../../public/static/assets/images";
import {persistStore} from '../stores';
import {getFileDownloadURL} from '../utils';
import ShowDateTime from './ShowDateTime';
import ImageCacheProgress from "./ImageCacheProgress";
import FastImage from "../react-native/FastImage";
import Progress from "../react-native/Progress";
export default class SuggestionCard extends PureComponent {
    constructor() {
        super();
        this.seprator = Platform.OS === 'ios' ? '-' : ' ';
        this.state = {
            imageExists: false,
        };
    }

    render() {
        const {
            Name,
            Description,
            CreatedAtDatetime,
            RoleName,
            UnitNumber,

        } = this.props.item;


        const {permission, idSwipeOpened, index} = this.props;
        return (
            <IOSSwipeCard
                noPadding
                permission={permission}
                onDelete={() => this.props.onSwipeRemove(this.props.item)}
                //onMore={() => alert('به زودی امکان پاسخ اضافه خواهد شد')}
                moreIcon={images.ic_reply}
                moreColor={gray}
                moreLabel={'پاسخ'}
                index={index}
                onClose={() => {
                }}
                onOpen={id => this.props.onOpenSwipe(id)}
                idSwipeOpened={idSwipeOpened}
            >
                <View style={{padding: 16}}>
                    <View style={{flex:1,height: 40,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        {!this.state.imageExists && (
                            <Image
                                source={images.default_ProPic}
                                style={{
                                    height: 56,
                                    width: 56,
                                    borderRadius: 26,
                                }}
                            />
                        )}
                        <ImageCacheProgress
                            style={{
                                height: this.state.imageExists ? 40 : 1,
                                width: this.state.imageExists ? 40 : 1,
                                borderRadius: 20,
                                overflow: 'hidden',
                            }}
                            imageStyle={{
                                height:  56,
                                width: 56 ,
                                borderRadius: 20,
                            }}
                            default_ProPic={images.default_ProPic}
                            source={{
                                uri:  this.props.item.Image,
                                //priority: FastImage.priority.high,
                            }}

                            indicator={Progress.Pie}
                            indicatorProps={{
                                size: 30,
                                borderWidth: 2,
                                color: '#ddd',
                                unfilledColor: primaryDark,
                            }}

                            onLoad={() => {
                                this.setState({imageExists: true});
                            }}

                        />
                        <View style={{flex:1,marginHorizontal:10}} >
                            <Text style={{
                                alignSelf: 'flex-start', fontSize: 16, color: '#5D4A4A', fontFamily:
                                    Platform.OS === 'ios'
                                        ? 'IRANYekan-ExtraBold'
                                        : 'IRANYekanExtraBold',
                            }}>{Name}</Text>
                            <Text
                                style={{
                                    alignSelf: 'flex-start', fontSize: 10, color: '#BFACAC',
                                }}
                            >
                                {RoleName} واحد {UnitNumber}
                            </Text>
                        </View>
                        <ShowDateTime
                            time={CreatedAtDatetime}
                            showTime
                            fontSize={12}
                            color={'#BFACAC'}
                            dotSize={2}
                        />

                    </View>



                    <Text
                        style={{
                            alignSelf: 'flex-start',marginStart:15, fontSize: 14, color: '#5D4A4A', marginTop: 8, marginBottom: 5,
                        }}
                    >
                        {Description}
                    </Text>


                </View>
            </IOSSwipeCard>
        );
    }
}
