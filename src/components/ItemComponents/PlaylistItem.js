import React from "react";
import {
  Grid,
  IconButton,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { QueueMusic } from "@material-ui/icons";

const PlaylistItem = (props) => {
  const url =
    props.playlistData && props.playlistData.imageVersion === 0
      ? props.playlistID
      : `${props.playlistID}_${props.playlistData.imageVersion - 1}`;

  return (
    <Paper
      onClick={() => props.itemFunction(props.index)}
      onMouseEnter={() => props.setHovered(props.index)}
      onMouseLeave={() => props.setHovered(null)}
      elevation={3}
      style={{
        width: "10vw",
        height: "10vw",
        borderRadius: "0px",
        backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/playlistImages/${url})`,
        backgroundSize: "100% 100%",
        cursor: "pointer",
      }}
    >
      <Grid
        container
        justify="center"
        alignItems="flex-end"
        style={{
          width: "100%",
          height: "100%",
          paddingBottom: "1.25vh",
        }}
      >
        <Grid item>
          <Tooltip
            title={props.playlistData && props.playlistData.playlistName}
            placement={"top"}
            arrow
            open={props.hovered === props.index}
          >
            <IconButton
              disabled={true}
              size="small"
              style={{ backgroundColor: "rgb(0,0,0,0.5)" }}
            >
              <QueueMusic style={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PlaylistItem;
