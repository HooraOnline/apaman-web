import {action, observable} from 'mobx';
import {persist} from 'mobx-persist';

class AccountsStore {
    @persist('list') @observable accounts = [];


    @action clearStore() {
        this.accounts = [];
    }

    @action updateBalance(newBalance) {
        this.accounts = this.accounts.map(function (item) {
            if (item.UnitID) {
                const target = newBalance.find(obj => obj.UnitID === item.UnitID);
                item.UnitBalance = target.UnitBalance;
                return item;
            } else {
                return item;
            }
        });
        // this.accounts = this.accounts.concat(newBalance);
    }

    @action updateUserImage(newUserImage) {
        this.accounts = this.accounts.map(function (item) {
            item.UserImage = newUserImage ? [newUserImage] : null;
            return item;

        });
        // this.accounts = this.accounts.concat(newBalance);
    }
}

const accountsStore = new AccountsStore();

export default accountsStore;
export {AccountsStore};
