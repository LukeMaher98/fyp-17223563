import HomeActionTypes from "../actionTypes/HomeActionTypes";

const initialState = {
  homeState: null,
  libraryState: 0,
  followedArtistData: null,
  followedArtistIDs: null,
  followedArtistProjectData: null,
  followedArtistProjectIDs: null,
  likedSongData: null,
  likedSongIDs: null,
  bookmarkedProjectData: null,
  bookmarkedProjectIDs: null,
  savedPlaylistData: null,
  savedPlaylistIDs: null,
  createdPlaylistData: null,
  createdPlaylistIDs: null,
  currentPlaylistIndex: null,
  playlistState: 1,
  currentPlaylistSongData: null,
  currentPlaylistSongIDs: null
};

const HomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case HomeActionTypes.SET_HOME_STATE: {
      let homeState = action.homeState;
      return Object.assign({}, state, { homeState: homeState });
    }
    case HomeActionTypes.SET_LIBRARY_STATE: {
      let libraryState = action.libraryState;
      return Object.assign({}, state, { libraryState: libraryState });
    }
    case HomeActionTypes.SET_CURRENT_PLAYLIST_INDEX: {
      let playlistIndex = action.playlistIndex;
      return Object.assign({}, state, { currentPlaylistIndex: playlistIndex });
    }
    case HomeActionTypes.SET_PLAYLIST_STATE: {
      let playlistState = action.playlistState;
      return Object.assign({}, state, { playlistState: playlistState });
    }
    case HomeActionTypes.SET_CREATED_PLAYLIST_DATA: {
      let playlistData = action.playlistData;
      return Object.assign({}, state, { createdPlaylistData: playlistData });
    }
    case HomeActionTypes.SET_CREATED_PLAYLIST_IDS: {
      let playlistIDs = action.playlistIDs;
      return Object.assign({}, state, { createdPlaylistIDs: playlistIDs });
    }
    case HomeActionTypes.SET_CURRENT_PLAYLIST_SONG_DATA: {
      let songData = action.songData;
      return Object.assign({}, state, { currentPlaylistSongData: songData });
    }
    case HomeActionTypes.SET_CURRENT_PLAYLIST_SONG_IDS: {
      let songIDs = action.songIDs;
      return Object.assign({}, state, { currentPlaylistSongIDs: songIDs });
    }
    case HomeActionTypes.SET_FOLLOWED_ARTIST_IDS: {
      let artistIDs = action.artistIDs;
      return Object.assign({}, state, { followedArtistIDs: artistIDs });
    }
    case HomeActionTypes.SET_FOLLOWED_ARTIST_DATA: {
      let artistData = action.artistData;
      return Object.assign({}, state, { followedArtistData: artistData });
    }
    case HomeActionTypes.SET_FOLLOWED_ARTIST_PROJECT_IDS: {
      let projectIDs = action.projectIDs;
      return Object.assign({}, state, { followedArtistProjectIDs: projectIDs });
    }
    case HomeActionTypes.SET_FOLLOWED_ARTIST_PROJECT_DATA: {
      let projectData = action.projectData;
      return Object.assign({}, state, {
        followedArtistProjectData: projectData,
      });
    }
    case HomeActionTypes.SET_LIKED_SONG_IDS: {
      let songIDs = action.songIDs;
      return Object.assign({}, state, { likedSongIDs: songIDs });
    }
    case HomeActionTypes.SET_LIKED_SONG_DATA: {
      let songData = action.songData;
      return Object.assign({}, state, { likedSongData: songData });
    }
    case HomeActionTypes.SET_BOOKMARKED_PROJECT_IDS: {
      let projectIDs = action.projectIDs;
      return Object.assign({}, state, { bookmarkedProjectIDs: projectIDs });
    }
    case HomeActionTypes.SET_BOOKMARKED_PROJECT_DATA: {
      let projectData = action.projectData;
      return Object.assign({}, state, { bookmarkedProjectData: projectData });
    }
    case HomeActionTypes.SET_SAVED_PLAYLIST_IDS: {
      let playlistIDs = action.playlistIDs;
      return Object.assign({}, state, { savedPlaylistIDs: playlistIDs });
    }
    case HomeActionTypes.SET_SAVED_PLAYLIST_DATA: {
      let playlistData = action.playlistData;
      return Object.assign({}, state, { savedPlaylistData: playlistData });
    }
    default: {
      return state;
    }
  }
};

export default HomeReducer;
