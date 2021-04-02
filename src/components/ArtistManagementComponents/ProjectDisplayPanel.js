import React from "react";
import { Grid, Paper, Typography, Tooltip } from "@material-ui/core";
import { projectIcons } from "../../constants/icons";
import { customDateFormat } from "../../constants/utils";
import {
  Clear,
  Edit,
  MusicNote,
  PlayArrow,
  ThumbUpAlt,
} from "@material-ui/icons";
import TextIconButton from "../MiscComponents/TextIconButton";
import NumericLabel from "react-pretty-numbers";
import { useStyles } from "../../constants/styling";

const ProjectView = (props) => {
  const styles = useStyles();

  const url =
    props.artistProjectData[props.currentProjectIndex].imageVersion === 0
      ? props.artistProjectIDs[props.currentProjectIndex]
      : `${props.artistProjectIDs[props.currentProjectIndex]}_${
        props.artistProjectData[props.currentProjectIndex].imageVersion - 1
        }`;

  const mapData = [
    props.artistProjectData[props.currentProjectIndex].title,
    customDateFormat(
      new Date(
        props.artistProjectData[props.currentProjectIndex].debutDate.seconds *
          1000
      ),
      "#DD#/#MM#/#YYYY# #hh#:#mm#"
    ),
    props.artistProjectData[props.currentProjectIndex].playCount,
    props.artistProjectData[props.currentProjectIndex].likeCount,
    props.artistProjectData[props.currentProjectIndex].bookmarkCount,
  ];

  const tooltips = [
    "Project title",
    "Project release date",
    "Total number of project song plays",
    "Total number of project song likes",
    "Total number of times bookmarked",
  ];

  return (
    <Paper
      elevation={3}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        backgroundImage: `linear-gradient(to bottom, ${
          props.artistProjectData[props.currentProjectIndex].themeLight
        }, ${props.artistProjectData[props.currentProjectIndex].themeDark})`,
      }}
    >
      <Grid
        container
        style={{
          width: "100%",
          height: "100%",
          paddingLeft: "1.25vw",
          paddingRight: "1.25vw",
          paddingTop: "2.5vh",
        }}
      >
        <Grid
          item
          style={{
            width: "13.75vw",
            marginRight: "1.25vw",
            height: "100%",
            paddingBottom: "1.25vh",
          }}
        >
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="space-between"
            style={{ width: "100%", height: "100%" }}
          >
            <Grid
              item
              style={{
                width: "13.75vw",
                height: "13.75vw",
                marginBottom: "1.25vh",
              }}
            >
              <Paper
                elevation={3}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0px",
                  backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${
                    props.userArtistIDs[props.currentArtistIndex]
                  }/${url})`,
                  backgroundSize: "100% 100%",
                }}
              />
            </Grid>
            <Grid
              item
              xs
              style={{
                width: "100%",
              }}
            >
              <Grid
                container
                direction="column"
                justify="space-between"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {projectIcons.map((icon, index) => {
                  let Icon = icon;
                  return (
                    <Grid
                      item
                      xs
                      style={{
                        width: "100%",
                      }}
                    >
                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                        style={{ width: "100%", height: "100%" }}
                        wrap="nowrap"
                      >
                        <Grid item style={{ marginRight: "1.25vw" }}>
                          <Tooltip
                            title={tooltips[index]}
                            placement="top"
                            arrow
                          >
                            <Icon style={{ color: "white" }} />
                          </Tooltip>
                        </Grid>
                        <Grid
                          item
                          style={{
                            overflow: "auto",
                          }}
                        >
                          <Typography
                            className={styles.scrollbars}
                            variant="subtitle1"
                            style={{
                              color: "white",
                              overflow: "auto",
                              maxHeight: "10vh",
                            }}
                          >
                            {mapData[index]}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs
          style={{
            height: "100%",
            paddingLeft: "1.25vw",
            paddingBottom: "2.5vh",
          }}
        >
          <Grid
            container
            direction="column"
            style={{ width: "100%", height: "100%" }}
          >
            <Grid item xs style={{ width: "100%", marginBottom: "2.5vh" }}>
              <Paper
                elevation={3}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0px",
                  backgroundImage: `linear-gradient(to bottom, ${
                    props.artistProjectData[props.currentProjectIndex]
                      .themeLight
                  }, ${
                    props.artistProjectData[props.currentProjectIndex].themeDark
                  })`,
                }}
              >
                <Grid
                  className={styles.scrollbars}
                  container
                  direction="column"
                  wrap="nowrap"
                  style={{ width: "100%", height: "100%", overflow: "auto" }}
                >
                  {props.projectSongData &&
                    props.projectSongData.map((track, index) => {
                      return (
                        <Grid item style={{ width: "100%", height: "10vh" }}>
                          <Paper
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: "0px",
                              backgroundImage: `linear-gradient(to right, ${
                                props.artistProjectData[
                                  props.currentProjectIndex
                                ].themeLight
                              }, ${
                                props.artistProjectData[
                                  props.currentProjectIndex
                                ].themeDark
                              })`,
                              overflow: "hidden",
                            }}
                          >
                            <Grid
                              container
                              alignItems="center"
                              style={{
                                width: "100%",
                                overflow: "auto",
                                paddingRight: "1.25vw",
                              }}
                            >
                              <Grid
                                item
                                style={{ height: "10vh", width: "10vh" }}
                              >
                                <Paper
                                  elevation={3}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "0px",
                                    backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${
                                      props.userArtistIDs[
                                        props.currentArtistIndex
                                      ]
                                    }/${url})`,
                                    backgroundSize: "100% 100%",
                                  }}
                                />
                              </Grid>
                              <Grid item style={{ marginLeft: "1.25vw" }}>
                                <Tooltip
                                  title={"Song title"}
                                  placement="top"
                                  arrow
                                >
                                  <MusicNote style={{ color: "white" }} />
                                </Tooltip>
                              </Grid>
                              <Grid
                                className={styles.scrollbars}
                                item
                                xs
                                style={{
                                  marginLeft: "1.25vw",
                                  overflow: "auto",
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  style={{
                                    color: "white",
                                  }}
                                >
                                  {track.title}
                                </Typography>
                              </Grid>
                              <Grid item style={{ marginLeft: "1.25vw" }}>
                                <Tooltip
                                  title={"Total number of times played"}
                                  placement="top"
                                  arrow
                                >
                                  <PlayArrow style={{ color: "white" }} />
                                </Tooltip>
                              </Grid>
                              <Grid
                                item
                                style={{
                                  marginLeft: "1.25vw",
                                  width: "2.5vw",
                                }}
                              >
                                <Grid
                                  container
                                  style={{ height: "100%", width: "100%" }}
                                  justify="center"
                                  alignItems="center"
                                >
                                  <Grid item>
                                    <Typography
                                      variant="subtitle1"
                                      style={{
                                        color: "white",
                                      }}
                                    >
                                      <NumericLabel
                                        params={{
                                          shortFormat: true,
                                          shortFormatMinValue: 10000,
                                        }}
                                      >
                                        {track.playCount}
                                      </NumericLabel>
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item style={{ marginLeft: "1.25vw" }}>
                                <Tooltip
                                  title={"Total number of song likes"}
                                  placement="top"
                                  arrow
                                >
                                  <ThumbUpAlt style={{ color: "white" }} />
                                </Tooltip>
                              </Grid>
                              <Grid
                                item
                                style={{
                                  marginLeft: "1.25vw",
                                  width: "2.5vw",
                                }}
                              >
                                <Grid
                                  container
                                  style={{ height: "100%", width: "100%" }}
                                  justify="center"
                                  alignItems="center"
                                >
                                  <Grid item>
                                    <Typography
                                      variant="subtitle1"
                                      style={{
                                        color: "white",
                                      }}
                                    >
                                      <NumericLabel
                                        params={{
                                          shortFormat: true,
                                          shortFormatMinValue: 10000,
                                        }}
                                      >
                                        {track.likeCount}
                                      </NumericLabel>
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      );
                    })}
                </Grid>
              </Paper>
            </Grid>
            <Grid
              item
              style={{
                width: "100%",
              }}
            >
              <Grid container justify="center" style={{ width: "100%" }}>
                <Grid
                  item
                  style={{
                    height: "5vh",
                    width: "10vw",
                    marginRight: "0.625vw",
                  }}
                >
                  <TextIconButton
                    onClick={props.setProjectFormOpen}
                    text={"Edit Project"}
                    icon={Edit}
                    stretch
                  />
                </Grid>
                <Grid
                  item
                  style={{
                    height: "5vh",
                    width: "10vw",
                    marginLeft: "0.625vw",
                  }}
                >
                  <TextIconButton
                    onClick={props.setProjectDisplayClosed}
                    text={"Close"}
                    icon={Clear}
                    stretch
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

export default ProjectView;
