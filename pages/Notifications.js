import React, {PureComponent} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
   // RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from '../src/react-native';
import {observer} from 'mobx-react';
import {bgEmpty, bgScreen, subTextItem, textDisabled, textItem} from '../src/constants/colors';
import {getAllNotification} from '../src/network/Queries';
import {LoadingPopUp, Overlay, ShowDateTime} from '../src/components';
import {globalState} from '../src/stores';

import images from "public/static/assets/images";

class NotificationRow extends PureComponent {
    constructor() {
        super();
    }

    render() {
        const {
            Title,
            // Text,
            CreatedAtDatetime,
            Icon,
        } = this.props.item;
        return (
            <TouchableOpacity
                onPress={() => this.props.onPress(this.props.item)}
                style={notifRowStyle.container}>
                <View style={{
                    backgroundColor: bgEmpty,
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 20,
                    padding: 8,
                    marginEnd: 16,
                }}>
                    <Image
                        source={images[Icon]}
                        style={{
                            //tintColor: textItem,
                            height: 24,
                            width: 24
                        }}
                    />
                </View>
                <View style={{}}>
                    <Text style={notifRowStyle.title}>{Title}</Text>
                    <ShowDateTime
                        showTime
                        time={CreatedAtDatetime}
                        fontSize={10}
                        color={subTextItem}
                    />
                    {/*<Text>{jMoment(CreatedAtDatetime).fromNow(true)}</Text>*/}

                </View>
            </TouchableOpacity>
        );
    }
}

function NotificationDetail({item, onDismiss}) {
    return (
        <Overlay catchTouch={true} onPress={onDismiss}>
            <View
                style={{
                    backgroundColor: 'white',
                    minHeight: 77,
                    borderRadius: 20,
                    marginHorizontal: 24,
                }}>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{flex: 0.1, paddingStart: 16, paddingTop: 16}}
                        onPress={onDismiss}>
                        <Image
                            source={images.ic_close}
                            style={{tintColor: subTextItem, width: 24, height: 24}}
                        />
                    </TouchableOpacity>

                    <View style={{flex: 1, marginTop: 16}}>
                        <Text style={[styles.title]}>{item.Title}</Text>
                    </View>
                    <View style={{flex: 0.1}}/>
                </View>

                <View style={{
                    paddingBottom: 8,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderColor: subTextItem,
                    marginHorizontal: 24,
                }}>
                    <ShowDateTime
                        showTime
                        time={item.CreatedAtDatetime}
                        fontSize={14}
                        color={subTextItem}
                    />
                </View>
                <Text style={{margin: 24}}>{item.Text}</Text>
            </View>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    btn: {
        paddingVertical: 6,
        paddingHorizontal: 20,
    },
    title: {
        fontFamily:
            Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        fontSize: 20,
        textAlign: 'center',
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 14,
        color: subTextItem,
    },
});


@observer
export default class Notifications extends PureComponent {

    constructor() {
        super();
        this.state = {
            refreshing: false,
            showDetail: false,
            nominatedDetail: null,
            items:[]
        };
    }

    componentDidMount() {
         this.getAllNotifications();
    }

   /* async getAllNotifications() {
        // this.showLoading();
        globalState.showBgLoading();
        getAllNotification()
            .then(result => this.props.refreshNotif(result))
            .catch(e => globalState.showToastCard())
            .finally(() => {
                globalState.hideBgLoading();
                this.setState({refreshing: false});
            });
    }*/
    async getAllNotifications() {
        // this.showLoading();
        globalState.showBgLoading();
        getAllNotification()
            .then(result => this.setState({items: result}))
            .catch(e => globalState.showToastCard())
            .finally(() => globalState.hideBgLoading());
    }

    render() {
        //const {items} = this.props;
        const {items} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: bgScreen}}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={items}
                    ListEmptyComponent={
                        <View
                            style={{
                                height: global.height - 90,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: items.length > 0 ? bgScreen : bgEmpty
                            }}>
                            <Image
                                source={images.es_megaphone}
                                style={{width:  global.width, height: ( global.width / 100) * 62}}
                            />
                            <Text
                                style={{
                                    fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekan-ExtraBold'
                                            : 'IRANYekanExtraBold',
                                    fontSize: 18,
                                    textAlign: 'center',
                                }}>
                                رخداد جدیدی وجود ندارد.
                            </Text>
                        </View>
                    }
                    renderItem={({item}) => (
                        <NotificationRow
                            item={item}
                            onPress={item => this.showNotifDetail(item)}
                        />
                    )}
                  /*  refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.getAllNotifications.bind(this)}
                        />
                    }*/
                />

                {this.state.showDetail && (
                    <NotificationDetail
                        item={this.state.nominatedDetail}
                        onDismiss={() => this.setState({showDetail: false})}
                    />
                )}

                <LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage}/>

            </View>
        );
    }

    showLoading(message = 'در حال دریافت اطلاعات...') {
        this.setState({loading: true, loadingMessage: message});

    }

    hideLoading() {
        this.setState({loading: false});
    }

    showNotifDetail(item) {
        this.setState({
            nominatedDetail: item,
            showDetail: true,
        });
    }
}


const notifRowStyle = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: textDisabled,
    },
    title: {
        color: textItem,
        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        fontSize: 14,
    },
    date: {
        marginTop: 4,
        fontSize: 10,
        alignSelf: 'flex-end',
        color: subTextItem,
    },
});
