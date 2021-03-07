import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as _ from "lodash";
import * as genreActions from "../actions/GenreActions";
import * as projectDisplayActions from "../actions/ProjectDisplayActions";
import GenreBrowser from "../components/GenreComponents/GenreBrowser";

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.auth.currentUser,
    userID: state.user.userID,
    userData: state.user.userData,
    forceUpdate: ownProps.forceUpdate,
    currentGenre: state.genre.currentGenre,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(_.assign({}, genreActions, projectDisplayActions ), dispatch);
};

const GenreBrowserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GenreBrowser);

export default GenreBrowserContainer;