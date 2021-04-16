import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as navActions from "../actions/NavActions";
import * as genreActions from "../actions/GenreActions";
import * as projectDisplayActions from "../actions/ProjectDisplayActions";
import * as artistDisplayActions from "../actions/ArtistDisplayActions";
import * as authActions from "../actions/AuthActions";
import * as searchActions from "../actions/SearchActions";
import * as userDataActions from "../actions/UserDataActions";
import * as _ from "lodash";
import MainNavigation from "../components/NavigationComponents/MainNavigation";
import * as homeActions from "../actions/HomeActions";
import history from "../history";

const mapStateToProps = (state) => {
  return {
    history: history,
    userID: state.user.userID,
    userData: state.user.userData,
    playerOpen: state.nav.playerOpen,
    displaySongData: state.nav.displaySongData,
    playlistSongIDs: state.nav.playlistSongIDs,
    currentInterval: state.nav.currentInterval,
    currentSongIndex: state.nav.currentSongIndex,
    locked: state.artist.uploadCount,
    progress: state.artist.uploadProgress
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    _.assign(
      {},
      searchActions,
      navActions,
      genreActions,
      projectDisplayActions,
      artistDisplayActions,
      authActions,
      homeActions,
      userDataActions
    ),
    dispatch
  );
};

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainNavigation);

export default LoginContainer;
