import React from "react";
import { Grid, Paper, Typography, Tooltip } from "@material-ui/core";
import {
  Album,
  CalendarToday,
  Clear,
  Mic,
  PlayCircleFilled,
  PlaylistPlay,
} from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { customDateFormat, pushHistory } from "../../constants/utils";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { useStyles } from "../../constants/styling";

const LibraryProjectListingBase = (props) => {
  const styles = useStyles();

  const url =
    props.projectData.imageVersion === 0
      ? props.bookmarkedProjectIDs[props.index]
      : `${props.bookmarkedProjectIDs[props.index]}_${
          props.projectData.imageVersion - 1
        }`;

  const date = customDateFormat(
    new Date(props.projectData.debutDate.seconds * 1000),
    "#DD#/#MM#/#YYYY#"
  );

  const playProject = () => {
    props.setCurrentSongIndex(null);
    let songData = [];
    props.bookmarkedProjectData[props.index].songIDs.map(async (songID) => {
      await props.firebase.firestoreGetDoc("songs", songID).then((doc) => {
        let data = doc.data();
        songData = [...songData, data];
        if (
          songData.length ===
          props.bookmarkedProjectData[props.index].songIDs.length
        ) {
          props.setPlayerSongIDs([
            ...props.bookmarkedProjectData[props.index].songIDs,
          ]);
          props.setPlayerSongData([...songData]);
          props.setCurrentSongIndex(0);
        }
      });
    });
  };

  const queueProject = () => {
    let songData = [];
    props.bookmarkedProjectData[props.index].songIDs.map(async (songID) => {
      await props.firebase.firestoreGetDoc("songs", songID).then((doc) => {
        let data = doc.data();
        songData = [...songData, data];
        if (
          songData.length ===
          props.bookmarkedProjectData[props.index].songIDs.length
        ) {
          props.setPlayerSongIDs([
            ...props.playerSongIDs,
            ...props.bookmarkedProjectData[props.index].songIDs,
          ]);
          props.setPlayerSongData([...props.playerSongData, ...songData]);
        }
      });
    });
  };

  const removeProject = async () => {
    let user = props.userData;

    let bookmarkedProjectIDs = [];
    user.bookmarkedProjectIDs.map((projectID) => {
      if (projectID !== props.bookmarkedProjectIDs[props.index]) {
        bookmarkedProjectIDs = [...bookmarkedProjectIDs, projectID];
      }
    });
    user.bookmarkedProjectIDs = bookmarkedProjectIDs;

    await props.firebase
      .firestoreSet("users", props.userID, user)
      .catch((error) => {
        alert("An error occured");
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
        backgroundImage: `linear-gradient(to right, ${props.projectData.themeLight}, ${props.projectData.themeDark})`,
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
              backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${props.projectData.artistID}/${url})`,
              backgroundSize: "cover",
            }}
          />
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
            {props.projectData.title}
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
            {props.projectData.artist}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Release date"} placement="top" arrow>
            <CalendarToday style={{ color: "white" }} />
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
            {date}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={PlayCircleFilled}
            onClick={playProject}
            tooltip={"Play project"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={PlaylistPlay}
            onClick={queueProject}
            tooltip={"Add project to player queue"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={Album}
            onClick={() => {
              props.setCurrentProjectID(null);
              props.setCurrentProjectData(null);
              pushHistory(
                routes.PROJECT,
                `?aid=${props.projectData.artistID}&pid=${
                  props.bookmarkedProjectIDs[props.index]
                }`
              );
            }}
            tooltip={"Go to project display page"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={Clear}
            onClick={removeProject}
            tooltip={"Remove project from your library"}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const LibraryProjectListingComposed = compose(withFirebase)(
  LibraryProjectListingBase
);

export default function LibraryProjectListing(props) {
  return <LibraryProjectListingComposed {...props} />;
}
