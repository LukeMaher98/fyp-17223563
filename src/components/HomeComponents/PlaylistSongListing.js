import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Tooltip } from "@material-ui/core";
import {
  Album,
  Clear,
  Mic,
  MusicNote,
  PlayArrow,
  PlaylistPlay,
} from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { pushHistory } from "../../constants/utils";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { useStyles } from "../../constants/styling";

const PlaylistSongListingBase = (props) => {
  const styles = useStyles();

  const [songProjectData, setSongProjectData] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const getListingData = async () => {
      await props.firebase
        .firestoreGetDoc("projects", props.songData.projectID)
        .then((doc) => {
          let data = doc.data();
          setSongProjectData(data);
          setUrl(
            data.imageVersion === 0
              ? props.songData.projectID
              : `${props.songData.projectID}_${data.imageVersion - 1}`
          );
        });
    };

    getListingData();
  }, []);

  const removeSong = async () => {
    let playlistData = props.playlistData;
    let createdPlaylistData = props.createdPlaylistData;

    playlistData.followCount -= 1;

    let playlistSongIDs = [];
    let playlistGenres = [];
    playlistData.songIDs.map((songID, index) => {
      if (songID !== props.songID) {
        playlistSongIDs = [songID, ...playlistSongIDs];
        props.currentPlaylistSongData[index].genres.map((genre) => {
          if (!playlistGenres.includes(genre)) {
            playlistGenres = [...playlistGenres, genre];
          }
        });
      }
    });
    playlistData.songIDs = playlistSongIDs;
    playlistData.genres = playlistGenres;

    await props.firebase
      .firestoreSet("playlists", props.playlistID, playlistData)
      .catch((error) => {
        alert("An error occured");
      });

    props.createdPlaylistIDs.map((playlistID, index) => {
      if (playlistID === props.playlistID) {
        createdPlaylistData[index] = playlistData;
      }
    });

    props.setCreatedPlaylistData(createdPlaylistData);
    props.setCurrentPlaylistSongIDs(playlistSongIDs);
    props.setCurrentPlaylistSongData(null);
  };

  const playSong = (index) => {
    props.setCurrentSongIndex(null);
    props.setPlayerSongIDs([...props.currentPlaylistSongIDs]);
    props.setPlayerSongData([...props.currentPlaylistSongData]);
    props.setCurrentSongIndex(index ? index : 0);
  };

  const queueSong = () => {
    props.setPlayerSongIDs([...props.playerSongIDs, props.songID]);
    props.setPlayerSongData([...props.playerSongData, props.songData]);
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
        opacity: songProjectData ? 1 : 0,
        backgroundImage:
          songProjectData &&
          `linear-gradient(to right, ${songProjectData.themeLight}, ${songProjectData.themeDark})`,
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
              backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${props.songData.artistID}/${url})`,
              backgroundSize: "100% 100%",
            }}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Song title"} placement="top" arrow>
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
            {props.songData.title}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Project title"} placement="top" arrow>
            <Album style={{ color: "white" }} />
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
            {props.songData.project}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Artist"} placement="top" arrow>
            <Mic style={{ color: "white" }} />
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
            {props.songData.artist}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={PlayArrow}
            onClick={() => playSong(props.index)}
            tooltip={"Play song"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={PlaylistPlay}
            onClick={queueSong}
            tooltip={"Add song to player queue"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={Album}
            onClick={() => {
              playSong();
              props.setCurrentProjectID(null);
              props.setCurrentProjectData(null);
              pushHistory(
                routes.PROJECT,
                `?aid=${props.songData.artistID}&pid=${props.songData.projectID}`
              );
            }}
            tooltip={"Go to this song's project display page"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={Clear}
            onClick={removeSong}
            tooltip={"Remove song from this playlist"}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const PlaylistSongListingComposed = compose(withFirebase)(
  PlaylistSongListingBase
);

export default function PlaylistSongListing(props) {
  return <PlaylistSongListingComposed {...props} />;
}
