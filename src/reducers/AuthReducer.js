import AuthActionTypes from "../actionTypes/AuthActionTypes";

const initialState = {
  currentUser: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case AuthActionTypes.SET_USER_AUTH: {
      let currentUser = action.user;
      return Object.assign({}, state, { currentUser: currentUser });
    }
    default: {
      return state;
    }
  }
};

export default AuthReducer;
