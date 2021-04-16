import React from "react";
import { Grid, Paper, Typography, Tooltip } from "@material-ui/core";
import {
  Clear,
  MusicNote,
  Person,
  PlaylistAdd,
  PlaylistPlay,
  QueueMusic,
} from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { pushHistory } from "../../constants/utils";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { useStyles } from "../../constants/styling";

const LibraryPlaylistListingBase = (props) => {
  const styles = useStyles();

  const url =
    props.playlistData.imageVersion === 0
      ? props.playlistID
      : `${props.playlistID}_${props.playlistData.imageVersion - 1}`;

  const playPlaylist = () => {
    props.setCurrentSongIndex(null);
    let songData = [];
    props.playlistData.songIDs.map(async (songID) => {
      await props.firebase.firestoreGetDoc("songs", songID).then((doc) => {
        let data = doc.data();
        songData = [...songData, data];
        if (songData.length === props.playlistData.songIDs.length) {
          props.setPlayerSongIDs([...props.playlistData.songIDs]);
          props.setPlayerSongData([...songData]);
          props.setCurrentSongIndex(0);
        }
      });
    });
  };

  const queuePlaylist = () => {
    let songData = [];
    props.playlistData.songIDs.map(async (songID) => {
      await props.firebase.firestoreGetDoc("songs", songID).then((doc) => {
        let data = doc.data();
        songData = [...songData, data];
        if (songData.length === props.playlistData.songIDs.length) {
          props.setPlayerSongIDs([
            ...props.playerSongIDs,
            ...props.playlistData.songIDs,
          ]);
          props.setPlayerSongData([...props.playerSongData, ...songData]);
        }
      });
    });
  };

  const removePlaylist = async () => {
    let user = props.userData;
    let playlist = props.playlistData;

    let savedPlaylistIDs = [];
    user.savedPlaylistIDs.map((playlistID) => {
      if (playlistID !== props.playlistID) {
        savedPlaylistIDs = [...savedPlaylistIDs, playlistID];
      }
    });
    user.savedPlaylistIDs = savedPlaylistIDs;
    playlist.saveCount--;

    await props.firebase
      .firestoreSet("users", props.userID, user)
      .catch((error) => {
        alert(error);
      });

    await props.firebase
      .firestoreSet("playlists", props.playlistID, playlist)
      .catch((error) => {
        alert(error);
      });

    props.setUserData(user);
  };

  return (
    <Paper
      elevation={3}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "0px",
        overflow: "auto",
        overflowY: "hidden",
        backgroundImage: `linear-gradient(to right, ${props.playlistData.themeLight}, ${props.playlistData.themeDark})`,
      }}
    >
      <Grid
        container
        alignItems="center"
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          paddingRight: "1.25vw",
        }}
      >
        <Grid item style={{ height: "100%", width: "10vh" }}>
          <Paper
            style={{
              borderRadius: "0px",
              width: "100%",
              height: "100%",
              backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/playlistImages/${url})`,
              backgroundSize: "100% 100%",
            }}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Playlist"} placement="top" arrow>
            <QueueMusic style={{ color: "white" }} />
          </Tooltip>
        </Grid>
        <Grid
          item
          xs
          style={{ overflow: "auto", marginLeft: "1.25vw", maxHeight: "7.5vh" }}
          className={styles.scrollbars}
        >
          <Typography
            variant="subtitle1"
            style={{
              color: "white",
            }}
          >
            {props.playlistData.playlistName}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Creator of playlist"} placement="top" arrow>
            <Person style={{ color: "white" }} />
          </Tooltip>
        </Grid>
        <Grid
          item
          xs
          style={{ overflow: "auto", marginLeft: "1.25vw", maxHeight: "7.5vh" }}
          className={styles.scrollbars}
        >
          <Typography
            variant="subtitle1"
            style={{
              color: "white",
            }}
          >
            {props.playlistData.userName}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Number of tracks"} placement="top" arrow>
            <MusicNote style={{ color: "white" }} />
          </Tooltip>
        </Grid>
        <Grid
          item
          xs
          style={{ overflow: "auto", marginLeft: "1.25vw", maxHeight: "7.5vh" }}
          className={styles.scrollbars}
        >
          <Typography
            variant="subtitle1"
            style={{
              color: "white",
            }}
          >
            {props.playlistData.songIDs.length}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={PlaylistPlay}
            onClick={playPlaylist}
            tooltip={"Play playlist"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={PlaylistAdd}
            onClick={queuePlaylist}
            tooltip={"Add playlist to player queue"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={QueueMusic}
            onClick={() => {
              props.setCurrentPlaylistID(null);
              props.setCurrentPlaylistData(null);
              pushHistory(routes.PLAYLIST, `?pid=${props.playlistID}`);
            }}
            tooltip={"Go to playlist display page"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={Clear}
            onClick={removePlaylist}
            tooltip={"Remove playlist from your library"}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const LibraryPlaylistListingComposed = compose(withFirebase)(
  LibraryPlaylistListingBase
);

export default function LibraryPlaylistListing(props) {
  return <LibraryPlaylistListingComposed {...props} />;
}
