import SearchActionTypes from "../actionTypes/SearchActionTypes";

const initialState = {
  searchField: null,
  searchIndex: 0,
  searchProjectData: null,
  searchProjectIDs: null,
  searchArtistData: null,
  searchArtistIDs: null,
  searchSongData: null,
  searchSongIDs: null,
  searchPlaylistData: null,
  searchPlaylistIDs: null,
};

const SearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SearchActionTypes.SET_SEARCH_FIELD: {
      let field = action.field;
      return Object.assign({}, state, { searchField: field });
    }
    case SearchActionTypes.SET_SEARCH_INDEX: {
      let index = action.index;
      return Object.assign({}, state, { searchIndex: index });
    }
    case SearchActionTypes.SET_SEARCH_PROJECT_DATA: {
      let projectData = action.projectData;
      return Object.assign({}, state, { searchProjectData: projectData });
    }
    case SearchActionTypes.SET_SEARCH_PROJECT_IDS: {
      let projectIDs = action.projectIDs;
      return Object.assign({}, state, { searchProjectIDs: projectIDs });
    }
    case SearchActionTypes.SET_SEARCH_ARTIST_DATA: {
      let artistData = action.artistData;
      return Object.assign({}, state, { searchArtistData: artistData });
    }
    case SearchActionTypes.SET_SEARCH_ARTIST_IDS: {
      let artistIDs = action.artistIDs;
      return Object.assign({}, state, { searchArtistIDs: artistIDs });
    }
    case SearchActionTypes.SET_SEARCH_SONG_DATA: {
      let songData = action.songData;
      return Object.assign({}, state, { searchSongData: songData });
    }
    case SearchActionTypes.SET_SEARCH_SONG_IDS: {
      let songIDs = action.songIDs;
      return Object.assign({}, state, { searchSongIDs: songIDs });
    }
    case SearchActionTypes.SET_SEARCH_PLAYLIST_DATA: {
      let playlistData = action.playlistData;
      return Object.assign({}, state, { searchPlaylistData: playlistData });
    }
    case SearchActionTypes.SET_SEARCH_PLAYLIST_IDS: {
      let playlistIDs = action.playlistIDs;
      return Object.assign({}, state, { searchPlaylistIDs: playlistIDs });
    }
    default: {
      return state;
    }
  }
};

export default SearchReducer;
