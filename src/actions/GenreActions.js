import GenreActionTypes from "../actionTypes/GenreActionTypes";

export const setCurrentGenre = (genre) => (dispatch) => {
  dispatch({
    type: GenreActionTypes.SET_CURRENT_GENRE,
    genre,
  });
};

export const setDisplayProject = (project) => (dispatch) => {
  dispatch({
    type: GenreActionTypes.SET_DISPLAY_PROJECT,
    project,
  });
};

export const setGenreArtists = (artists) => (dispatch) => {
  dispatch({
    type: GenreActionTypes.SET_GENRE_ARTISTS,
    artists,
  });
};

export const setContentIndex = (index) => (dispatch) => {
  dispatch({
    type: GenreActionTypes.SET_CONTENT_INDEX,
    index,
  });
};

export const setContentFilter = (filter) => (dispatch) => {
  dispatch({
    type: GenreActionTypes.SET_CONTENT_FILTER,
    filter,
  });
};

export const setContentTimeframe = (timeframe) => (dispatch) => {
  dispatch({
    type: GenreActionTypes.SET_CONTENT_TIMEFRAME,
    timeframe,
  });
};

