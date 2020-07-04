import React, {PureComponent} from 'react';
import {Animated, Image, Platform, StyleSheet, Text, TouchableWithoutFeedback, View} from '../react-native';

import {borderSeparate, textDisabled, subTextItem} from '../constants/colors';


export default class NavigationBottomMain extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.firsSet = true;
        // this.backgroundMove = useState();
        this.state = {
            backgroundMove: new Animated.Value(0),
        };

    }

    componentDidMount() {
        const {value} = this.props;

        //this.animateSwitch(value, () => null);
    }

    componentDidUpdate() {
        //this.animateSwitch(this.props.activeIndex, () => null);
    }


    /*   animateSwitch = (activeIndex, cb = () => {}) => {
           Animated.parallel([
               Animated.timing(this.state.backgroundMove, {
                   toValue: activeIndex * this.props.itemWidth,
                   duration: 150,
                   friction: 3,
                   tension: 40,
               }),
           ]).start(cb);
       };*/

    animateSwitch = (activeIndex=0)=>{

        this.props.onActivate && this.props.onActivate(activeIndex);
        this.setState({backgroundMove: activeIndex * this.props.itemWidth})
    };

    render() {
        const {data, activeIndex, itemWidth, backgroundActive, backgroundInactive, activeTextStyle, inactiveTextStyle, onActivate} = this.props;

        // const moveBackground = backgroundMove.interpolate({
        //     inputRange: [0, data.length],
        //     outputRange: [0, data.length],
        // });



        return (

            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: '#D5D8DC ',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: this.props.height ? this.props.height : 24,
                    borderWidth: 1,
                    borderColor: borderSeparate,
                    borderRadius: 100,
                    position:'relative'
                }}
            >
                <Animated.View
                    style={
                        {
                            position: 'absolute',
                            backgroundColor: backgroundActive,
                            //height: '100%',
                            height:'100%',
                            width: itemWidth,
                            right: this.state.backgroundMove,
                            elevation: '50deg',
                            shadowColor: backgroundActive,
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.5,
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center'

                        }}>
                    {/* <Text style={{color:'#fff',alignSelf:'center'  }} >{data[activeIndex]}</Text>*/}
                </Animated.View>

                {data.map((item, index) => {
                    return (
                        <TouchableWithoutFeedback
                            style={{flex:1,padding:5}}
                            onPress={() => this.animateSwitch(index)}>
                            <View style={[styles.item]} key={index.toString()}>
                                <Image
                                    source={item.icon}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        tintColor: index === activeIndex ? subTextItem : 'white',
                                        marginTop: 7
                                    }}
                                />
                                {index === activeIndex &&(
                                    <Text
                                        style={[styles.text, {
                                            fontFamily: index === activeIndex ?'IRANYekanBold(FaNum)' :'IRANYekanFaNum',
                                            fontSize: index === activeIndex ? 12 : 10,
                                            color: index === activeIndex ? 'white' : textDisabled,
                                        }, index === activeIndex ? activeTextStyle : inactiveTextStyle]}>{item.title}</Text>
                                )}
                            </View>
                        </TouchableWithoutFeedback>


                    );
                })}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    item: {
        elevation: 7,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
