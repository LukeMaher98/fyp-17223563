import ArtistDisplayActionTypes from "../actionTypes/ArtistDisplayActionTypes";

const initialState = {
  currentArtistID: null,
  currentArtistData: null,
  currentArtistProjectIDs: null,
  currentArtistProjectData: null,
  currentArtistTrackData: null,
  currentArtistTrackIDs: null,
  createdPlaylistIndex: null,
  createdPlaylistIDs: null,
  createdPlaylistData: null
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ArtistDisplayActionTypes.SET_CURRENT_ARTIST_ID: {
      let artistID = action.artistID;
      return Object.assign({}, state, { currentArtistID: artistID });
    }
    case ArtistDisplayActionTypes.SET_CURRENT_ARTIST_DATA: {
      let artistData = action.artistData;
      return Object.assign({}, state, { currentArtistData: artistData });
    }
    case ArtistDisplayActionTypes.SET_CURRENT_ARTIST_PROJECT_IDS: {
      let projectIDs = action.projectIDs;
      return Object.assign({}, state, { currentArtistProjectIDs: projectIDs });
    }
    case ArtistDisplayActionTypes.SET_CURRENT_ARTIST_PROJECT_DATA: {
      let projectData = action.projectData;
      return Object.assign({}, state, { currentArtistProjectData: projectData });
    }
    case ArtistDisplayActionTypes.SET_CURRENT_ARTIST_TRACK_DATA: {
      let artistTrackData = action.artistTrackData;
      return Object.assign({}, state, { currentArtistTrackData: artistTrackData });
    }
    case ArtistDisplayActionTypes.SET_CURRENT_ARTIST_TRACK_IDS: {
      let artistTrackIDs = action.artistTrackIDs;
      return Object.assign({}, state, { currentArtistTrackIDs: artistTrackIDs });
    }
    case ArtistDisplayActionTypes.SET_ARTIST_CREATED_PLAYLIST_INDEX: {
      let index = action.index;
      return Object.assign({}, state, { createdPlaylistIndex: index });
    }
    case ArtistDisplayActionTypes.SET_ARTIST_CREATED_PLAYLIST_IDS: {
      let playlistIDs = action.playlistIDs;
      return Object.assign({}, state, { createdPlaylistIDs: playlistIDs });
    }
    case ArtistDisplayActionTypes.SET_ARTIST_CREATED_PLAYLIST_DATA: {
      let playlistData = action.playlistData;
      return Object.assign({}, state, { createdPlaylistData: playlistData });
    }
    default: {
      return state;
    }
  }
};

export default AuthReducer;
