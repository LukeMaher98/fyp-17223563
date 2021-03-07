import HomeActionTypes from "../actionTypes/HomeActionTypes";

export const setHomeState = (homeState) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_HOME_STATE,
    homeState,
  });
};

export const setLibraryState = (libraryState) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_LIBRARY_STATE,
    libraryState,
  });
};

export const setCurrentPlaylistIndex = (playlistIndex) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_CURRENT_PLAYLIST_INDEX,
    playlistIndex,
  });
};

export const setPlaylistState = (playlistState) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_PLAYLIST_STATE,
    playlistState,
  });
};

export const setCreatedPlaylistData = (playlistData) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_CREATED_PLAYLIST_DATA,
    playlistData,
  });
};

export const setCreatedPlaylistIDs = (playlistIDs) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_CREATED_PLAYLIST_IDS,
    playlistIDs,
  });
};

export const setCurrentPlaylistSongData = (songData) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_CURRENT_PLAYLIST_SONG_DATA,
    songData,
  });
};

export const setCurrentPlaylistSongIDs = (songIDs) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_CURRENT_PLAYLIST_SONG_IDS,
    songIDs,
  });
};

export const setFollowedArtistIDs = (artistIDs) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_FOLLOWED_ARTIST_IDS,
    artistIDs,
  });
};

export const setFollowedArtistData = (artistData) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_FOLLOWED_ARTIST_DATA,
    artistData,
  });
};

export const setFollowedArtistProjectIDs = (projectIDs) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_FOLLOWED_ARTIST_PROJECT_IDS,
    projectIDs,
  });
};

export const setFollowedArtistProjectData = (projectData) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_FOLLOWED_ARTIST_PROJECT_DATA,
    projectData,
  });
};

export const setLikedSongIDs = (songIDs) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_LIKED_SONG_IDS,
    songIDs,
  });
};

export const setLikedSongData = (songData) => (dispatch) => {
  dispatch({
    type: HomeActionTypes.SET_LIKED_SONG_DATA,
    songData,
  });
};

export const setBookmarkedProjectIDs = (projectIDs) => (dispatch) => {
    dispatch({
      type: HomeActionTypes.SET_BOOKMARKED_PROJECT_IDS,
      projectIDs,
    });
  };
  
  export const setBookmarkedProjectData = (projectData) => (dispatch) => {
    dispatch({
      type: HomeActionTypes.SET_BOOKMARKED_PROJECT_DATA,
      projectData,
    });
  };

  export const setSavedPlaylistIDs = (playlistIDs) => (dispatch) => {
    dispatch({
      type: HomeActionTypes.SET_SAVED_PLAYLIST_IDS,
      playlistIDs,
    });
  };
  
  export const setSavedPlaylistData = (playlistData) => (dispatch) => {
    dispatch({
      type: HomeActionTypes.SET_SAVED_PLAYLIST_DATA,
      playlistData,
    });
  };
