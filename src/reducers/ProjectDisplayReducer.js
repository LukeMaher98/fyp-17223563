import ProjectDisplayActionTypes from "../actionTypes/ProjectDisplayActionTypes";

const initialState = {
  currentArtistID: null,
  currentArtistData: null,
  currentProjectID: null,
  currentProjectData: null,
  currentProjectSongIDs: null,
  currentProjectSongData: null,
  createdPlaylistIndex: null,
  createdPlaylistIDs: null,
  createdPlaylistData: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ProjectDisplayActionTypes.SET_CURRENT_PROJECT_ARTIST_ID: {
      let artistID = action.artistID;
      return Object.assign({}, state, { currentArtistID: artistID });
    }
    case ProjectDisplayActionTypes.SET_CURRENT_PROJECT_ARTIST_DATA: {
      let artistData = action.artistData;
      return Object.assign({}, state, { currentArtistData: artistData });
    }
    case ProjectDisplayActionTypes.SET_CURRENT_PROJECT_ID: {
      let projectID = action.projectID;
      return Object.assign({}, state, { currentProjectID: projectID });
    }
    case ProjectDisplayActionTypes.SET_CURRENT_PROJECT_DATA: {
      let projectData = action.projectData;
      return Object.assign({}, state, { currentProjectData: projectData });
    }
    case ProjectDisplayActionTypes.SET_CURRENT_PROJECT_SONG_IDS: {
      let songIDs = action.songIDs;
      return Object.assign({}, state, { currentProjectSongIDs: songIDs });
    }
    case ProjectDisplayActionTypes.SET_CURRENT_PROJECT_SONG_DATA: {
      let songData = action.songData;
      return Object.assign({}, state, { currentProjectSongData: songData });
    }
    case ProjectDisplayActionTypes.SET_CREATED_PLAYLIST_INDEX: {
      let index = action.index;
      return Object.assign({}, state, { createdPlaylistIndex: index });
    }
    case ProjectDisplayActionTypes.SET_CREATED_PLAYLIST_IDS: {
      let playlistIDs = action.playlistIDs;
      return Object.assign({}, state, { createdPlaylistIDs: playlistIDs });
    }
    case ProjectDisplayActionTypes.SET_CREATED_PLAYLIST_DATA: {
      let playlistData = action.playlistData;
      return Object.assign({}, state, { createdPlaylistData: playlistData });
    }
    default: {
      return state;
    }
  }
};

export default AuthReducer;
