import PlaylistDisplayActionTypes from "../actionTypes/PlaylistDisplayActionTypes";

const initialState = {
  currentPlaylistID: null,
  currentPlaylistData: null,
  relatedPlaylistIDs: null,
  relatedPlaylistData: null,
  playlistSongsIDs: null,
  playlistSongsData: null,
  createdPlaylistIndex: null,
  createdPlaylistIDs: null,
  createdPlaylistData: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case PlaylistDisplayActionTypes.SET_CURRENT_PLAYLIST_ID: {
      let playlistID = action.playlistID;
      return Object.assign({}, state, { currentPlaylistID: playlistID });
    }
    case PlaylistDisplayActionTypes.SET_CURRENT_PLAYLIST_DATA: {
      let playlistData = action.playlistData;
      return Object.assign({}, state, { currentPlaylistData: playlistData });
    }
    case PlaylistDisplayActionTypes.SET_RELATED_PLAYLIST_IDS: {
      let playlistIDs = action.playlistIDs;
      return Object.assign({}, state, { relatedPlaylistIDs: playlistIDs });
    }
    case PlaylistDisplayActionTypes.SET_RELATED_PLAYLIST_DATA: {
      let playlistData = action.playlistData;
      return Object.assign({}, state, { relatedPlaylistData: playlistData });
    }
    case PlaylistDisplayActionTypes.SET_PLAYLIST_SONG_IDS: {
      let songIDs = action.songIDs;
      return Object.assign({}, state, { playlistSongIDs: songIDs });
    }
    case PlaylistDisplayActionTypes.SET_PLAYLIST_SONG_DATA: {
      let songData = action.songData;
      return Object.assign({}, state, { playlistSongData: songData });
    }
    case PlaylistDisplayActionTypes.SET_CREATED_PLAYLIST_INDEX: {
      let index = action.index;
      return Object.assign({}, state, { createdPlaylistIndex: index });
    }
    case PlaylistDisplayActionTypes.SET_CREATED_PLAYLIST_IDS: {
      let playlistIDs = action.playlistIDs;
      return Object.assign({}, state, { createdPlaylistIDs: playlistIDs });
    }
    case PlaylistDisplayActionTypes.SET_CREATED_PLAYLIST_DATA: {
      let playlistData = action.playlistData;
      return Object.assign({}, state, { createdPlaylistData: playlistData });
    }
    default: {
      return state;
    }
  }
};

export default AuthReducer;
