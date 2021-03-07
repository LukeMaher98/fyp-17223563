import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as artistDisplayActions from "../actions/ArtistDisplayActions";
import * as projectDisplayActions from "../actions/ProjectDisplayActions";
import * as navActions from "../actions/NavActions";
import * as userDataActions from "../actions/UserDataActions";
import * as genreActions from "../actions/GenreActions";
import * as _ from "lodash";
import ArtistDisplay from "../components/ArtistDisplayComponents/ArtistDisplay";
import history from "../history";

const mapStateToProps = (state) => {
  return {
    history: history,
    userID: state.user.userID,
    userData: state.user.userData,
    currentArtistID: state.artist_display.currentArtistID,
    currentArtistData: state.artist_display.currentArtistData,
    currentArtistProjectIDs: state.artist_display.currentArtistProjectIDs,
    currentArtistProjectData: state.artist_display.currentArtistProjectData,
    currentArtistTopTrackIDs: state.artist_display.currentArtistTrackIDs,
    currentArtistTopTrackData: state.artist_display.currentArtistTrackData,
    createdPlaylistIndex: state.artist_display.createdPlaylistIndex,
    createdPlaylistData: state.artist_display.createdPlaylistData,
    createdPlaylistIDs: state.artist_display.createdPlaylistIDs,
    playerSongIDs: state.nav.playlistSongIDs,
    playerSongData: state.nav.displaySongData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    _.assign(
      {},
      artistDisplayActions,
      navActions,
      userDataActions,
      projectDisplayActions,
      genreActions
    ),
    dispatch
  );
};

const ArtistDisplayContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArtistDisplay);

export default ArtistDisplayContainer;
