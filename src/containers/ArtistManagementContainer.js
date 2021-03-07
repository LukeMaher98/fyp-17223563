import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as _ from "lodash";
import * as artistManagementActions from "../actions/ArtistManagementActions";
import * as navActions from "../actions/NavActions";
import * as userDataActions from "../actions/UserDataActions";
import ArtistManagement from "../components/ArtistManagementComponents/ArtistManagement";

const mapStateToProps = (state, ownProps) => {
  return {
    artistDisplay: state.artist.artistDisplay,
    artistForm: state.artist.artistForm,
    projectDisplay: state.artist.projectDisplay,
    projectForm: state.artist.projectForm,
    uploadCount: state.artist.uploadCount,
    uploadProgress: state.artist.uploadProgress,
    uploadIndex: state.artist.uploadIndex,
    currentUser: state.auth.currentUser,
    userID: state.user.userID,
    userData: state.user.userData,
    userArtistIDs: state.user.userArtistIDs,
    userArtistData: state.user.userArtistData,
    artistProjectIDs: state.user.artistProjectIDs,
    artistProjectData: state.user.artistProjectData,
    projectSongIDs: state.user.projectSongIDs,
    projectSongData: state.user.projectSongData,
    currentArtistIndex: state.user.currentArtistIndex,
    currentProjectIndex: state.user.currentProjectIndex,
    forceUpdate: ownProps.forceUpdate,
    history: ownProps.history,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(_.assign({}, artistManagementActions, navActions, userDataActions ), dispatch);
};

const ArtistManagementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArtistManagement);

export default ArtistManagementContainer;