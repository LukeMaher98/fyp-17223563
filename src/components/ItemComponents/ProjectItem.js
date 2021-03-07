import React from "react";
import {
  Grid,
  IconButton,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { Album } from "@material-ui/icons";

const ProjectItem = (props) => {
  const url =
    props.projectData.imageVersion === 0
      ? props.projectID
      : `${props.projectID}_${props.projectData.imageVersion - 1}`;

  return (
    <Paper
      onClick={() => props.itemFunction(props.index)}
      onMouseEnter={() => props.setHovered(props.index)}
      onMouseLeave={() => props.setHovered(null)}
      elevation={3}
      style={{
        width: props.dims ? props.dims : "10vw",
        height: props.dims ? props.dims : "10vw",
        borderRadius: "0px",
        backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${props.artistID}/${url})`,
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
            title={`${props.projectData && props.projectData.artist} - ${
              props.projectData && props.projectData.title
            }`}
            placement={"top"}
            arrow
            open={props.hovered === props.index}
          >
            <IconButton
              disabled={true}
              size="small"
              style={{ backgroundColor: "rgb(0,0,0,0.5)" }}
            >
              <Album style={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProjectItem;
