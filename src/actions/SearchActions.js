import SearchActionTypes from "../actionTypes/SearchActionTypes";

export const setSearchField = (field) => (dispatch) => {
  dispatch({
    type: SearchActionTypes.SET_SEARCH_FIELD,
    field,
  });
};

export const setSearchIndex = (index) => (dispatch) => {
  dispatch({
    type: SearchActionTypes.SET_SEARCH_INDEX,
    index,
  });
};

export const setSearchProjectData = (projectData) => (dispatch) => {
  dispatch({
    type: SearchActionTypes.SET_SEARCH_PROJECT_DATA,
    projectData,
  });
};

export const setSearchProjectIDs = (projectIDs) => (dispatch) => {
  dispatch({
    type: SearchActionTypes.SET_SEARCH_PROJECT_IDS,
    projectIDs,
  });
};

export const setSearchSongData = (songData) => (dispatch) => {
  dispatch({
    type: SearchActionTypes.SET_SEARCH_SONG_DATA,
    songData,
  });
};

export const setSearchSongIDs = (songIDs) => (dispatch) => {
  dispatch({
    type: SearchActionTypes.SET_SEARCH_SONG_IDS,
    songIDs,
  });
};

export const setSearchArtistData = (artistData) => (dispatch) => {
  dispatch({
    type: SearchActionTypes.SET_SEARCH_ARTIST_DATA,
    artistData,
  });
};

export const setSearchArtistIDs = (artistIDs) => (dispatch) => {
  dispatch({
    type: SearchActionTypes.SET_SEARCH_ARTIST_IDS,
    artistIDs,
  });
};

export const setSearchPlaylistData = (playlistData) => (dispatch) => {
  dispatch({
    type: SearchActionTypes.SET_SEARCH_PLAYLIST_DATA,
    playlistData,
  });
};

export const setSearchPlaylistIDs = (playlistIDs) => (dispatch) => {
  dispatch({
    type: SearchActionTypes.SET_SEARCH_PLAYLIST_IDS,
    playlistIDs,
  });
};