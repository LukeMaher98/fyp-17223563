import ArtistManagementTypes from "../actionTypes/ArtistManagementTypes";

const initialState = {
  artistDisplay: null,
  artistForm: null,
  projectDisplay: null,
  projectForm: null,
  uploadCount: null,
  uploadProgress: null,
  uploadIndex: null
};

const ArtistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ArtistManagementTypes.SET_ARTIST_DISPLAY: {
      let display = action.display;
      return Object.assign({}, state, { artistDisplay: display });
    }
    case ArtistManagementTypes.SET_ARTIST_FORM: {
      let form = action.form;
      return Object.assign({}, state, { artistForm: form });
    }
    case ArtistManagementTypes.SET_PROJECT_DISPLAY: {
      let display = action.display;
      return Object.assign({}, state, { projectDisplay: display });
    }
    case ArtistManagementTypes.SET_PROJECT_FORM: {
      let form = action.form;
      return Object.assign({}, state, { projectForm: form });
    }
    case ArtistManagementTypes.SET_UPLOAD_COUNT: {
      let count = action.count;
      return Object.assign({}, state, { uploadCount: count });
    }
    case ArtistManagementTypes.SET_UPLOAD_PROGRESS: {
      let progress = action.progress;
      return Object.assign({}, state, { uploadProgress: progress });
    }
    case ArtistManagementTypes.SET_UPLOAD_INDEX: {
      let index = action.index;
      return Object.assign({}, state, { uploadIndex: index });
    }
    default: {
      return state;
    }
  }
};

export default ArtistReducer;
