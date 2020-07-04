
import {loginQuery} from "../../network/Queries";
export function login(username,password) {
  return (dispatch, getState) => {
    return  loginQuery (username,password)
      .then(user => {
          dispatch(setStateToStore('loginQuery', user));
        return user;
      })
      .catch((ex) => {
        throw ex;
      });

  }
}



