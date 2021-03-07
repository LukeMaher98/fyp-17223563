import PlaylistDisplayActionTypes from "../actionTypes/PlaylistDisplayActionTypes";

export const setCurrentPlaylistData = (playlistData) => (dispatch) => {
    dispatch({
      type: PlaylistDisplayActionTypes.SET_CURRENT_PLAYLIST_DATA,
      playlistData,
    });
  };

  export const setRelatedPlaylistData = (playlistData) => (dispatch) => {
    dispatch({
      type: PlaylistDisplayActionTypes.SET_RELATED_PLAYLIST_DATA,
      playlistData
    });
  };

  export const setCurrentPlaylistID = (playlistID) => (dispatch) => {
    dispatch({
      type: PlaylistDisplayActionTypes.SET_CURRENT_PLAYLIST_ID,
      playlistID,
    });
  };

  export const setRelatedPlaylistIDs = (playlistIDs) => (dispatch) => {
    dispatch({
        type: PlaylistDisplayActionTypes.SET_RELATED_PLAYLIST_IDS,
        playlistIDs
    });
  };

  export const setPlaylistSongIDs = (songIDs) => (dispatch) => {
    dispatch({
      type: PlaylistDisplayActionTypes.SET_PLAYLIST_SONG_IDS,
      songIDs,
    });
  };

  export const setPlaylistSongData = (songData) => (dispatch) => {
    dispatch({
      type: PlaylistDisplayActionTypes.SET_PLAYLIST_SONG_DATA,
      songData,
    });
  };

  export const setCreatedPlaylistIndex = (index) => (dispatch) => {
    dispatch({
      type: PlaylistDisplayActionTypes.SET_CREATED_PLAYLIST_INDEX,
      index,
    });
  };

  
  export const setCreatedPlaylistIDs = (playlistIDs) => (dispatch) => {
    dispatch({
      type: PlaylistDisplayActionTypes.SET_CREATED_PLAYLIST_IDS,
      playlistIDs,
    });
  };

  export const setCreatedPlaylistData = (playlistData) => (dispatch) => {
    dispatch({
      type: PlaylistDisplayActionTypes.SET_CREATED_PLAYLIST_DATA,
      playlistData,
    });
  };