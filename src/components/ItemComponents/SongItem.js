import React, { useEffect, useState } from "react";
import {
  Grid,
  IconButton,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { withFirebase } from "../../firebase";
import { compose } from "recompose";
import { MusicNote } from "@material-ui/icons";

const SongItemBase = (props) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (props.songData && props.songData.projectID && !url) {
      props.firebase
        .firestoreGetDoc("projects", props.songData.projectID)
        .then((doc) => {
          let data = doc.data();
          setUrl(
            data.imageVersion === 0
              ? props.songData.projectID
              : `${props.songData.projectID}_${data.imageVersion - 1}`
          );
        });
    }
  });

  return (
    <Grid
      item
      style={{
        marginBottom: props.marginBottom ? props.marginBottom : null,
        marginLeft: props.marginLeft ? "1.25vw" : null,
      }}
    >
      <Paper
        onClick={() => props.itemFunction(props.index)}
        onMouseEnter={() => props.setHovered(props.index)}
        onMouseLeave={() => props.setHovered(null)}
        elevation={3}
        style={{
          height: "10vw",
          width: "10vw",
          borderRadius: "0px",
          backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${props.songData.artistID}/${url})`,
          backgroundSize: "cover",
          cursor: "pointer",
        }}
      >
        <Grid
          container
          style={{
            width: "100%",
            height: "100%",
            paddingBottom: "1.25vh",
          }}
          justify="center"
          alignItems="flex-end"
        >
          <Grid item>
            <Tooltip
              title={`${props.songData && props.songData.artist} - ${
                props.songData && props.songData.title
              }`}
              placement={"top"}
              arrow
              open={props.hovered === props.index}
            >
              <IconButton disabled={true} size="small" style={{ backgroundColor: "rgb(0,0,0,0.5)" }}>
                <MusicNote style={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

const SongItemComposed = compose(withFirebase)(SongItemBase);

export default function SongItem(props) {
  return <SongItemComposed {...props} />;
}
