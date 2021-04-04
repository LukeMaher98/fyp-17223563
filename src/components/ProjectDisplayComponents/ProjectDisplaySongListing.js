import React, { useEffect, useState } from "react";
import { Typography, Grid, Paper, Tooltip } from "@material-ui/core";
import { withFirebase } from "../../firebase";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import {
  ExpandLess,
  ExpandMore,
  MusicNote,
  PlayArrow,
  PlaylistAdd,
  ThumbUpAlt,
  Timer,
} from "@material-ui/icons";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { useStyles } from "../../constants/styling";

const ProjectDisplaySongListingBase = (props) => {
  const styles = useStyles();

  const [url, setUrl] = useState(null);
  const [projectData, setProjectData] = useState(null);

  const duration = `${
    Math.ceil(props.songData.duration / 60) < 10 ? 0 : ""
  }${Math.floor(props.songData.duration / 60)}:${
    Math.ceil(props.songData.duration % 60) < 10 ? 0 : ""
  }${Math.ceil(props.songData.duration % 60)}`;

  useEffect(() => {
    const getListingData = async () => {
      await props.firebase
        .firestoreGetDoc("projects", props.songData.projectID)
        .then((doc) => {
          let data = doc.data();
          setProjectData(data);
          setUrl(
            data.imageVersion === 0
              ? props.songData.projectID
              : `${props.songData.projectID}_${data.imageVersion - 1}`
          );
        });
    };

    if (!url) {
      getListingData();
    }
  });

  const addToPlaylist = async (index) => {
    let updatedPlaylistData = props.createdPlaylistData;
    let playlistData = getPlaylistsToAddTo().data[index];
    let playlistID = getPlaylistsToAddTo().IDs[index];

    playlistData.songIDs = [props.songID, ...playlistData.songIDs];

    props.songData.genres.map((genre) => {
      if (!playlistData.genres.includes(genre)) {
        playlistData.genres = [...playlistData.genres, genre];
      }
    });

    props.createdPlaylistData.map((id, index) => {
      if (id === playlistID) {
        updatedPlaylistData[index] = playlistData;
      }
    });

    await props.firebase
      .firestoreSet("playlists", playlistID, playlistData)
      .catch((error) => {
        alert("An error occured");
      });

    props.setCreatedPlaylistData(updatedPlaylistData);
  };

  const getPlaylistsToAddTo = () => {
    if (!props.createdPlaylistIDs || !props.createdPlaylistData) {
      return { data: [], IDs: [] };
    }

    let playlistData = [];
    let playlistIDs = [];
    props.createdPlaylistData &&
      props.createdPlaylistIDs &&
      props.createdPlaylistData.map((data, index) => {
        if (!data.songIDs.includes(props.songID)) {
          playlistData = [data, ...playlistData];
          playlistIDs = [props.createdPlaylistIDs[index], ...playlistIDs];
        }
      });
    return { data: playlistData, IDs: playlistIDs };
  };

  const playlistSelector =
    getPlaylistsToAddTo().data[props.createdPlaylistIndex] &&
    getPlaylistsToAddTo().IDs[props.createdPlaylistIndex] &&
    props.createdPlaylistIndex !== null;

  let playlistUrl = playlistSelector
    ? getPlaylistsToAddTo().data[props.createdPlaylistIndex].imageVersion === 0
      ? getPlaylistsToAddTo().IDs[props.createdPlaylistIndex]
      : `${getPlaylistsToAddTo().IDs[props.createdPlaylistIndex]}_${
          getPlaylistsToAddTo().data[props.createdPlaylistIndex].imageVersion -
          1
        }`
    : null;

  return (
    <Grid item style={{ width: "100%", height: "10vh" }}>
      <Paper
        elevation={3}
        style={{
          opacity: projectData ? 1 : 0,
          height: "100%",
          width: "100%",
          borderRadius: "0px",
          backgroundImage: `linear-gradient(to right, ${
            projectData && projectData.themeLight
          }, ${projectData && projectData.themeDark})`,
        }}
      >
        <Grid
          container
          alignItems="center"
          style={{
            width: "100%",
            height: "100%",
            paddingRight: "1.25vw",
          }}
        >
          <Grid item style={{ height: "100%", width: "10vh" }}>
            <Paper
              style={{
                borderRadius: "0px",
                width: "100%",
                height: "100%",
                backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${props.songData.artistID}/${url})`,
                backgroundSize: "100% 100%",
              }}
            />
          </Grid>
          <Grid item style={{ marginLeft: "1.25vw" }}>
            <Tooltip title={"Song title"} placement="top" arrow>
              <MusicNote style={{ color: "white" }} />
            </Tooltip>
          </Grid>
          <Grid
            item
            xs
            style={{ overflow: "auto" }}
            className={styles.scrollbars}
          >
            <Typography
              variant="subtitle1"
              style={{
                color: "white",
                marginLeft: "1.25vw",
              }}
            >
              {props.songData.title}
            </Typography>
          </Grid>
          <Grid item style={{ marginLeft: "1.25vw" }}>
            <Tooltip title={"Song Duration"} placement="top" arrow>
              <Timer style={{ color: "white" }} />
            </Tooltip>
          </Grid>
          <Grid item style={{ marginLeft: "1.25vw" }}>
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ height: "100%", width: "100%" }}
            >
              <Grid item>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: "white",
                  }}
                >
                  {duration}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ marginLeft: "1.25vw" }}>
            <SimpleIconButton
              icon={PlayArrow}
              onClick={props.playSong}
              tooltip={`Song played ${props.songData.playCount} times`}
            />
          </Grid>
          <Grid item style={{ marginLeft: "1.25vw" }}>
            <SimpleIconButton
              icon={ThumbUpAlt}
              onClick={props.likeSong}
              tooltip={`Song liked ${props.songData.likeCount} times`}
              condition={props.userData.likedSongIDs.includes(props.songID)}
            />
          </Grid>
          <Grid item style={{ marginLeft: "1.25vw" }}>
            <SimpleIconButton
              icon={PlaylistAdd}
              onClick={() => {
                if (!props.playlists) {
                  props.setPlaylists(props.index);
                  props.setCreatedPlaylistIndex(0);
                } else {
                  props.setPlaylists(null);
                  props.setCreatedPlaylistIndex(null);
                }
              }}
              disabled={getPlaylistsToAddTo().data.length < 1}
              condition={
                props.playlists && getPlaylistsToAddTo().data.length > 0
              }
              tooltip={"Add this song to one of your created playlists"}
            />
          </Grid>
          {props.playlists && playlistSelector && (
            <Grid item style={{ marginLeft: "1.25vw" }}>
              <SimpleIconButton
                icon={ExpandLess}
                onClick={() =>
                  props.setCreatedPlaylistIndex(props.createdPlaylistIndex - 1)
                }
                disabled={props.createdPlaylistIndex === 0}
                tooltip={"Previous playlist"}
              />
            </Grid>
          )}
          {props.playlists && playlistSelector && (
            <Tooltip
              title={"Add song to this playlist"}
              placement={"top"}
              arrow
            >
              <Grid
                item
                style={{
                  width: "15vw",
                  marginLeft: "1.25vw",
                  height: "5vh",
                }}
              >
                <Paper
                  elevation={3}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "0px",
                    cursor: "pointer",
                    backgroundImage: `linear-gradient(to right, ${
                      getPlaylistsToAddTo().data[props.createdPlaylistIndex]
                        .themeLight
                    }, ${
                      getPlaylistsToAddTo().data[props.createdPlaylistIndex]
                        .themeDark
                    })`,
                  }}
                  onClick={() => {
                    addToPlaylist(props.createdPlaylistIndex);
                    props.setPlaylists(null);
                  }}
                >
                  <Grid
                    container
                    alignItems="center"
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <Grid
                      item
                      style={{
                        height: "100%",
                        width: "5vh",
                        marginRight: "1.25vw",
                      }}
                    >
                      <Paper
                        style={{
                          borderRadius: "0px",
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/playlistImages/${playlistUrl})`,
                          backgroundSize: "100% 100%",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs
                      className={styles.scrollbars}
                      style={{
                        overflow: "auto",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{
                          color: "white",
                        }}
                      >
                        {
                          getPlaylistsToAddTo().data[props.createdPlaylistIndex]
                            .playlistName
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Tooltip>
          )}
          {props.playlists && playlistSelector && (
            <Grid item style={{ marginLeft: "1.25vw" }}>
              <SimpleIconButton
                icon={ExpandMore}
                onClick={() =>
                  props.setCreatedPlaylistIndex(props.createdPlaylistIndex + 1)
                }
                disabled={
                  props.createdPlaylistIndex ===
                  getPlaylistsToAddTo().data.length - 1
                }
                tooltip={"Next playlist"}
              />
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
};

const ProjectDisplaySongListingComposed = compose(
  withRouter,
  withFirebase
)(ProjectDisplaySongListingBase);

export default function ProjectDisplaySongListing(props) {
  return <ProjectDisplaySongListingComposed {...props} />;
}
