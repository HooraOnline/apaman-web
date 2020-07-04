import * as storeKeys from '../storeKeys'


function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

let reduser = {}

let keys = Object.keys(storeKeys);
for (let i = 0; i < keys.length; i++) {
  reduser[keys[i]] = createReducer(storeKeys[keys[i]], {
    [keys[i]](state, action) {
      let newState = action[keys[i]];
      return newState;
    }
  });
}

//public******************************************************************

export const token = reduser.token;
export const cUser = reduser.cUser;

