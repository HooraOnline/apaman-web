import {fetchFactory, getFileDownloadURL, logger} from '../utils';
import {accountsStore, globalState, persistStore, userStore} from '../stores';
import fetch from "isomorphic-unfetch";





//***************End support redux**************************

export async function loginQuery(username, password) {
    try {
        await fetchFactory('/user/login', {
            method: 'POST',
            body: {
                username: username,
                password: password,
                DeviceID: 'user ip',
                HasAuthenticated: persistStore.token ? 1 : 0,
            },
        }).then(response => {

            console.info('***** loginQuery response: ', response);
            accountsStore.accounts = response.data;
            persistStore.token = response.token;
            persistStore.username = username;
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function setPushTokenQuery(pushToken) {
    try {
        await fetchFactory('/user/pushToken', {
            method: 'POST',
            body: {
                PushID: pushToken,
            },
        }).then(response => {

        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function roleQuery() {
    try {
        persistStore.roles = await fetchFactory('/user/role', {
            method: 'GET',
        });
    } catch (e) {
        console.warn('************ roleQuery E:', e);
        throw e;
    }
}



export async function searchUserQuery(mobile, name, unitNumber) {
    try {
        return await fetchFactory(
            `/user/search/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${mobile}.${name}.${unitNumber}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function setLobbyPhotoQuery(lobbyPhotoName) {
    try {
        await fetchFactory(`/apartment/lobby/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: {
                LobbyPhoto: lobbyPhotoName
            },
        });
        return true;
    } catch (e) {
        throw e;
    }
}

export async function getLobbyQuery() {
    try {
        return await fetchFactory(
            `/apartment/lobby/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addUnitQuery(units) {
    let isMyUnit = false;
    try {
        await fetchFactory(
            `/unit/add/${isMyUnit}/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: {UnitData: units},
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addMyUnitQuery(units, features) {
    let isMyUnit = true;
    try {
        await fetchFactory(
            `/unit/add/${isMyUnit}/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: {UnitData: units, FeatureData: features},
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function deleteUnitQuery(id) {
    let isMyUnit = false;
    try {
        await fetchFactory(
            `/unit/add/${isMyUnit}/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: {UnitData: {ID: id, IsDisabled: 1}},
            },
        );
    } catch (e) {
        throw e;
    }
}
//saeed
export async function addNoticeBoardQuery(notice) {
    try {
        await fetchFactory(`/noticeBoard/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: notice,
        });
    } catch (e) {
        throw e;
    }
}

export async function getNoticeBoardQuery() {
    try {
        return await fetchFactory(
            `/noticeBoard/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getAllUnits() {
    try {
        return await fetchFactory(
            `/unit/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );

    } catch (e) {
        throw e;
    }
}

export async function getMyUnitFeatures() {
    try {
        return await fetchFactory(
            `/unit/features`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getMyUnitFeatureDetails(featureId) {
    try {
        return await fetchFactory(
            `/unit/featureDetails/${featureId}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getUnitsById(unitId, isMyUnit) {
    try {
        return await fetchFactory(
            `/unit/info/${isMyUnit}.${unitId}.${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getContactUsQuery() {
    try {
        return await fetchFactory(
            `/contactUs/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addContactUsQuery(contact) {
    try {
        await fetchFactory(`/contactUs/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: contact,
        });
        return true;
    } catch (e) {
        throw e;
    }
}

export async function deleteContactUsQuery(contactID) {
    try {
        await fetchFactory(
            `/contactUs/${contactID}.${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'DELETE',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getPostMemberQuery() {
    try {
        // building.postMembers = [];
        return await fetchFactory('/contactUs/title/', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getMembersOfBuildingQuery() {
    try {
        return await fetchFactory(
            `/apartment/members/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getSuggestionQuery() {
    try {
        return await fetchFactory(
            `/suggestion/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addSuggestionQuery(suggestion) {
    try {
        await fetchFactory(`/suggestion/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: suggestion,
        });
    } catch (e) {
        throw e;
    }
}

export async function getDocumentTypes() {
    try {
        return await fetchFactory('/apartment/documentTypes', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function addRuleQuery(rule) {
    try {
        await fetchFactory(`/rule/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: rule,
        });
    } catch (e) {
        throw e;
    }
}

export async function getRuleQuery() {
    try {
        return await fetchFactory(
            `/rule/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCostQuery() {
    try {
        return await fetchFactory(
            `/cost/list/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addCostQuery(cost) {
    try {
        await fetchFactory(`/cost/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: cost,
        });
    } catch (e) {
        throw e;
    }
}

export async function getCostEditQuery(calculationHeaderId) {
    try {
        return await fetchFactory(`/cost/edit/${calculationHeaderId}.${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCostClassQuery() {
    try {
        return await fetchFactory('/cost/class', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}


export async function getCostOccupationQuery() {
    try {
        return await fetchFactory('/cost/occupation', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getCostCalculateQuery() {
    try {
        return await fetchFactory('/cost/calculate', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getCostSettingQuery() {
    try {
        return await fetchFactory(`/setting/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'GET',
        });

    } catch (e) {
        throw e;
    }
}

export async function getCostSettingDetailQuery(id) {
    try {
        return await fetchFactory(
            `/setting/calc/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${id}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}


export async function submitAddCost(newCost) {
    try {
        newCost.RoleID =userStore.RoleID;
        return await fetchFactory(`/cost/add/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: newCost,
        });
    } catch (e) {
        throw e;
    }
}
export async function removeCostQuery(costId) {

    let item={ID:costId,CallerRoleID:userStore.RoleID,CallerBuildingID:userStore.BuildingID}
    try {
        return await fetchFactory(`/cost/delete/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: item,
        });
    } catch (e) {
        throw e;
    }
}

export async function setCostSettingQuery(settings) {
    try {
        await fetchFactory(`/setting/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'PUT',
            body: settings,
        });
    } catch (e) {
        throw e;
    }
}

export async function setCostSettingCalcQuery(calculate) {
    try {
        await fetchFactory(`/setting/calc/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'PUT',
            body: calculate,
        });
    } catch (e) {
        throw e;
    }
}
export async function getUserBalance(unitId,userId) {
    try {
        return await fetchFactory(
            `/user/userBalance/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getCurrentUserBalance() {
    try {
        return await fetchFactory(
            `/user/balance/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getUnitBalance() {
    try {
        return await fetchFactory(
            `/acc/balance/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getTransaction(body) {
    try {
        return await fetchFactory(
            `/acc/transaction/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getPaymentType() {
    try {
        return await fetchFactory('/acc/payType', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getBankListQuery() {
    try {
        return await fetchFactory('/acc/bank', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getBuildingAccountQuery() {

    try {
        return await fetchFactory(
            `/acc/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function cudBuildingAccountQuery(account) {
    account.CallerRoleID=userStore.RoleID;
    try {
        await fetchFactory(`/acc/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: account,
        });
    } catch (e) {
        throw e;
    }
}

export async function getFacilityTypeQuery() {
    try {
        return await fetchFactory('/facility/type', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getFacilityWeekDayQuery() {
    try {
        return await fetchFactory('/facility/weekDay', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getFacilityStatusQuery() {
    try {
        return await fetchFactory('/facility/statusList', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getFacilityScheduleStatusQuery() {
    try {
        return await fetchFactory('/facility/scheduleStatus', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}
export async function getWeekDayQuery() {
    try {
        return await fetchFactory(
            `/facility/weekDay`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getFacilityScheduleWithIdDayQuery(FacilityID, DayOfWeek) {
    try {
        return await fetchFactory(
            `/facility/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${FacilityID}.${DayOfWeek}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function cudBuildingFacilityQuery(facility) {
    try {
        await fetchFactory(`/facility/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: facility,
        });
    } catch (e) {
        throw e;
    }
}

export async function cudFacilityScheduleQuery(schedule) {
    try {
        await fetchFactory(`/facility/schedule/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: schedule,
        });
    } catch (e) {
        throw e;
    }
}

export async function getBuildingFacilityQuery(isDisabled = null) {
    try {
        return await fetchFactory(
            `/facility/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${isDisabled}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function checkUserCanReserveQuery(schadual) {

    try {
        await fetchFactory(`/facility/checkUserCanReserve/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: schadual,
        });
    } catch (e) {
        throw e;
    }
}


export async function filterFacilityQuery(params) {
    try {
        return await fetchFactory(`/facility/filter/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: params,
        });
    } catch (e) {
        throw e;
    }
}
export async function cancelReserveQuery(reserve) {
    try {
        return await fetchFactory(`/facility/cancelReserve/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: reserve,
        });
    } catch (e) {
        throw e;
    }
}
export async function reserveWithoutPaymentQuery(reserve) {
    try {
        return await fetchFactory(`/facility/reserveWithoutPaymeny/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: reserve,
        });
    } catch (e) {
        throw e;
    }
}
export async function reserveByManuallyPaymentQuery(reserve) {
    reserve.PurchaseTypeID=2;

    try {
        await fetchFactory(`/facility/reserveByManuallyPayment/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: reserve,
        });
    } catch (e) {
        throw e;
    }
}

export async function getScadualReservesQuery(buildingFacilityScheduleID,reserveDate) {
    try {
        return await fetchFactory(
            `/facility/getReserved/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${buildingFacilityScheduleID}.${reserveDate}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getUserReservesQuery(userID) {
    try {
        return await fetchFactory(
            `/facility/getUserReserved/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${userID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}


export async function getForPaymentQuery(formId, payUserId = null, payUnitId = null) {
    try {
        return await fetchFactory(
            `/pay/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${payUserId}.${payUnitId}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function getForPaymentDetailQuery(formId, announceId) {
    try {
        return await fetchFactory(
            `/pay/detail/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${announceId}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function setPaymentQuery(paymentInfo) {
    paymentInfo.appKey=version.appKey;
    try {
        return await fetchFactory(`/pay/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}

export async function setTestPaymentQuery(paymentInfo) {
    try {
        return await fetchFactory(`/pay/test/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}

export async function setConfirmPaymentQuery(paymentInfo) {
    try {
        return await fetchFactory(`/pay/confirm/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}

export async function getDetailPaymentQuery(announceDetailID,viewUserID,viewUnitID) {
    try {
        return await fetchFactory(
            `/pay/paymentDetail/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${announceDetailID}.${viewUserID}.${viewUnitID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function getDetailCalculatePaymentQuery(periodDetailID,costClassID,viewUserID,viewUnitID) {
    try {
        return await fetchFactory(
            `/pay/calculationPaymentDetail/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${periodDetailID}.${costClassID}.${viewUserID}.${viewUnitID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function updatePaymentQuery(paymentInfo) {

    try {
        return await fetchFactory(`/pay/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'PUT',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}
export async function deletePaymentQuery(paymentInfo) {
    try {
        return await fetchFactory(`/pay/delete/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}
export async function setPaymentManuallyQuery(paymentInfo) {
    try {
        await fetchFactory(`/pay/manually/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}
export async function updatePaymentManuallyQuery(paymentInfo) {
    console.log(paymentInfo);
    try {
        await fetchFactory(`/pay/manuallyUpdate/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}


export async function getYearQuery() {
    try {
        return await fetchFactory(
            `/setting/year/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function setFiscalYearQuery(year) {
    try {
        await fetchFactory(`/setting/fiscalYear/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'PUT',
            body: year,
        });
    } catch (e) {
        throw e;
    }
}

export async function getPeriodQuery(year, period = null) {
    try {
        return await fetchFactory(
            `/setting/period/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${year}.${period}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function setPeriodQuery(body) {
    try {
        await fetchFactory(`/setting/period/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: body,
        });
    } catch (e) {
        throw e;
    }
}

export async function setDefaultCharge(body) {
    try {
        return await fetchFactory(`/setting/defaultCharge/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: body,
        });
    } catch (e) {
        throw e;
    }
}

export async function getProcessCalc(dataCalc) {
    dataCalc.RoleID =userStore.RoleID;
    try {
        return await fetchFactory(`/cost/addResult/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: dataCalc,
        });
    } catch (e) {
        console.warn('!!!!!!!!!!! getProcessCalc e: ', e);
        throw e;
    }
}

export async function getSurveyQuery() {
    try {
        return await fetchFactory(
            `/survey/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getBuildingSurveyOpinionQuery(buildingSurveyID) {
    try {
        return await fetchFactory(
            `/survey/getBuildingSurveyOpinion/${buildingSurveyID}.${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function submitSurveyResultQuery(result) {
    try {
        await fetchFactory(`/survey/opinion/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: result,
        });
    } catch (e) {
        throw e;
    }
}

export async function submitSurveyQuery(survey) {
    try {
        await fetchFactory(`/survey/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: survey,
        });
    } catch (e) {
        throw e;
    }
}

export async function changeUserPhotoQuery(body) {
    try {
        await fetchFactory(
            `/user/changePhoto/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}


export async function changeUserPassword(body) {
    try {
        await fetchFactory(
            `/user/changePassword/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }

}

export async function changeUserProfile(body) {
    try {
        await fetchFactory(
            `/user/changeProfile/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getAnnouncements() {
    try {
        return await fetchFactory(
            `/announce/select/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function getFirstUserBalance() {
    try {
        return await fetchFactory(
            `/user/firstUserBalance/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getFirstUserBalanceNew(pageSize=10,pageIndex=0) {
    try {
        return await fetchFactory(
            `/user/firstUserBalanceNew/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function setFirstUserBalance(body) {
    try {

        await fetchFactory(
            `/user/firstUserBalance/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getAnnouncementWithId(id) {
    try {
        return await fetchFactory(
            `/announce/${id}/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getForAnnouncementsDefaultCharge(periodDetailId) {
    try {
        return await fetchFactory(
            `/announce/forAnnouncement/defaultCharge/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${periodDetailId}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function getForAnnouncementsCalculationHeader(costClassId, periodDetailId = null, calculationHeaderId = null) {
    try {
        const arrayId = calculationHeaderId ? '[' + calculationHeaderId + ']' : calculationHeaderId;
        return await fetchFactory(
            `/announce/forAnnouncement/calculationHeader/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${costClassId}.${periodDetailId}.${arrayId}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function addAnnouncements(announcements) {
    try {
        await fetchFactory(
            `/announce/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: announcements,
            },
        );
    } catch (e) {
        throw e;
    }
}


export async function deleteAnnouncementQuery( announcement) {
    try {
        await fetchFactory(
            `/announce/delete/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: announcement,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getAllNotification() {
    try {
        return await fetchFactory('/notification/getAll', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function searchUserByMobile(mobileNumber) {
    try {
        return await fetchFactory(
            `/user/searchByMobile/${mobileNumber}.${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function createUser(body) {
    try {
        await fetchFactory(
            `/user/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function setResidentForUnit(body) {
    try {
        await fetchFactory(
            `/unit/resident/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: {Data: body, RoleID: userStore.RoleID},
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getResidentForUnit(unitId) {
    try {
        return await fetchFactory(
            `/unit/resident/${unitId}.${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}


export async function cudUnitPhotoQuery(pictures) {
    try {
        return await fetchFactory(`/unit/photo/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: pictures,
        });
    } catch (e) {
        throw e;
    }
}


export async function addCarQuery(car) {
    try {
        await fetchFactory(`/car/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: car,
        });
    } catch (e) {
        throw e;
    }
}


export async function getUnitCarQuery(UnitID,allCar=null) {
    try {
        return await fetchFactory(
            `/car/${allCar}.${UnitID}.${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCarColorQuery() {
    try {
        return await fetchFactory(
            `/car/colorList`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCarTagCharacterQuery() {
    try {
        return await fetchFactory(
            `/car/tagCharacterList`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCarBrandQuery() {
    try {
        return await fetchFactory(
            `/car/brandList`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCarModelQuery(BrandID) {
    try {
        return await fetchFactory(
            `/car/modelList/${BrandID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getSupplierkListQuery() {
    try {
        return await fetchFactory(`/apartment/suppliers/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getRentQuery(CostTypeID) {
    try {
        return await fetchFactory(
            `/rent/${CostTypeID}.${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function defineRentQuery(rent) {
    try {
        await fetchFactory(`/rent/defineRent/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: rent,
        });
    } catch (e) {
        throw e;
    }
}
export async function doRentingQuery(rent) {
    try {
        await fetchFactory(`/rent/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: rent,
        });
    } catch (e) {
        throw e;
    }
}
export async function setEmptyQuery(rent) {;
    try {
        await fetchFactory(`/rent/setEmpty/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'POST',
            body: rent,
        });
    } catch (e) {
        throw e;
    }
}

export async function getPaymentMethodsQuery() {
    try {
        return await fetchFactory(
            `/rent/paymentMethodList`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCostTypeListQuery(costClassID) {
    try {
        return await fetchFactory(
            `/pay/costTypeList/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${costClassID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getBiuldingOrUserBankAccount(userId) {
    try {
        return await fetchFactory(
            `/user/biuldingOrUserBankAccount/${persistStore.curentFormId}.${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${userId}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getImageBase64Query(fileName) {
    const headersSetting={
        'Access-Control-Allow-Origin': '*',
        'Accept'        : 'application/json',
        'Content-Type'  : 'application/json',
        'Authorization' : 'Bearer ' + persistStore.token,
    }

    let requestURL=getFileDownloadURL(fileName)
    try {
        const response = await fetch(requestURL, {
            headers: headersSetting,
            method: 'GET'
        });

        const message = unicodeToChar(response.headers.get('errMessage'));

        logger('%%%%%%%%%%%%%%%% fetchFactory response.url : ', response.url);
        logger('%%%%%%%%%%%%%%%% fetchFactory response.message : ', message);

        if (response.status === 200) {
            if (parseInt(response.headers.get('errCode')) === 1000) {
                globalState.toastType = 'success';
                globalState.setResponseCode(1000);
                globalState.setResponseMessage('');
            } else {
                globalState.toastType = 'success';
                globalState.setResponseCode(parseInt(response.headers.get('errCode')));
                globalState.setResponseMessage(message);
            }

            let imageStr
            await response.arrayBuffer().then((buffer) => {
                imageStr = arrayBufferToBase64(buffer);
            });
            return await 'data:image/jpeg;base64,'+imageStr;
        } else if (response.status === 507) {
            alert(message, Toast.LONG);
        } else if (response.ok && response.status !== 200) {
            logger('%%%%%%%%%%%%%%%% fetchFactory errMessage: ', message);
            if (message !== 'لیست خالی') {
                const errCode = parseInt(response.headers.get('errCode'));
                globalState.setResponseCode(errCode);
                globalState.setResponseMessage(message);
                globalState.toastType = errCode === -1 ? 'error' : 'warning';
            }

            // noinspection ExceptionCaughtLocallyJS
            throw {errCode: parseInt(response.headers.get('errCode')), errMessage: message};
        } else {
            logger('%%%%%%%%%%%%%%%% fetchFactory throw new Error() url:', response.url);
            const errMessage = '!!! Error ' + response.status + ' !!!';
            globalState.setResponseCode(response.status);
            globalState.setResponseMessage(errMessage);
            globalState.toastType = 'error';
            globalState.showToastCard();
            throw {errCode: 0, errMessage: errMessage};
        }

    } catch (e) {
        throw e;
    }
}


//**************





export async function defineBuildingQuery(BuildingInformation) {
    try {
        return await fetchFactory(
            '/building/defineBuilding',
            {
                method: 'POST',
                body:BuildingInformation
            },
        );
    } catch (e) {
        throw e;
    }
}



export async function getEnumBuildingType() {
    try {
        return await fetchFactory(
            `/building/buildingTypeSelect`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getEnumCurrency() {
    try {
        return await fetchFactory(
            `/building/enumCurrency`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getEnumCity(ProvinceID) {
    try {
        return await fetchFactory(
            `/building/enumCity/${ProvinceID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getEnumProvince() {
    try {
        return await fetchFactory(
            `/building/enumProvince`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getEnumSubRegion(CityID) {
    try {
        return await fetchFactory(
            `/building/enumSubRegion/${CityID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getSelectBuilding(CallerUserID,CallerFormID,CallerRoleID) {
    try {
        return await fetchFactory(
            `/building/buildingSelect/${CallerUserID}.${CallerRoleID}.${CallerFormID}`,
            {
                method:'GET',
            }
        )
    }catch (e) {
        throw e;
    }
}
export async function getContactType() {
    try {
        return await fetchFactory(
            `/building/contactType`,
            {
                method:'GET',
            }
        )
    }catch (e) {
        throw e;
    }
}

export async function getBuildingWithID() {

}
