import {action, observable} from 'mobx';

class UserStore {
    @observable userID = null;
    @observable NameOfUser = null;
    @observable Mobile = null;
    @observable Sex = null;
    @observable NationalCode = null;
    @observable BirthDate = null;
    @observable HasChangedPassword = null;
    @observable UserImage = null;
    @observable PushID = null;
    @observable BuildingID = null;
    @observable BuildingName = null;
    @observable BuildingTypeID = null;
    @observable BuildingTypeName = null;
    @observable NumberOfFloors = null;
    @observable NumberOfUnits = null;
    @observable BuildingImage = null;
    @observable UnitID = null;
    @observable UnitNumber = '';
    @observable UnitDocumentTypeID = null;
    @observable UnitDocumentTypeName = null;
    @observable FloorNumber = null;
    @observable IsEmpty = null;
    @observable Area = null;
    @observable Address = null;
    @observable PostalCode = null;
    @observable ParkingCount = null;
    @observable ParkingData = null;
    @observable TelCount = null;
    @observable TelData = null;
    @observable StorageCount = null;
    @observable StorageData = null;
    @observable RoleID = null;
    @observable RoleName = null;
    @observable UseTypeID = null;
    @observable UseTypeName = null;
    @observable NumberOfPeople = null;
    @observable StartDate = null;
    @observable EndDate = null;
    @observable Form = [];
    @observable BuildingIds = [];
    @observable CurrencyID = null;
    @observable UnitBalance = null;
    @observable CityCode = null;

    @action
    setUser(user) {
        this.userID = user.UserID;
        this.NameOfUser = user.NameOfUser;
        this.Mobile = user.Mobile;
        this.Sex = user.Sex;
        this.NationalCode = user.NationalCode;
        this.BirthDate = user.BirthDate;
        this.HasChangedPassword = user.HasChangedPassword;
        this.UserImage = user.UserImage ? user.UserImage[0] : null;
        this.PushID = user.PushID;
        this.BuildingID = user.BuildingID;
        this.BuildingName = user.BuildingName;
        this.BuildingTypeID = user.BuildingTypeID;
        this.BuildingTypeName = user.BuildingTypeName;
        this.NumberOfFloors = user.NumberOfFloors;
        this.NumberOfUnits = user.NumberOfUnits;
        this.BuildingImage = user.BuildingImage;
        this.UnitID = user.UnitID;
        this.UnitNumber = user.UnitNumber ? ' ' + user.UnitNumber : '';
        this.UnitDocumentTypeID = user.UnitDocumentTypeID;
        this.UnitDocumentTypeName = user.UnitDocumentTypeName;
        this.FloorNumber = user.FloorNumber;
        this.IsEmpty = user.IsEmpty;
        this.Area = user.Area;
        this.PostalCode = user.PostalCode;
        this.Address = user.Address;
        this.ParkingCount = user.ParkingCount;
        this.ParkingData = user.ParkingData;
        this.TelCount = user.TelCount;
        this.TelData = user.TelData;
        this.StorageCount = user.StorageCount;
        this.StorageData = user.StorageData;
        this.RoleID = parseInt(user.RoleID, 10);
        this.RoleName = user.RoleName;
        this.UseTypeID = user.UseTypeID;
        this.UseTypeName = user.UseTypeName;
        this.NumberOfPeople = user.NumberOfPeople;
        this.StartDate = user.StartDate;
        this.EndDate = user.EndDate;
        this.Form = JSON.parse(user.Form);
        this.BuildingIds = JSON.parse(user.BuildingIds);
        this.CurrencyID = user.CurrencyID;
        this.CityCode = user.CityCode;
        // this.UnitBalance          = user.UnitBalance;
        // return new Promise((resolve, reject) => {
        //   setTimeout(function() {
        //     resolve(true);
        //     reject('Error');
        //   }, 10);
        // })
    }

    @action
    findPermission(itemId) {
        let permission=this.Form.find(o => o.formID === itemId);
        return permission;
    }

    @action
    setUnitBalance(unitBalance) {
        this.UnitBalance = unitBalance ? parseFloat(unitBalance) : null;
    }

    clear() {
        this.userID = null;
        this.NameOfUser = null;
        this.Mobile = null;
        this.Sex = null;
        this.NationalCode = null;
        this.BirthDate = null;
        this.HasChangedPassword = null;
        this.UserImage = null;
        this.PushID = null;
        this.BuildingID = null;
        this.BuildingName = null;
        this.BuildingTypeID = null;
        this.BuildingTypeName = null;
        this.NumberOfFloors = null;
        this.NumberOfUnits = null;
        this.BuildingImage = null;
        this.UnitID = null;
        this.UnitNumber = '';
        this.UnitDocumentTypeID = null;
        this.UnitDocumentTypeName = null;
        this.FloorNumber = null;
        this.IsEmpty = null;
        this.Area = null;
        this.ParkingCount = null;
        this.ParkingData = null;
        this.TelCount = null;
        this.TelData = [];
        this.StorageCount = null;
        this.StorageData = null;
        this.RoleID = null;
        this.RoleName = null;
        this.UseTypeID = null;
        this.UseTypeName = null;
        this.NumberOfPeople = null;
        this.StartDate = null;
        this.EndDate = null;
        this.Form = [];
        this.BuildingIds = [];
        this.CurrencyID = null;
        this.UnitBalance = null;
        this.CityCode = null;
    }
}

const userStore = new UserStore();

export default userStore;
export {UserStore};
