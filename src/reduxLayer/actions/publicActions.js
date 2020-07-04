import {loginQuery} from "../../network/Queries";


export function callApi(apiModelName, urlParams, storeKey, entity, filterParams) {
  return (dispatch, getState) => {
    return loginQuery(username,password)
      .then(data => {
        if (storeKey)
          doDispatch(storeKey, data);
        return data;
      })
      .catch((ex) => {
        throw ex;
      });
  }
}

// function isNestedObject(object) {
//   isNested = false;
//   var level = 1;
//   var key;
//   for (key in object) {
//     if (!object.hasOwnProperty(key)) continue;
//     if (typeof object[key] == 'object') {
//       isNested = true
//       break;
//     }
//   }
//   return level;
// }
export function doDispatch(storeKey, value,isNested ) {
  return (dispatch, getState) => {
    if (isNested) {
      let objCopy = Object.assign({}, value);
      //dispatch(setStateToStore(storeKey, {}));
      dispatch(setStateToStore(storeKey, objCopy));
      objCopy={};
    }
    else
      dispatch(setStateToStore(storeKey, value));
  }
}
export function setStateToStore(storeKey, value) {
  return {
    type: storeKey,
    [storeKey]: value,
  }
}
export function clearStore() {
  return (dispatch, getState) => {
    let state = getState();
    let stateList = Object.keys(state);
    stateList.forEach(function (s) {
      if (typeof (state[s]) == 'boolean')
        state[s] = false;
      else if (typeof (state[s]) == 'string')
        state[s] = "";
      else if (state[s].push)
        state[s] = [];
      else if (typeof (state[s]) == 'number')
        state[s] = 0;
      else if (typeof (state[s]) == 'object')
        state[s] = {};
    });
  }
}
