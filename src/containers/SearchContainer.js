import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as searchActions from "../actions/SearchActions";
import * as navActions from "../actions/NavActions";
import * as playlistDisplayActions from "../actions/PlaylistDisplayActions";
import * as projectDisplayActions from "../actions/ProjectDisplayActions";
import * as artistDisplayActions from "../actions/ArtistDisplayActions";
import * as _ from "lodash";
import Search from "../components/HomeComponents/Search";

const mapStateToProps = (state) => {
  return {
    searchField: state.search.searchField,
    searchIndex: state.search.searchIndex,
    searchArtistIDs: state.search.searchArtistIDs,
    searchArtistData: state.search.searchArtistData,
    searchProjectIDs: state.search.searchProjectIDs,
    searchProjectData: state.search.searchProjectData,
    searchSongIDs: state.search.searchSongIDs,
    searchSongData: state.search.searchSongData,
    searchPlaylistIDs: state.search.searchPlaylistIDs,
    searchPlaylistData: state.search.searchPlaylistData,
    playerSongData: state.nav.displaySongData,
    playerSongIDs: state.nav.playlistSongIDs,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    _.assign(
      {},
      searchActions,
      navActions,
      playlistDisplayActions,
      projectDisplayActions,
      artistDisplayActions
    ),
    dispatch
  );
};

const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(Search);

export default SearchContainer;
