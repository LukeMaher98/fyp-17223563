import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as homeActions from "../actions/HomeActions";
import * as playlistDisplayActions from "../actions/PlaylistDisplayActions";
import * as projectDisplayActions from "../actions/ProjectDisplayActions";
import * as artistDisplayActions from "../actions/ArtistDisplayActions";
import * as navActions from "../actions/NavActions";
import * as userDataActions from "../actions/UserDataActions";
import Home from "../components/HomeComponents/Home";
import * as _ from "lodash";
import history from "../history";

const mapStateToProps = (state, ownProps) => {
  return {
    homeState: ownProps.homeState,
    userData: state.user.userData,
    userID: state.user.userID,
    libraryState: state.home.libraryState,
    followedArtistIDs: state.home.followedArtistIDs,
    followedArtistData: state.home.followedArtistData,
    followedArtistProjectIDs: state.home.followedArtistProjectIDs,
    followedArtistProjectData: state.home.followedArtistProjectData,
    likedSongIDs: state.home.likedSongIDs,
    likedSongData: state.home.likedSongData,
    bookmarkedProjectIDs: state.home.bookmarkedProjectIDs,
    bookmarkedProjectData: state.home.bookmarkedProjectData,
    savedPlaylistIDs: state.home.savedPlaylistIDs,
    savedPlaylistData: state.home.savedPlaylistData,
    createdPlaylistIDs: state.home.createdPlaylistIDs,
    createdPlaylistData: state.home.createdPlaylistData,
    currentPlaylistSongIDs: state.home.currentPlaylistSongIDs,
    currentPlaylistSongData: state.home.currentPlaylistSongData,
    currentPlaylistIndex: state.home.currentPlaylistIndex,
    playerSongIDs: state.nav.playlistSongIDs,
    playerSongData: state.nav.displaySongData,
    playlistState: state.home.playlistState,
    history: history,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    _.assign(
      {},
      homeActions,
      navActions,
      userDataActions,
      playlistDisplayActions,
      projectDisplayActions,
      artistDisplayActions
    ),
    dispatch
  );
};

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);

export default HomeContainer;
