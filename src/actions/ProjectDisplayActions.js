import ProjectDisplayActionTypes from "../actionTypes/ProjectDisplayActionTypes";

export const setCurrentProjectData = (projectData) => (dispatch) => {
    dispatch({
      type: ProjectDisplayActionTypes.SET_CURRENT_PROJECT_DATA,
      projectData,
    });
  };

  export const setCurrentProjectArtistData = (artistData) => (dispatch) => {
    dispatch({
      type: ProjectDisplayActionTypes.SET_CURRENT_PROJECT_ARTIST_DATA,
      artistData,
    });
  };

  export const setCurrentProjectID = (projectID) => (dispatch) => {
    dispatch({
      type: ProjectDisplayActionTypes.SET_CURRENT_PROJECT_ID,
      projectID,
    });
  };

  export const setCurrentProjectArtistID = (artistID) => (dispatch) => {
    dispatch({
      type: ProjectDisplayActionTypes.SET_CURRENT_PROJECT_ARTIST_ID,
      artistID,
    });
  };

  export const setCurrentProjectSongIDs = (songIDs) => (dispatch) => {
    dispatch({
      type: ProjectDisplayActionTypes.SET_CURRENT_PROJECT_SONG_IDS,
      songIDs,
    });
  };

  export const setCurrentProjectSongData = (songData) => (dispatch) => {
    dispatch({
      type: ProjectDisplayActionTypes.SET_CURRENT_PROJECT_SONG_DATA,
      songData,
    });
  };

  export const setCreatedPlaylistIndex = (index) => (dispatch) => {
    dispatch({
      type: ProjectDisplayActionTypes.SET_CREATED_PLAYLIST_INDEX,
      index,
    });
  };
  
  export const setCreatedPlaylistIDs = (playlistIDs) => (dispatch) => {
    dispatch({
      type: ProjectDisplayActionTypes.SET_CREATED_PLAYLIST_IDS,
      playlistIDs,
    });
  };

  export const setCreatedPlaylistData = (playlistData) => (dispatch) => {
    dispatch({
      type: ProjectDisplayActionTypes.SET_CREATED_PLAYLIST_DATA,
      playlistData,
    });
  };