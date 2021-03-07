import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as _ from "lodash";
import * as genreActions from "../actions/GenreActions";
import * as playlistDisplayActions from "../actions/PlaylistDisplayActions";
import * as projectDisplayActions from "../actions/ProjectDisplayActions";
import * as artistDisplayActions from "../actions/ArtistDisplayActions";
import * as navActions from "../actions/NavActions";
import GenreDisplay from "../components/GenreComponents/GenreDisplay";

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.auth.currentUser,
    userID: state.user.userID,
    userData: state.user.userData,
    currentGenre: state.genre.currentGenre,
    displayProject: state.genre.displayProject,
    genreArtists: state.genre.genreArtists,
    contentIndex: state.genre.contentIndex,
    contentFilter: state.genre.contentFilter,
    contentTimeframe: state.genre.contentTimeframe,
    playerSongIDs: state.nav.playlistSongIDs,
    playerSongData: state.nav.displaySongData,
    ...ownProps
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(_.assign({}, genreActions, playlistDisplayActions, navActions, projectDisplayActions, artistDisplayActions ), dispatch);
};

const ArtistManagementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GenreDisplay);

export default ArtistManagementContainer;