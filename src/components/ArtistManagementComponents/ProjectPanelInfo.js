import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import TextIconButton from "../MiscComponents/TextIconButton";
import { useStyles } from "../../constants/styling";

const ProjectPanelInfo = (props) => {
  const styles = useStyles();

  const url =
    props.artistData.imageVersion === 0
      ? props.artistID
      : `${props.artistID}_${props.artistData.imageVersion - 1}`;

  const [uploadState, setUploadState] = useState(null);

  useEffect(() => {
    if (
      props.uploadIndex !== null &&
      props.uploadIndex === props.index &&
      props.uploadProgress !== null &&
      props.uploadCount !== null &&
      props.uploadProgress < props.uploadCount
    ) {
      setUploadState((props.uploadProgress + 1.0) / props.uploadCount);
    } 
    
    if (props.uploadProgress === props.uploadCount) {
      setUploadState(null);
    }
  });

  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-between"
      alignItems="center"
      style={{
        opacity: props.locked ? 0.5 : 1,
        width: "100%",
        paddingLeft: props.active ? "1.25vw" : null,
      }}
    >
      <Grid
        item
        xs
        style={{ overflow: "auto", height: "100%", marginRight: "1.25vw" }}
      >
        <Grid
          container
          justify="flex-start"
          alignItems="center"
          style={{ width: "100%", height: "100%" }}
          wrap="nowrap"
        >
          <Grid
            item
            style={{ width: "10vh", height: "10vh", marginRight: "1.25vw" }}
          >
            <Paper
              elevation={3}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "0px",
                backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/artistImages/${url})`,
                backgroundSize: "100% 100%",
              }}
            />
          </Grid>
          <Grid
            className={styles.scrollbars}
            item
            xs
            style={{
              overflow: "auto",
              maxHeight: "7.5vh",
              maxWidth: "calc(42.5vw - 20vh)",
            }}
          >
            <Typography
              variant="h6"
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              {props.artistData.name}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {props.expanded && !props.locked && (
        <Grid
          item
          style={{
            height: "5vh",
            width: "10vw",
            marginRight: "1.25vw",
          }}
        >
          <TextIconButton
            onClick={props.buttonFunction}
            onMouseEnter={() => props.setHovered(true)}
            onMouseLeave={() => props.setHovered(null)}
            text={"New Project"}
            icon={Add}
            stretch
            tooltip={`Create a new project for ${props.artist}`}
          />
        </Grid>
      )}
      {uploadState && (
        <Grid item style={{ marginRight: "1.25vw" }}>
          <Tooltip
            title={
              "Your project is being uploaded. Please do not leave this page..."
            }
            placement={"top"}
            arrow
          >
            <CircularProgress
              variant="indeterminate"
              style={{ width: "7.5vh", height: "7.5vh", color: "white" }}
            />
          </Tooltip>
          <Box
            position="absolute"
            alignItems="center"
            justifyContent="center"
            display="flex"
            right={"0.625vw"}
            top={0}
            bottom={0}
            style={{ height: "10vh", width: "10vh" }}
          >
            <Typography
              variant="caption"
              style={{ color: "white" }}
              component="div"
            >{`${props.uploadProgress + 1}/${props.uploadCount}`}</Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ProjectPanelInfo;
