import React from "react";
import { Grid, Paper, Tooltip, Typography } from "@material-ui/core";
import { Bookmark, QueueMusic } from "@material-ui/icons";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import TextIconButton from "../MiscComponents/TextIconButton";
import { useStyles } from "../../constants/styling";

const PlaylistListingBase = (props) => {
  const styles = useStyles();

  const url =
    props.playlistData && props.playlistData.imageVersion === 0
      ? props.playlistID
      : `${props.playlistID}_${props.playlistData.imageVersion - 1}`;

  return (
    <Paper
      elevation={3}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        backgroundImage: `linear-gradient(to right, ${props.playlistData.themeLight}, ${props.playlistData.themeDark})`,
        backgroundSize: "100% 100%"
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
              backgroundSize: "cover",
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
          <Typography variant="h6" style={{ color: "white", fontWeight: "bold" }}>
            {props.playlistData.playlistName}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Grid container alignItems="center" style={{ height: "100%" }}>
            <Grid item style={{ height: "5vh", width: "12.5vw" }}>
              <TextIconButton
                stretch={true}
                icon={Bookmark}
                text={"Open Playlist"}
                onClick={() => {
                  props.setCurrentPlaylistSongIDs(null);
                  props.setCurrentPlaylistIndex(props.index);
                }}
                tooltip={"Open this playlist and manage its contents"}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const PlaylistListingComposed = compose(withFirebase)(PlaylistListingBase);

export default function PlaylistListing(props) {
  return <PlaylistListingComposed {...props} />;
}
