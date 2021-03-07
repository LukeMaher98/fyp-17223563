import AuthActionTypes from '../actionTypes/AuthActionTypes';

export const setUserAuth = (user) => (dispatch) => {
  dispatch({
    type: AuthActionTypes.SET_USER_AUTH,
    user
  });
};