import React, {PureComponent} from 'react';
import {Animated, Platform, UIManager,FastImage} from '../react-native';
import {fab} from '../constants/colors';
import images from "../../public/static/assets/images";

//import FastImage from 'react-native-fast-image';
//import * as Progress from 'react-native-progress';
//import {createImageProgress} from 'react-native-image-progress';
import {getFileDownloadURL} from '../utils';
import {persistStore} from '../stores';

//const ImageCacheProgress = createImageProgress(FastImage);

export default class ImageComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            transactionImageIndeterminate: true,
            transactionImageProgress: 0,
            onError: false,
        };
    }
    render() {
        const {image, iHeight = 40, iWidth = 40, resizeMode = 'cover'} = this.props;
        return (<Text>کامپوننت پیاده سازی شود</Text>
            /*<ImageCacheProgress
                style={{
                    height: iHeight,
                    width: iWidth,
                    borderRadius: 10,
                    overflow: 'hidden',
                }}
                resizeMode={resizeMode}

                source={this.state.onError ? images.ic_error :
                    {
                        uri: getFileDownloadURL(image),
                        headers: {Authorization: 'Bearer ' + persistStore.token},
                    }}
                indicator={() => <Progress.Circle
                    progress={this.state.transactionImageProgress}
                    indeterminate={this.state.transactionImageIndeterminate}
                />}
                indicatorProps={{
                    borderWidth: 3,
                    color: fab,
                    // unfilledColor: primaryDark,
                }}

                onError={e => {
                    console.warn('!!!!!!!!!!!!!!!!!! onError Image e:', e);
                    this.setState({transactionImageIndeterminate: false, onError: true});
                }}
                onLoadStart={() => console.warn('!!!!!!!!!!!!!!!!!! onLoadStart Image ')}
                onProgress={e => {
                    const loaded = e.nativeEvent.loaded;
                    const total = Platform.OS === 'ios' ? e.nativeEvent.target : 10000;
                    console.warn('%%%%%%%%%%% onProgress e.nativeEvent:', e.nativeEvent);
                    const progress = total >= loaded ? loaded / total : 1;
                    this.setState({transactionImageProgress: progress});
                    console.warn('!!!!!!!!!!!!!!!!!!!! onProgress p:', progress);

                }}
                onLoad={e => console.warn('!!!!!!!!!!!!!!!!!!!! onLoad Success e.nativeEvent', e.nativeEvent)}
                onLoadEnd={() => {
                    this.setState({transactionImageIndeterminate: false});
                    console.warn('!!!!!!!!!!!!!!!!!! onLoadEnd Image Finally');
                }}

            />*/
        );
    }
}
