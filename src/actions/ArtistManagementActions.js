import ArtistManagementTypes from "../actionTypes/ArtistManagementTypes";

export const setArtistDisplay = (display) => (dispatch) => {
  dispatch({
    type: ArtistManagementTypes.SET_ARTIST_DISPLAY,
    display,
  });
};

export const setArtistForm = (form) => (dispatch) => {
  dispatch({
    type: ArtistManagementTypes.SET_ARTIST_FORM,
    form,
  });
};

export const setProjectDisplay = (display) => (dispatch) => {
  dispatch({
    type: ArtistManagementTypes.SET_PROJECT_DISPLAY,
    display,
  });
};

export const setProjectForm = (form) => (dispatch) => {
  dispatch({
    type: ArtistManagementTypes.SET_PROJECT_FORM,
    form,
  });
};

export const setUploadCount = (count) => (dispatch) => {
  dispatch({
    type: ArtistManagementTypes.SET_UPLOAD_COUNT,
    count,
  });
};

export const setUploadProgress = (progress) => (dispatch) => {
  dispatch({
    type: ArtistManagementTypes.SET_UPLOAD_PROGRESS,
    progress,
  });
};

export const setUploadIndex = (index) => (dispatch) => {
  dispatch({
    type: ArtistManagementTypes.SET_UPLOAD_INDEX,
    index,
  });
};
