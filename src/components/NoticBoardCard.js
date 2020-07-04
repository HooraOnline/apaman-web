import React, {PureComponent} from 'react';
import {Platform, Text, View} from '../react-native';
import IOSSwipeCard from './IOSSwipeCard';
import {ShowDateTime} from './index';
import {border} from '../constants/colors';

const jMoment = require('moment-jalaali');

export default class NoticboardCard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    render() {
        const {Title, Description, CreatedAtDatetime} = this.props.item;
        const {permission, idSwipeOpened, index} = this.props;
        return (
            <IOSSwipeCard
                noPadding
                index={index}
                permission={permission}
                onDelete={() => this.props.onSwipeRemove(this.props.item)}
                onEdit={() => this.props.navigateToEdit(this.props.item)}
                onClose={() => {}}
                onOpen={id => this.props.onOpenSwipe(id)}
                idSwipeOpened={idSwipeOpened}
            >
                <View style={{flexDirection: 'column', padding: 24, paddingVertical: 15}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{
                            alignSelf: 'flex-start', fontSize: 16, color: '#5D4A4A', fontFamily:
                                Platform.OS === 'ios'
                                    ? 'IRANYekanFaNum-Bold'
                                    : 'IRANYekanBold(FaNum)',
                        }}>{Title}</Text>
                        <ShowDateTime
                            time={CreatedAtDatetime}
                            showTime
                            fontSize={10}
                            color={border}
                            dotSize={2}
                        />
                    </View>
                    <Text style={{marginTop: 10, color: '#5D4A4A', alignSelf: 'flex-start'}}>{Description}</Text>
                </View>

            </IOSSwipeCard>
        );
    }
}
