import ArtistDisplayActionTypes from "../actionTypes/ArtistDisplayActionTypes";

  export const setCurrentArtistData = (artistData) => (dispatch) => {
    dispatch({
      type: ArtistDisplayActionTypes.SET_CURRENT_ARTIST_DATA,
      artistData,
    });
  };

  export const setCurrentArtistID = (artistID) => (dispatch) => {
    dispatch({
      type: ArtistDisplayActionTypes.SET_CURRENT_ARTIST_ID,
      artistID,
    });
  };

  export const setCurrentArtistTrackData = (artistTrackData) => (dispatch) => {
    dispatch({
      type: ArtistDisplayActionTypes.SET_CURRENT_ARTIST_TRACK_DATA,
      artistTrackData,
    });
  };

  export const setCurrentArtistTrackIDs = (artistTrackIDs) => (dispatch) => {
    dispatch({
      type: ArtistDisplayActionTypes.SET_CURRENT_ARTIST_TRACK_IDS,
      artistTrackIDs,
    });
  };

  export const setCurrentArtistProjectIDs = (projectIDs) => (dispatch) => {
    dispatch({
      type: ArtistDisplayActionTypes.SET_CURRENT_ARTIST_PROJECT_IDS,
      projectIDs,
    });
  };

  export const setCurrentArtistProjectData = (projectData) => (dispatch) => {
    dispatch({
      type: ArtistDisplayActionTypes.SET_CURRENT_ARTIST_PROJECT_DATA,
      projectData,
    });
  };

 export const setArtistCreatedPlaylistIndex = (index) => (dispatch) => {
    dispatch({
      type: ArtistDisplayActionTypes.SET_ARTIST_CREATED_PLAYLIST_INDEX,
      index,
    });
  };
  
  export const setArtistCreatedPlaylistIDs = (playlistIDs) => (dispatch) => {
    dispatch({
      type: ArtistDisplayActionTypes.SET_ARTIST_CREATED_PLAYLIST_IDS,
      playlistIDs,
    });
  };

  export const setArtistCreatedPlaylistData = (playlistData) => (dispatch) => {
    dispatch({
      type: ArtistDisplayActionTypes.SET_ARTIST_CREATED_PLAYLIST_DATA,
      playlistData,
    });
  };
  
