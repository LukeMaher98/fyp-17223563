import React from "react";
import { Grid, Paper, Tooltip, Typography } from "@material-ui/core";
import { CalendarToday, Edit, MusicNote, QueueMusic } from "@material-ui/icons";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { customDateFormat, pushHistory } from "../../constants/utils";
import * as routes from "../../constants/routes";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { useStyles } from "../../constants/styling";

const PlaylistHeadingBase = (props) => {
  const styles = useStyles();

  const url =
    props.playlistData.imageVersion === 0
      ? props.playlistID
      : `${props.playlistID}_${props.playlistData.imageVersion - 1}`;

  const date = customDateFormat(
    new Date(props.playlistData.debutDate.seconds * 1000),
    "#DD#/#MM#/#YYYY#"
  );

  return (
    <Paper
      elevation={3}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        backgroundImage: `linear-gradient(to right, ${props.playlistData.themeLight}, ${props.playlistData.themeDark})`,
      }}
    >
      <Grid
        container
        alignItems="center"
        style={{ width: "100%", height: "100%", paddingRight: "1.25vw" }}
      >
        <Grid item style={{ height: "100%", width: "10vh" }}>
          <Paper
            elevation={0}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "0px",
              backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/playlistImages/${url})`,
              backgroundSize: "100% 100%",
            }}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Playlist name"} placement="top" arrow>
            <QueueMusic style={{ color: "white" }} />
          </Tooltip>
        </Grid>
        <Grid
          item
          xs
          style={{ overflow: "auto", marginLeft: "1.25vw", maxHeight: "7.5vh" }}
          className={styles.scrollbars}
        >
          <Typography variant="subtitle1" style={{ color: "white" }}>
            {props.playlistData.playlistName}
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
          <Typography variant="subtitle1" style={{ color: "white" }}>
            {props.playlistData.songIDs.length}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Creation date"} placement="top" arrow>
            <CalendarToday style={{ color: "white" }} />
          </Tooltip>
        </Grid>
        <Grid
          item
          xs
          style={{ overflow: "auto", marginLeft: "1.25vw", maxHeight: "7.5vh" }}
          className={styles.scrollbars}
        >
          <Typography variant="subtitle1" style={{ color: "white" }}>
            {date}
          </Typography>
        </Grid>
        <Grid item style={{ width: "calc(10vh + 2.5vw)" }} />
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={QueueMusic}
            onClick={() => {
              props.setCurrentPlaylistData(null);
              props.setCurrentPlaylistID(null);
              pushHistory(routes.PLAYLIST, `?pid=${props.playlistID}`);
            }}
            tooltip={"Go to playlist display page"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={Edit}
            onClick={() => {
              props.setPlaylistState(0);
            }}
            tooltip={"Edit playlist details"}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const PlaylistHeadingComposed = compose(withFirebase)(PlaylistHeadingBase);

export default function PlaylistHeading(props) {
  return <PlaylistHeadingComposed {...props} />;
}
