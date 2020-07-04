import {action, observable} from 'mobx';
import {primaryDark} from '../constants/colors';

class GlobalState {
    @observable showListMultiSelect = false;
    @observable responseCode = null;
    @observable responseMessage = null;
    @observable bgLoading = false;
    @observable progress = 0;
    @observable toastCard = false;
    @observable toastType = 'success';
    @observable toastTitle = '';
    @observable statusBarColor = primaryDark;
    @observable width = 500;
    @observable height = 700;
    @observable showMenu = false;


    @action
    setResponseCode(code) {
        this.responseCode = code;
    }

    @action
    setResponseMessage(message) {
        this.responseMessage = message;
    }

    @action
    showBgLoading() {
        this.bgLoading = true;
    }

    @action
    hideBgLoading() {
        this.progress = 0;
        this.bgLoading = false;
    }

    @action
    showToastCard() {
        this.toastCard = true;
    }

    @action
    changeStatusBarColor(color) {
        this.statusBarColor = color;
    }

    @action
    defaultStatusBarColor() {
        this.statusBarColor = primaryDark;
    }



    @action
    hideToastCard() {
        this.toastCard = false;
        this.responseCode = '';
        this.responseMessage = '';
        this.toastType = 'success';
        this.toastTitle = '';
    }


}

const globalState = new GlobalState();

export default globalState;
export {GlobalState};
