import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as projectDisplayActions from "../actions/ProjectDisplayActions";
import * as navActions from "../actions/NavActions";
import * as userDataActions from "../actions/UserDataActions";
import * as genreActions from "../actions/GenreActions";
import * as _ from "lodash";
import ProjectDisplay from "../components/ProjectDisplayComponents/ProjectDisplay";
import history from '../history';

const mapStateToProps = state => {
  return {
    history: history,
    userID: state.user.userID,
    userData: state.user.userData,
    currentArtistID: state.project.currentArtistID,
    currentArtistData: state.project.currentArtistData,
    currentProjectID: state.project.currentProjectID,
    currentProjectData: state.project.currentProjectData,
    currentProjectSongIDs: state.project.currentProjectSongIDs,
    currentProjectSongData: state.project.currentProjectSongData,
    createdPlaylistIndex: state.project.createdPlaylistIndex,
    createdPlaylistData: state.project.createdPlaylistData,
    createdPlaylistIDs: state.project.createdPlaylistIDs,
    playerSongData: state.nav.displaySongData,
    playerSongIDs: state.nav.playlistSongIDs,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(_.assign({}, projectDisplayActions, navActions, userDataActions, genreActions ), dispatch);
};

const ProjectDisplayContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDisplay);

export default ProjectDisplayContainer;
