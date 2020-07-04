import React, {PureComponent} from 'react';
import {View} from '../react-native';

export default class LineCustom extends PureComponent {
    constructor() {
        super();
        this.state = {
            currentWidth: 0,
            currentHeight: 0,
        };
    }

    render() {
        const {
            isVertical = false,
            thickness = 1,
            length = 5,
            gapSize = length,
            color = 'black',
        } = this.props;
        /*var lines = [];
        var x = 0;

        for (
            let i = 0;
            i < (isVertical ? this.state.currentHeight : this.state.currentWidth);
            i += length
        ) {
            x++;
            if (isVertical) {
                lines.push(
                    <View
                        key={i.toString()}
                        style={{backgroundColor: color, height: length}}
                    />,
                );
                lines.push(<View key={(i + 1).toString()} style={{height: gapSize}}/>);
            } else {
                lines.push(
                    <View
                        key={i.toString()}
                        style={{backgroundColor: color, width: length}}
                    />,
                );
                lines.push(<View key={(i + 1).toString()} style={{width: gapSize}}/>);
            }
        }
*/
        return (
             <div style={{overflow:'hidden'}}>
                 {
                     !isVertical?
                         <div style={{border: `5px dashed ${color}`,width:'100%',marginTop:-9}}/>
                         :
                         <div style={{border: `5px dashed ${color} `,height:'100%',marginLeft:-9}}/>
                 }
             </div>



           /* <View
                key={'lineCustomRoot'}
                onLayout={event => {
                    let {x, y, width, height} = event.nativeEvent.layout;
                    this.setState({currentWidth: width, currentHeight: height});
                }}
                style={{
                    overflow: 'hidden',
                    height: isVertical ? '100%' : thickness,
                    width: isVertical ? thickness : '100%',
                    flexDirection: isVertical ? 'column' : 'row',
                }}>
                {lines}
            </View>*/
        );
    }
}
