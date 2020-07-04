import {Component} from 'react';
import {BackHandler, Platform} from '../react-native';
import withSideEffect from 'react-side-effect';

let listener = null;

let backButtonPressFunction = () => false;

class AndroidBackButton extends Component {
    componentDidMount() {
        if (listener == null) {
            listener = window.addEventListener('popstate', () => {
                return backButtonPressFunction();
            });
        }
    }

    render() {
        return null;
    }
}

function reducePropsToState(propsList) {
    let defaultValue = () => false;
    let lastComponent = propsList[propsList.length - 1];
    if (lastComponent) {
        return lastComponent.onPress;
    }
    return defaultValue;
}

function mapStateOnServer(callback) {
    backButtonPressFunction = callback;
}

export default withSideEffect(reducePropsToState, () => {
}, mapStateOnServer)(
    AndroidBackButton,
);
