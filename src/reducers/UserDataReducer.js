import UserDataActionTypes from "../actionTypes/UserDataActionTypes";

const initialState = {
  userID: null,
  userData: null,
  userArtistIDs: null,
  userArtistData: null,
  currentArtistIndex: null,
  artistProjectIDs: null,
  artistProjectData: null,
  currentProjectIndex: null,
  projectSongIDs: null,
  projectSongData: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case UserDataActionTypes.SET_USER_DATA: {
      let newData = action.userData;
      return Object.assign({}, state, { userData: newData });
    }
    case UserDataActionTypes.SET_USER_ID: {
      let newID = action.userID;
      return Object.assign({}, state, { userID: newID });
    }
    case UserDataActionTypes.SET_USER_ARTIST_DATA: {
      let artistData = action.artistData;
      return Object.assign({}, state, {
        userArtistData: artistData,
      });
    }
    case UserDataActionTypes.SET_USER_ARTIST_IDS: {
      let artistIDs = action.artistIDs;
      return Object.assign({}, state, {
        userArtistIDs: artistIDs,
      });
    }
    case UserDataActionTypes.SET_ARTIST_PROJECT_DATA: {
      let projectData = action.projectData;
      return Object.assign({}, state, {
        artistProjectData: projectData,
      });
    }
    case UserDataActionTypes.SET_ARTIST_PROJECT_IDS: {
      let projectIDs = action.projectIDs;
      return Object.assign({}, state, {
        artistProjectIDs: projectIDs,
      });
    }
    case UserDataActionTypes.SET_PROJECT_SONG_DATA: {
      let songData = action.songData;
      return Object.assign({}, state, {
        projectSongData: songData,
      });
    }
    case UserDataActionTypes.SET_PROJECT_SONG_IDS: {
      let songIDs = action.songIDs;
      return Object.assign({}, state, {
        projectSongIDs: songIDs,
      });
    }
    case UserDataActionTypes.SET_CURRENT_ARTIST_INDEX: {
      let newIndex = action.index;
      return Object.assign({}, state, {
        ...state,
        currentArtistIndex: newIndex,
      });
    }
    case UserDataActionTypes.SET_CURRENT_PROJECT_INDEX: {
      let newIndex = action.index;
      return Object.assign({}, state, {
        ...state,
        currentProjectIndex: newIndex,
      });
    }
    default: {
      return state;
    }
  }
};

export default AuthReducer;
