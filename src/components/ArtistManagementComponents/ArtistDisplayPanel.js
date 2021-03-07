import React from "react";
import { Paper, Grid, Typography, Tooltip } from "@material-ui/core";
import { artistIcons } from "../../constants/icons";
import { useStyles } from "../../constants/styling";

const ArtistDisplayPanel = (props) => {
  const styles = useStyles();

  const url =
    props.userArtistData[props.currentArtistIndex].imageVersion === 0
      ? props.userArtistIDs[props.currentArtistIndex]
      : `${props.userArtistIDs[props.currentArtistIndex]}_${
          props.userArtistData[props.currentArtistIndex].imageVersion - 1
        }`;

  const mapData = [
    props.userArtistData[props.currentArtistIndex].name,
    props.userArtistData[props.currentArtistIndex].projectIDs.length,
    props.userArtistData[props.currentArtistIndex].playCount,
    props.userArtistData[props.currentArtistIndex].likeCount,
    props.userArtistData[props.currentArtistIndex].followCount,
  ];

  const tooltips = [
    "Artist name",
    "Number of projects in discography",
    "Total number of discography song plays",
    "Total number of discography song likes",
    "Total number of followers",
  ];

  return (
    <Paper
      elevation={3}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        backgroundImage:
          props.currentArtistIndex !== null
            ? `linear-gradient(to right, ${
                props.userArtistData[props.currentArtistIndex].themeLight
              }, ${props.userArtistData[props.currentArtistIndex].themeDark})`
            : "linear-gradient(to right, mediumvioletred, blueviolet)",
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="space-between"
        style={{
          width: "100%",
          height: "100%",
          paddingLeft: "1.25vw",
          paddingRight: "1.25vw",
          paddingBottom: "1.25vh",
          paddingTop: "2.5vh",
        }}
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
              backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/artistImages/${url})`,
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
            {artistIcons.map((icon, index) => {
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
                      <Tooltip title={tooltips[index]} placement="top" arrow>
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
    </Paper>
  );
};

export default ArtistDisplayPanel;
