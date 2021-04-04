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

const LibrarySongListingBase = (props) => {
  const styles = useStyles();

  const [songProjectData, setSongProjectData] = useState(null);
  const [songArtistData, setSongArtistData] = useState(null);
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
        })
        .catch((error) => {
          alert(error);
        });

      await props.firebase
        .firestoreGetDoc("artists", props.songData.artistID)
        .then((doc) => {
          let data = doc.data();
          setSongArtistData(data);
        })
        .catch((error) => {
          alert(error);
        });
    };

    getListingData();
  }, []);

  const removeSong = async () => {
    let song = props.songData;
    let project = songProjectData;
    let artist = songArtistData;
    let user = props.userData;

    let likedSongIDs = [];
    user.likedSongIDs.map((songID) => {
      if (songID !== props.likedSongIDs[props.index]) {
        likedSongIDs = [songID, ...likedSongIDs];
      }
    });
    user.likedSongIDs = likedSongIDs;
    song.likeCount--;
    project.likeCount--;
    artist.likeCount--;

    await props.firebase
      .firestoreSet("users", props.userID, user)
      .catch((error) => {
        alert(error);
      });

    await props.firebase
      .firestoreSet("artists", props.songData.artistID, artist)
      .catch((error) => {
        alert(error);
      });

    await props.firebase
      .firestoreSet("projects", props.songData.projectID, project)
      .catch((error) => {
        alert(error);
      });

    await props.firebase
      .firestoreSet("songs", props.likedSongIDs[props.index], song)
      .catch((error) => {
        alert(error);
      });

    props.setUserData(user);
    props.setLikedSongIDs(null);
  };

  const playSong = () => {
    props.setCurrentSongIndex(null);
    props.setPlayerSongIDs([props.likedSongIDs[props.index]]);
    props.setPlayerSongData([props.likedSongData[props.index]]);
    props.setCurrentSongIndex(0);
  };

  const queueSong = () => {
    props.setPlayerSongIDs([
      ...props.playerSongIDs,
      props.likedSongIDs[props.index],
    ]);
    props.setPlayerSongData([
      ...props.playerSongData,
      props.likedSongData[props.index],
    ]);
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
          `linear-gradient(to right, ${songProjectData.themeLight}, ${songProjectData.themeDark}`,
      }}
    >
      <Grid
        container
        alignItems="center"
        style={{
          width: "100%",
          height: "100%",
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
            onClick={playSong}
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
            tooltip={"Remove song from your library"}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const LibrarySongListingComposed = compose(withFirebase)(
  LibrarySongListingBase
);

export default function LibrarySongListing(props) {
  return <LibrarySongListingComposed {...props} />;
}
