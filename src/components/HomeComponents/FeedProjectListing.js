import React from "react";
import { Grid, Paper, Tooltip, Typography } from "@material-ui/core";
import {
  Album,
  ArrowForward,
  Bookmark,
  CalendarToday,
  Category,
  Mic,
  MusicNote,
  PlayArrow,
  ThumbUpAlt,
} from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { customDateFormat, pushHistory } from "../../constants/utils";
import TextIconButton from "../MiscComponents/TextIconButton";
import { useStyles } from "../../constants/styling";

const FeedProjectListingBase = (props) => {
  const styles = useStyles();

  const url =
    props.projectData.imageVersion === 0
      ? props.projectID
      : `${props.projectID}_${props.projectData.imageVersion - 1}`;

  const date = customDateFormat(
    new Date(props.projectData.debutDate.seconds * 1000),
    "#DD#/#MM#/#YYYY#"
  );

  const textListing = (height, text) => {
    return (
      <Grid
        item
        style={{
          height: height,
        }}
      >
        <Grid
          container
          alignItems="center"
          style={{
            height: "100%",
          }}
        >
          <Grid
            item
            style={{
              paddingRight: "1.25vw",
              overflow: "auto",
              maxHeight: "7.5vh",
              maxWidth: "calc(15vw - 5vh)",
            }}
            className={styles.scrollbars}
          >
            <Typography
              variant="subtitle1"
              style={{ color: "white", }}
            >
              {text}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const listingIcon = (height, icon, tooltip) => {
    let Icon = icon;
    return (
      <Grid
        item
        style={{
          height: height,
          width: "100%",
        }}
      >
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Grid item>
            <Tooltip title={tooltip} placement="top" arrow>
              <Icon style={{ color: "white" }} />
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Paper
      elevation={3}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        backgroundImage: `linear-gradient(to left, ${props.projectData.themeDark}, ${props.projectData.themeLight})`,
      }}
    >
      <Grid
        container
        style={{ width: "100%", height: "100%", paddingRight: "1.25vw" }}
      >
        <Grid item style={{ height: "100%", width: "17.5vh" }}>
          <Paper
            elevation={0}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "0px",
              backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${props.projectData.artistID}/${url})`,
              backgroundSize: "cover",
            }}
          />
        </Grid>
        <Grid item xs style={{ height: "100%" }}>
          <Grid
            container
            style={{
              width: "100%",
              height: "100%",
              paddingTop: "1.25vh",
              paddingBottom: "1.25vh",
            }}
          >
            <Grid
              item
              style={{ height: "100%", width: "5vh", marginLeft: "1.25vw" }}
            >
              <Grid
                container
                direction="column"
                style={{ height: "100%", width: "100%" }}
              >
                {listingIcon("7.5vh", Album, "Project title")}
                {listingIcon("7.5vh", Mic, "Artist")}
              </Grid>
            </Grid>
            <Grid
              item
              xs
              style={{
                height: "100%",
                marginLeft: "1.25vw",
              }}
            >
              <Grid
                container
                direction="column"
                style={{ height: "100%", width: "100%" }}
              >
                {textListing("7.5vh", props.projectData.title)}
                {textListing("7.5vh", props.projectData.artist)}
              </Grid>
            </Grid>
            <Grid
              item
              style={{ height: "100%", width: "5vh", marginLeft: "1.25vw" }}
            >
              <Grid
                container
                direction="column"
                alignItems="center"
                style={{ height: "100%", width: "100%" }}
              >
                {listingIcon("5vh", CalendarToday, "Release date", "default")}
                {listingIcon("5vh", MusicNote, "Number of tracks", "default")}
                {listingIcon("5vh", Category, "Type of release", "default")}
              </Grid>
            </Grid>
            <Grid
              item
              xs
              style={{
                height: "100%",
                marginLeft: "1.25vw",
                overflowX: "hidden",
                overflow: "auto",
              }}
            >
              <Grid
                container
                direction="column"
                style={{ height: "100%", width: "100%" }}
              >
                {textListing("5vh", date)}
                {textListing("5vh", props.projectData.songIDs.length)}
                {textListing("5vh", props.projectData.releaseType)}
              </Grid>
            </Grid>
            <Grid
              item
              style={{ height: "100%", width: "5vh", marginLeft: "1.25vw" }}
            >
              <Grid
                container
                direction="column"
                alignItems="center"
                style={{ height: "100%", width: "100%" }}
              >
                {listingIcon(
                  "5vh",
                  PlayArrow,
                  "Number of times played",
                  "default"
                )}
                {listingIcon("5vh", ThumbUpAlt, "Number of likes")}
                {listingIcon("5vh", Bookmark, "Number of times bookmarked")}
              </Grid>
            </Grid>
            <Grid
              item
              xs
              style={{
                height: "100%",
                marginLeft: "1.25vw",
                overflowX: "hidden",
                overflow: "auto",
              }}
            >
              <Grid
                container
                direction="column"
                style={{ height: "100%", width: "100%" }}
              >
                {textListing("5vh", props.projectData.playCount)}
                {textListing("5vh", props.projectData.likeCount)}
                {textListing("5vh", props.projectData.bookmarkCount)}
              </Grid>
            </Grid>
            <Grid
              item
              style={{
                height: "100%",
                marginLeft: "1.25vw",
                marginTop: "1.25vh",
              }}
            >
              <Grid container direction="column" style={{ height: "100%" }}>
                <Grid
                  item
                  style={{
                    height: "5vh",
                    width: "12.5vw",
                    marginBottom: "2.5vh",
                  }}
                >
                  <TextIconButton
                    stretch
                    icon={ArrowForward}
                    text={"go to project"}
                    tooltip={"Go to this project's display page"}
                    onClick={() => {
                      props.setCurrentProjectID(null);
                      props.setCurrentProjectData(null);
                      pushHistory(
                        routes.PROJECT,
                        `?aid=${props.projectData.artistID}&pid=${props.projectID}`
                      );
                    }}
                  />
                </Grid>
                <Grid item style={{ height: "5vh", width: "12.5vw" }}>
                  <TextIconButton
                    stretch
                    icon={ArrowForward}
                    text={"go to artist"}
                    tooltip={"Go to the display page of this project's artist"}
                    onClick={() => {
                      props.setCurrentArtistID(null);
                      props.setCurrentArtistData(null);
                      props.setCurrentArtistTrackIDs(null);
                      props.setCurrentArtistTrackData(null);
                      pushHistory(
                        routes.ARTIST_DISPLAY,
                        `?aid=${props.projectData.artistID}`
                      );
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const FeedProjectListingComposed = compose(withFirebase)(
  FeedProjectListingBase
);

export default function FeedProjectListing(props) {
  return <FeedProjectListingComposed {...props} />;
}
