import React from 'react';
import TouchableOpacity from "./TouchableOpacity";

export default function TouchableWithoutFeedback(props) {

    const {onPress}=props;

    const handleClickAway = (event) => {
        event.stopPropagation();
        onPress && onPress();
    };

    return (
        <TouchableOpacity {...props} onPress={handleClickAway}/>

    );
}
