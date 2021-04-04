import React from "react";
import {
  Grid,
  IconButton,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { Mic } from "@material-ui/icons";

const ArtistItem = (props) => {
  const url =
    props.artistData.imageVersion === 0
      ? props.artistID
      : `${props.artistID}_${props.artistData.imageVersion - 1}`;

  return (
    <Grid
      item
      style={{
        marginLeft: props.index > 0 ? "1.25vw" : null,
      }}
    >
      <Paper
        onClick={() => props.itemFunction(props.index)}
        onMouseEnter={() => props.setHovered(props.index)}
        onMouseLeave={() => props.setHovered(null)}
        elevation={3}
        style={{
          width: "10vw",
          height: "10vw",
          borderRadius: "0px",
          backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/artistImages/${url})`,
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
              title={props.artistData && props.artistData.name}
              placement={"top"}
              arrow
              open={props.hovered === props.index}
            >
              <IconButton
                disabled={true}
                size="small"
                style={{ backgroundColor: "rgb(0,0,0,0.5)" }}
              >
                <Mic style={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ArtistItem;
