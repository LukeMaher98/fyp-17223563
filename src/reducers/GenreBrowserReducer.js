import GenreActionTypes from "../actionTypes/GenreActionTypes";

const initialState = {
  currentGenre: null,
  displayProject: null,
  genreArtists: null,
  contentIndex: 0,
  contentFilter: 0,
  contentTimeframe: 0,
};

const GenreBrowserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GenreActionTypes.SET_CURRENT_GENRE: {
      let selectedGenre = action.genre;
      return Object.assign({}, state, { currentGenre: selectedGenre });
    }
    case GenreActionTypes.SET_DISPLAY_PROJECT: {
      let selectedProject = action.project;
      return Object.assign({}, state, { displayProject: selectedProject });
    }
    case GenreActionTypes.SET_GENRE_ARTISTS: {
      let artists = action.artists;
      return Object.assign({}, state, { genreArtists: artists });
    }
    case GenreActionTypes.SET_CONTENT_INDEX: {
      let index = action.index;
      return Object.assign({}, state, { contentIndex: index });
    }
    case GenreActionTypes.SET_CONTENT_FILTER: {
      let filter = action.filter;
      return Object.assign({}, state, { contentFilter: filter });
    }
    case GenreActionTypes.SET_CONTENT_TIMEFRAME: {
      let timeframe = action.timeframe;
      return Object.assign({}, state, { contentTimeframe: timeframe });
    }
    default: {
      return state;
    }
  }
};

export default GenreBrowserReducer;
