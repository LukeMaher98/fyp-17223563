import { combineReducers } from 'redux';
import ArtistManagementReducer from './ArtistManagementReducer';
import ArtistDisplayReducer from './ArtistDisplayReducer';
import AuthReducer from './AuthReducer';
import GenreBrowserReducer from "./GenreBrowserReducer"
import NavReducer from './NavReducer';
import PlaylistDisplayReducer from './PlaylistDisplayReducer'
import ProjectDisplayReducer from './ProjectDisplayReducer'
import SearchReducer from './SearchReducer'
import UserDataReducer from './UserDataReducer'
import HomeReducer from './HomeReducer';

const rootReducer = combineReducers({
  artist: ArtistManagementReducer, 
  artist_display: ArtistDisplayReducer, 
  auth: AuthReducer,
  genre: GenreBrowserReducer,
  nav: NavReducer,
  home: HomeReducer,
  playlist: PlaylistDisplayReducer,
  project: ProjectDisplayReducer,
  search: SearchReducer,
  user: UserDataReducer,
});

export default rootReducer;
