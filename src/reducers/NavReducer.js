import { setCurrentSongIndex } from "../actions/NavActions";
import NavActionTypes from "../actionTypes/NavActionTypes";

const initialState = {
  playerOpen: null,
  playlistSongIDs: [],
  displaySongData: [],
  playerSong: null,
  sidebarOpen: null,
  currentInterval: null,
  currentSongIndex: null 
};

const NavReducer = (state = initialState, action) => {
  switch (action.type) {
    case NavActionTypes.SET_SIDEBAR_OPEN: {
      let open = action.open;
      return Object.assign({}, state, { sidebarOpen: open });
    }
    case NavActionTypes.SET_PLAYER_OPEN: {
      let open = action.open;
      return Object.assign({}, state, { playerOpen: open });
    }
    case NavActionTypes.SET_PLAYER_SONG_IDS: {
      let songIDs = action.songIDs;
      return Object.assign({}, state, { playlistSongIDs: songIDs });
    }
    case NavActionTypes.SET_PLAYER_SONG_DATA: {
      let songData = action.songData;
      return Object.assign({}, state, { displaySongData: songData });
    }
    case NavActionTypes.SET_PLAYER_SONG: {
      let song = action.song;
      return Object.assign({}, state, { playerSong: song });
    }
    case NavActionTypes.SET_CURRENT_INTERVAL: {
      let interval = action.interval;
      return Object.assign({}, state, { currentInterval: interval });
    }
    case NavActionTypes.SET_CURRENT_SONG_INDEX: {
      let index = action.index;
      return Object.assign({}, state, { currentSongIndex: index });
    }
    default: {
      return state;
    }
  }
};

export default NavReducer;
