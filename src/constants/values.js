// import {SERVER_ADDRESS} from '../../server_config';

export const uploadUrl = '/upload';

export const facilityStatusTypes = [
    {value: 'GENERAL', id: 0, label: 'عمومی'},
    {value: 'SPECIAL', id: 1, label: 'خصوصی'},
    {value: 'OFF', id: 2, label: 'تعطیلات'},
];
export const dayOfWeek = [
    {value: 'SAT', id: 1, label: 'شنبه', english: 'Saturday'},
    {value: 'SUN', id: 2, label: 'یکشنبه', english: 'Sunday'},
    {value: 'MON', id: 3, label: 'دوشنبه', english: 'Monday'},
    {value: 'TUE', id: 4, label: 'سه‌شنبه', english: 'Tuesday'},
    {value: 'WED', id: 5, label: 'چهارشنبه', english: 'Wednesday'},
    {value: 'THU', id: 6, label: 'پنج‌شنبه', english: 'Thursday'},
    {value: 'FRI', id: 7, label: 'جمعه', english: 'Friday'},
];

export const monthOfYear = [
    {label: 'فروردین', ID: 1, value: 'FARVARDIN'},
    {label: 'اردیبهشت', ID: 2, value: 'ORDIBEHESHT'},
    {label: 'خرداد', ID: 3, value: 'KHORDAD'},
    {label: 'تیر', ID: 4, value: 'TIR'},
    {label: 'مرداد', ID: 5, value: 'MORDAD'},
    {label: 'شهریور', ID: 6, value: 'SHAHRIVAR'},
    {label: 'مهر', ID: 7, value: 'MEHR'},
    {label: 'آبان', ID: 8, value: 'ABAN'},
    {label: 'آذر', ID: 9, value: 'AZAR'},
    {label: 'دی', ID: 10, value: 'DEY'},
    {label: 'بهمن', ID: 11, value: 'BAHMAN'},
    {label: 'اسفند', ID: 12, value: 'ESFAND'},
];

export const genderTypes = [
    {value: 'MALE', label: 'آقایان', id: 0},
    {value: 'FEMALE', label: 'بانوان', id: 1},
    {value: 'BOTH', label: 'آقایان و بانوان', id: 2},
];

export const ownerDataTypes = [
    {Name: 'ساکن', ID: 0},
    {Name: 'مالک', ID: 1},
    {Name: 'مالک و ساکن', ID: 2},
];
export const divisionByUnitDataTypes = [
    {Name: 'همه واحدها', ID: 1},
    {Name: 'چند واحد خاص', ID: 2},
    {Name: 'واحدهای پر', ID: 3},
    {Name: 'واحدهای خالی', ID: 4},
];
export const divisionParameterDataTypes = [
    {Name: 'تعداد واحد', ID: 1},
    {Name: 'تعداد افراد', ID: 2},
    {Name: 'تعداد پارکینگ', ID: 3},
    {Name: 'متراژ', ID: 4},
];

export const permissionId = {
    contacUs: 1,
    noticBoard: 2,
    rules: 3,
    survey: 4,
    suggestion: 5,
    callLobby: 6,
    costSetting: 7,
    enumCostType: 8,
    costCalculation: 9,
    period: 10,
    fiscalYear: 11,
    announcement: 12,
    defaultCharge: 13,
    pay: 14,
    defineBuilding: 15,
    defineUnit: 16,
    defineUser: 17,
    defineUserUnit: 18,
    defineFirstUserBalance: 19,
    manualPay: 20,
    buildingAccounts: 21,
    facility: 22,
    car:28,
    allCar:29,

};

export const roleId = {
    manager: 1,
    landLord: 2,
    resident: 3,
    tenant: 4,
    lobby: 5,
};
