import NavActionTypes from "../actionTypes/NavActionTypes";

export const setSidebarOpen = (open) => (dispatch) => {
  dispatch({
    type: NavActionTypes.SET_SIDEBAR_OPEN,
    open,
  });
};

export const setPlayerOpen = (open) => (dispatch) => {
  dispatch({
    type: NavActionTypes.SET_PLAYER_OPEN,
    open,
  });
};

export const setPlayerSongIDs = (songIDs) => (dispatch) => {
  dispatch({
    type: NavActionTypes.SET_PLAYER_SONG_IDS,
    songIDs,
  });
};

export const setPlayerSongData = (songData) => (dispatch) => {
  dispatch({
    type: NavActionTypes.SET_PLAYER_SONG_DATA,
    songData,
  });
};

export const setCurrentInterval = (interval) => (dispatch) => {
  dispatch({
    type: NavActionTypes.SET_CURRENT_INTERVAL,
    interval,
  });
};

export const setCurrentSongIndex = (index) => (dispatch) => {
  dispatch({
    type: NavActionTypes.SET_CURRENT_SONG_INDEX,
    index,
  });
};