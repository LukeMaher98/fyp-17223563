import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as playlistDisplayActions from "../actions/PlaylistDisplayActions";
import * as navActions from "../actions/NavActions";
import * as userDataActions from "../actions/UserDataActions";
import * as genreActions from "../actions/GenreActions";
import * as _ from "lodash";
import PlaylistDisplay from "../components/PlaylistDisplayComponents/PlaylistDisplay";
import history from '../history';

const mapStateToProps = state => {
  return {
    history: history,
    userID: state.user.userID,
    userData: state.user.userData,
    currentPlaylistID: state.playlist.currentPlaylistID,
    currentPlaylistData: state.playlist.currentPlaylistData,
    relatedPlaylistIDs: state.playlist.relatedPlaylistIDs,
    relatedPlaylistData: state.playlist.relatedPlaylistData,
    playlistSongIDs: state.playlist.playlistSongIDs,
    playlistSongData: state.playlist.playlistSongData,
    createdPlaylistIndex: state.playlist.createdPlaylistIndex,
    createdPlaylistIDs: state.playlist.createdPlaylistIDs,
    createdPlaylistData: state.playlist.createdPlaylistData,
    playerSongData: state.nav.displaySongData,
    playerSongIDs: state.nav.playlistSongIDs,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(_.assign({}, playlistDisplayActions, navActions, userDataActions, genreActions ), dispatch);
};

const PlaylistDisplayContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistDisplay);

export default PlaylistDisplayContainer;
