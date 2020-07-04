import {action, observable} from 'mobx';

class Building {
    @observable userRole = null;
    @observable userID = null;
    @observable apartmentID = null;
    @observable apartmentName = null;
    @observable userName = null;
    @observable userImage = null;
    @observable postalCode = null;
    @observable numberOfFloors = null;
    @observable numberOfUnits = null;
    @observable lobbyContact = [];
    @observable LobbyPhoto = null;
    @observable apartmentImage = null;
    @observable units = [];
    @observable phoneBook = [];
    @observable facility = [];
    @observable contactUs = [];
    @observable notification = [];
    @observable costs = [];
    @observable facilityTypes = [];
    @observable userStatus = null;
    @observable userUnitNumber = null;
    @observable allApartments = [];
    @observable members = [];
    @observable postMembers = [];
    @observable costSettings = [];


    @action
    setLobby(item) {
        this.lobbyContact = item;
        this.setLobbyPhoto(item[0].lobbyPhoto);
    }

    @action
    clearLobby() {
        this.lobbyContact = [];
        this.LobbyPhoto = 'defaultLobby.png';
    }

    @action
    setLobbyPhoto(photoName) {
        this.LobbyPhoto = !photoName ? 'defaultLobby.png' : photoName;
    }

    @action
    prepareUnits() {
        let units = [];
        this.units.map(o => {
            units.push({id: o.ID, persianName: o.Name});
        });
        return units;
    }

    @action
    clearStore() {
        this.userRole = null;
        this.userID = null;
        this.apartmentID = null;
        this.apartmentName = null;
        this.userName = null;
        this.postalCode = null;
        this.numberOfFloors = null;
        this.numberOfUnits = null;

        this.lobbyContact = null;
        this.LobbyPhoto = 'defaultLobby.png';

        this.apartmentImage = null;
        this.units = [];
        this.phoneBook = [];
        this.facility = [];
        this.contactUs = [];
        this.notification = [];
        this.costs = [];

        this.members = [];
        this.postMembers = [];

        this.costSettings = [];
    }
}

const building = new Building();

export default building;
export {Building};
