import UserDataActionTypes from "../actionTypes/UserDataActionTypes";

export const setUserData = (userData) => (dispatch) => {
  dispatch({
    type: UserDataActionTypes.SET_USER_DATA,
    userData,
  });
};

export const setUserID = (userID) => (dispatch) => {
  dispatch({
    type: UserDataActionTypes.SET_USER_ID,
    userID,
  });
};

export const setUserArtistIDs = (artistIDs) => (dispatch) => {
  dispatch({
    type: UserDataActionTypes.SET_USER_ARTIST_IDS,
    artistIDs,
  });
};

export const setUserArtistData = (artistData) => (dispatch) => {
  dispatch({
    type: UserDataActionTypes.SET_USER_ARTIST_DATA,
    artistData,
  });
};

export const setArtistProjectIDs = (projectIDs) => (dispatch) => {
  dispatch({
    type: UserDataActionTypes.SET_ARTIST_PROJECT_IDS,
    projectIDs,
  });
};

export const setArtistProjectData = (projectData) => (dispatch) => {
  dispatch({
    type: UserDataActionTypes.SET_ARTIST_PROJECT_DATA,
    projectData,
  });
};

export const setProjectSongIDs = (songIDs) => (dispatch) => {
  dispatch({
    type: UserDataActionTypes.SET_PROJECT_SONG_IDS,
    songIDs,
  });
};

export const setProjectSongData = (songData) => (dispatch) => {
  dispatch({
    type: UserDataActionTypes.SET_PROJECT_SONG_DATA,
    songData,
  });
};

export const setCurrentArtistIndex = (index) => (dispatch) => {
  dispatch({
    type: UserDataActionTypes.SET_CURRENT_ARTIST_INDEX,
    index,
  });
};

export const setCurrentProjectIndex = (index) => (dispatch) => {
  dispatch({
    type: UserDataActionTypes.SET_CURRENT_PROJECT_INDEX,
    index,
  });
};

