import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "../actions/AuthActions";
import * as userDataActions from "../actions/UserDataActions";
import * as homeActions from "../actions/HomeActions";
import * as _ from "lodash";
import App from "../App";

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.auth.currentUser,
    userID: state.user.userID,
    userData: state.user.userData,
    userArtists: state.user.userArtists,
    artistProjects: state.user.artistProjects,
    projectSongs: state.user.projectSongs,
    currentArtistIndex: state.user.currentArtistIndex,
    currentProjectIndex: state.user.currentProjectIndex,
    currentGenre: state.genre.currentGenre,
    forceUpdate: ownProps.forceUpdate,
    history: ownProps.history,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(_.assign({}, authActions, userDataActions, homeActions), dispatch);
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
