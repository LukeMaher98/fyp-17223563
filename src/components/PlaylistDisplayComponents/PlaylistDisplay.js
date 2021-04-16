import React, { useEffect, useState, createRef } from "react";
import {
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Button,
} from "@material-ui/core";
import {
  PlayArrow,
  Bookmark,
  MusicNote,
  Category,
  Link,
  FilterNone,
  QueueMusic,
  ExpandMore,
  ExpandLess,
  Assignment,
} from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { replaceHistory, pushHistory } from "../../constants/utils";
import TextIconButton from "../MiscComponents/TextIconButton";
import ProjectDisplaySongListing from "../ProjectDisplayComponents/ProjectDisplaySongListing";
import PlaylistItem from "../ItemComponents/PlaylistItem";
import NumericLabel from "react-pretty-numbers";
import { useStyles } from "../../constants/styling";

const PlaylistDisplayBase = (props) => {
  const styles = useStyles();

  const [relatedPlaylists, setRelatedPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState(null);
  const [hoveredPlaylist, setHoveredPlaylist] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [playlistSongIDs, setPlaylistSongIDs] = useState(null);
  const [playlistSongData, setPlaylistSongData] = useState(null);

  const url =
    props.currentPlaylistData && props.currentPlaylistData.imageVersion !== 0
      ? `${props.currentPlaylistID}_${
          props.currentPlaylistData.imageVersion - 1
        }`
      : props.currentPlaylistID;

  let panelRef = createRef();
  let panelScrollInterval = null;

  const handlePanelScrollButton = (direction) => {
    if (panelRef.current) {
      if (direction === true) {
        panelRef.current.scrollTop -= 100;
      } else {
        panelRef.current.scrollTop += 100;
      }
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const getPlaylistFromHref = async (playlistID) => {
      await props.firebase
        .firestoreGetDoc("playlists", playlistID)
        .then(async (doc) => {
          let data = doc.data();

          props.setCurrentPlaylistData(data);
          props.setPlaylistSongIDs(data.songIDs);

          await props.firebase
            .firestoreGetDoc("users", data.userID)
            .then((doc) => {
              let userData = doc.data();
              let relatedPlaylistIDs = [];
              let relatedPlaylistData = [];

              userData.playlistIDs.map(async (id) => {
                await props.firebase
                  .firestoreGetDoc("playlists", id)
                  .then((doc) => {
                    let playlistData = doc.data();
                    if (id !== playlistID) {
                      relatedPlaylistIDs = [id, ...relatedPlaylistIDs];
                      relatedPlaylistData = [
                        playlistData,
                        ...relatedPlaylistData,
                      ];
                    }
                  });

                props.setRelatedPlaylistIDs(relatedPlaylistIDs);
                props.setRelatedPlaylistData(relatedPlaylistData);
              });

              setPlaylistData(data);
              const state = `${window.location.protocol}//${window.location.host}${routes.PLAYLIST}/${data.playlistName}`;
              window.history.replaceState({ path: state }, "", state);
            });
        });
    };

    if (!urlParams.get("pid") && !props.currentPlaylistID) {
      replaceHistory(routes.HOME);
    }

    if (urlParams.get("pid") && !props.currentPlaylistID) {
      let playlistID = urlParams.get("pid");
      props.setCurrentPlaylistID(playlistID);
      props.setCurrentPlaylistData(null);
      props.setPlaylistSongData(null);
      props.setPlaylistSongIDs(null);
      setPlaylistSongData(null);
      setPlaylistData(null);
      setRelatedPlaylists(null);
      getPlaylistFromHref(playlistID);
    }

    if (props.currentPlaylistData !== playlistData) {
      setPlaylistData(props.currentPlaylistData);
      props.setPlaylistSongIDs(null);
    }

    if (
      props.currentPlaylistData &&
      props.currentPlaylistData.songIDs !== props.playlistSongIDs
    ) {
      props.setPlaylistSongIDs(props.currentPlaylistData.songIDs);
      props.setPlaylistSongData(null);
    }

    if (props.playlistSongIDs && !props.playlistSongData) {
      let songData = [];
      let songIDs = [];
      props.playlistSongIDs.map(async (songID) => {
        await props.firebase.firestoreGetDoc("songs", songID).then((doc) => {
          let data = doc.data();
          let id = doc.id;
          songData = [...songData, data];
          songIDs = [...songIDs, id];
          if (props.playlistSongIDs.length === songData.length) {
            props.setPlaylistSongData(songData);
            setPlaylistSongData(songData);
            setPlaylistSongIDs(songIDs);
          }
        });
      });
    }

    if (
      props.userData &&
      props.createdPlaylistIDs !== props.userData.playlistIDs
    ) {
      props.setCreatedPlaylistIDs(props.userData.playlistIDs);
      props.setCreatedPlaylistData(null);
    }

    if (!props.createdPlaylistData && props.createdPlaylistIDs) {
      let playlistData = [];
      props.createdPlaylistIDs.map(async (playlistID) => {
        await props.firebase
          .firestoreGetDoc("playlists", playlistID)
          .then((doc) => {
            let data = doc.data();
            playlistData = [...playlistData, data];
            if (playlistData.length === props.createdPlaylistIDs.length) {
              props.setCreatedPlaylistData(playlistData);
            }
          });
      });
    }
  });

  const playPlayist = (index) => {
    props.setCurrentSongIndex(null);
    props.setPlayerSongIDs([...playlistData.songIDs]);
    props.setPlayerSongData([...playlistSongData]);
    props.setCurrentSongIndex(index ? index : 0);
  };

  const savePlaylist = async () => {
    let user = props.userData;
    let playlist = props.currentPlaylistData;

    if (!user.savedPlaylistIDs.includes(props.currentPlaylistID)) {
      user.savedPlaylistIDs = [
        ...user.savedPlaylistIDs,
        props.currentPlaylistID,
      ];
      playlist.saveCount++;
    } else {
      let savedPlaylistIDs = [];
      user.savedPlaylistIDs.map((playlistID) => {
        if (playlistID !== props.currentPlaylistID) {
          savedPlaylistIDs = [...savedPlaylistIDs, playlistID];
        }
      });
      user.savedPlaylistIDs = savedPlaylistIDs;
      playlist.saveCount--;
    }

    await props.firebase
      .firestoreSet("users", props.userID, user)
      .catch((error) => {
        alert(error);
      });

    await props.firebase
      .firestoreSet("playlists", props.currentPlaylistID, playlist)
      .catch((error) => {
        alert(error);
      });

    props.setCurrentPlaylistData(playlist);
    props.setUserData(user);
    props.setPlaylistSongIDs(null);
  };

  const likeSong = async (index) => {
    let song = playlistSongData[index];
    let user = props.userData;

    await props.firebase
      .firestoreGetDoc("artists", song.artistID)
      .then(async (doc) => {
        let artist = doc.data();
        await props.firebase
          .firestoreGetDoc("projects", song.projectID)
          .then(async (doc) => {
            let project = doc.data();
            if (!user.likedSongIDs.includes(playlistSongIDs[index])) {
              song.likeCount += 1;
              project.likeCount += 1;
              artist.likeCount += 1;

              user.likedSongIDs = [
                playlistSongIDs[index],
                ...user.likedSongIDs,
              ];
            } else {
              song.likeCount -= 1;
              project.likeCount -= 1;
              artist.likeCount -= 1;

              let likedSongIDs = [];
              user.likedSongIDs.map((songID) => {
                if (songID !== playlistSongIDs[index]) {
                  likedSongIDs = [songID, ...likedSongIDs];
                }
              });
              user.likedSongIDs = likedSongIDs;
            }

            await props.firebase
              .firestoreSet("users", props.userID, user)
              .catch((error) => {
                alert(error);
              });

            await props.firebase
              .firestoreSet("artists", song.artistID, artist)
              .catch((error) => {
                alert(error);
              });

            await props.firebase
              .firestoreSet("projects", song.projectID, project)
              .catch((error) => {
                alert(error);
              });

            await props.firebase
              .firestoreSet("songs", playlistData.songIDs[index], song)
              .catch((error) => {
                alert(error);
              });

            props.setUserData(user);
            props.setPlaylistSongIDs(null);
          });
      });
  };

  return (
    <Grid container direction="column">
      <Grid
        item
        style={{
          height: "20vh",
          width: "100%",
          marginBottom: "2.5vh",
          opacity: playlistData ? 1 : 0,
        }}
      >
        <Grid container style={{ width: "100%", height: "100%" }}>
          <Grid
            item
            style={{ height: "100%", width: "20vh", marginRight: "1.25vw" }}
          >
            <Paper
              elevation={3}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/playlistImages/${url})`,
                backgroundSize: "100% 100%",
              }}
            />
          </Grid>
          <Grid
            item
            style={{
              height: "100%",
              opacity: playlistData ? 1 : 0,
              width: "calc(71.25vw - 80vh)",
            }}
          >
            <Paper
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage:
                  playlistData &&
                  `linear-gradient(to right, ${playlistData.themeLight}, ${playlistData.themeDark})`,
              }}
            >
              <Grid
                container
                direction="column"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Grid item style={{ width: "100%", height: "50%" }}>
                  <Grid
                    container
                    alignItems="center"
                    justify="flex-start"
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      paddinLeft: "1.25vw",
                    }}
                  >
                    <Grid
                      item
                      style={{
                        height: "10vh",
                        width: "10vh",
                        marginRight: "1.25vw",
                      }}
                    >
                      <Paper
                        elevation={3}
                        style={{
                          borderRadius: "0px",
                          height: "100%",
                          width: "100%",
                          backgroundColor:
                            playlistData && playlistData.themeDark,
                        }}
                      >
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <Grid item>
                            <Tooltip
                              title={"Playlist title"}
                              placement={"top"}
                              arrow
                            >
                              <QueueMusic
                                fontSize="large"
                                style={{
                                  color: "white",
                                }}
                              />
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid
                      item
                      xs
                      style={{
                        overflow: "auto",
                        paddingRight: "1.25vw",
                      }}
                    >
                      <Typography
                        className={styles.scrollbars}
                        variant="h6"
                        style={{
                          color: "white",
                          overflow: "auto",
                          maxHeight: "10vh",
                        }}
                      >
                        {playlistData && playlistData.playlistName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item style={{ width: "100%", height: "50%" }}>
                  <Grid
                    container
                    alignItems="center"
                    justify="flex-start"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Grid
                      item
                      style={{
                        height: "10vh",
                        width: "10vh",
                        marginRight: "1.25vw",
                      }}
                    >
                      <Paper
                        elevation={3}
                        style={{
                          borderRadius: "0px",
                          height: "100%",
                          width: "100%",
                          backgroundColor:
                            playlistData && playlistData.themeDark,
                        }}
                      >
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <Grid item>
                            <Tooltip
                              title={"Playlist description"}
                              placement={"top"}
                              arrow
                            >
                              <Assignment
                                fontSize="large"
                                style={{
                                  color: "white",
                                }}
                              />
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid
                      item
                      xs
                      style={{
                        overflow: "auto",
                        paddingRight: "1.25vw",
                      }}
                    >
                      <Typography
                        className={styles.scrollbars}
                        variant="subtitle1"
                        style={{
                          color: "white",
                          overflow: "auto",
                          maxHeight: "5vh",
                        }}
                      >
                        {`Created by ${playlistData && playlistData.userName}`}
                      </Typography>
                      <Typography
                        className={styles.scrollbars}
                        variant="subtitle1"
                        style={{
                          color: "white",
                          overflow: "auto",
                          maxHeight: "5vh",
                        }}
                      >
                        {playlistData && playlistData.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid
            item
            style={{
              height: "100%",
              width: "40vh",
              marginLeft: "1.25vw",
              opacity: playlistData ? 1 : 0,
            }}
          >
            <Grid container style={{ height: "100%", width: "100%" }}>
              <Grid item style={{ height: "100%", width: "10vh" }}>
                <Paper
                  elevation={3}
                  style={{
                    borderRadius: "0px",
                    height: "100%",
                    width: "100%",
                    backgroundColor: playlistData && playlistData.themeDark,
                  }}
                >
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Grid item>
                      <Tooltip title={"Genre(s)"} placement={"top"} arrow>
                        <Category
                          fontSize="large"
                          style={{
                            color: "white",
                          }}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item style={{ height: "100%", width: "30vh" }}>
                <Paper
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "0px",
                    backgroundImage:
                      playlistData &&
                      `linear-gradient(to right, ${playlistData.themeLight}, ${playlistData.themeDark})`,
                  }}
                >
                  <Grid
                    className={styles.scrollbars}
                    container
                    direction="column"
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                    }}
                    wrap="nowrap"
                  >
                    {playlistData &&
                      playlistData.genres.map((genre, index) => {
                        return (
                          <Grid
                            item
                            style={{
                              width: "100%",
                              height: "5vh",
                            }}
                          >
                            <Paper
                              elevation={3}
                              onClick={() => {
                                props.setCurrentGenre(genre);
                                pushHistory(
                                  `${routes.GENRE}/${genre.toLocaleLowerCase()}`
                                );
                              }}
                              onMouseLeave={() => setHoveredGenre(null)}
                              onMouseEnter={() => setHoveredGenre(index)}
                              style={{
                                cursor: "pointer",
                                height: "100%",
                                width: "100%",
                                borderRadius: "0px",
                                backgroundImage:
                                  hoveredGenre === index
                                    ? `linear-gradient(to right, ${playlistData.themeDark}, ${playlistData.themeLight})`
                                    : `linear-gradient(to right, ${playlistData.themeLight}, ${playlistData.themeDark})`,
                              }}
                            >
                              <Grid
                                container
                                alignItems="center"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  overflow: "auto",
                                }}
                              >
                                <Grid item style={{ paddingLeft: "1.25vw" }}>
                                  <Typography
                                    variant="subtitle1"
                                    style={{ color: "white" }}
                                  >
                                    {genre}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            style={{
              height: "100%",
              width: "20vh",
              marginLeft: "1.25vw",
              opacity: playlistData ? 1 : 0,
            }}
          >
            <Paper
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage:
                  playlistData &&
                  `linear-gradient(to right, ${playlistData.themeLight}, ${playlistData.themeDark})`,
              }}
            >
              <Grid
                container
                direction="column"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Grid
                  item
                  style={{ width: "100%", height: "50%", overflow: "auto" }}
                >
                  <Grid
                    container
                    alignItems="center"
                    justify="flex-start"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Grid
                      item
                      style={{
                        height: "10vh",
                        width: "10vh",
                      }}
                    >
                      <Paper
                        elevation={3}
                        style={{
                          borderRadius: "0px",
                          height: "100%",
                          width: "100%",
                          backgroundColor:
                            playlistData && playlistData.themeDark,
                        }}
                      >
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <Grid item>
                            <Tooltip
                              title={"Number of times saved"}
                              placement={"top"}
                              arrow
                            >
                              <Bookmark
                                fontSize="large"
                                style={{
                                  color: "white",
                                }}
                              />
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid
                      item
                      style={{
                        height: "10vh",
                        width: "10vh",
                      }}
                    >
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        style={{ width: "100%", height: "100%" }}
                      >
                        <Grid item>
                          <Typography variant="h6" style={{ color: "white" }}>
                            <NumericLabel
                              params={{
                                shortFormat: true,
                                shortFormatMinValue: 10000,
                              }}
                            >
                              {playlistData && playlistData.saveCount}
                            </NumericLabel>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  style={{ width: "100%", height: "50%", overflow: "auto" }}
                >
                  <Grid
                    container
                    alignItems="center"
                    justify="flex-start"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Grid
                      item
                      style={{
                        height: "10vh",
                        width: "10vh",
                      }}
                    >
                      <Paper
                        elevation={3}
                        style={{
                          borderRadius: "0px",
                          height: "100%",
                          width: "100%",
                          backgroundColor:
                            playlistData && playlistData.themeDark,
                        }}
                      >
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <Grid item>
                            <Tooltip
                              title={"Number of tracks"}
                              placement={"top"}
                              arrow
                            >
                              <MusicNote
                                fontSize="large"
                                style={{
                                  color: "white",
                                }}
                              />
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid
                      item
                      style={{
                        height: "10vh",
                        width: "10vh",
                      }}
                    >
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        style={{ width: "100%", height: "100%" }}
                      >
                        <Grid item>
                          <Typography variant="h6" style={{ color: "white" }}>
                            <NumericLabel
                              params={{
                                shortFormat: true,
                                shortFormatMinValue: 10000,
                              }}
                            >
                              {playlistData && playlistData.songIDs.length}
                            </NumericLabel>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        style={{
          height: "52.5vh",
          width: "100%",
          opacity: playlistData ? 1 : 0,
        }}
      >
        <Grid container style={{ height: "100%", width: "100%" }}>
          {relatedPlaylists && (
            <Grid
              item
              style={{
                height: "100%",
                width: "12.5vw",
                opacity: playlistData ? 1 : 0,
              }}
            >
              <Paper
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0px",
                  backgroundImage:
                    playlistData &&
                    `linear-gradient(to bottom, ${playlistData.themeLight}, ${playlistData.themeDark})`,
                }}
              >
                <Grid
                  container
                  direction="column"
                  style={{ height: "100%", width: "100%" }}
                >
                  <Grid item style={{ width: "100%", height: "5vh" }}>
                    <Paper
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "0px",
                        backgroundColor:
                          playlistData && hoveredButton === 0
                            ? playlistData.themeLight
                            : playlistData.themeDark,
                      }}
                    >
                      <Button
                        disableRipple
                        disabled={
                          !relatedPlaylists || !relatedPlaylists.length < 2
                        }
                        style={{ height: "100%", width: "100%" }}
                        onMouseEnter={() => setHoveredButton(0)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handlePanelScrollButton(false)}
                        onMouseDown={() => {
                          panelScrollInterval = setInterval(
                            () => handlePanelScrollButton(false),
                            50
                          );
                        }}
                      >
                        <Grid
                          container
                          style={{ height: "100%", width: "100%" }}
                          justify="center"
                          alignItems="center"
                        >
                          <Grid item>
                            <IconButton
                              disabled={
                                !relatedPlaylists ||
                                !relatedPlaylists.length < 2
                              }
                              style={{
                                height: "5vh",
                                width: "5vh",
                                backgroundColor: "rgb(0,0,0,0)",
                              }}
                            >
                              <ExpandLess
                                style={{
                                  height: "5vh",
                                  width: "5vh",
                                  color:
                                    playlistData && hoveredButton === 0
                                      ? playlistData.themeDark
                                      : playlistData.themeLight,
                                }}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Button>
                    </Paper>
                  </Grid>
                  <Grid
                    item
                    style={{
                      height: "42.5vh",
                      width: "100%",
                    }}
                  >
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      justify="flex-start"
                      style={{
                        paddingTop: "2.5vh",
                        paddingBottom: "2.5vh",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                      }}
                      id="scroll"
                      wrap="nowrap"
                      ref={panelRef}
                    >
                      {props.relatedPlaylistData &&
                        props.relatedPlaylistIDs &&
                        props.relatedPlaylistData.map((data, index) => {
                          return (
                            <Grid
                              item
                              style={{
                                width: "10vw",
                                marginBottom: "2.5vh",
                              }}
                            >
                              <PlaylistItem
                                playlistData={data}
                                index={index}
                                playlistID={props.relatedPlaylistIDs[index]}
                                hovered={hoveredPlaylist}
                                setHovered={setHoveredPlaylist}
                                itemFunction={() => {
                                  props.setCurrentPlaylistID(null);
                                  props.setCurrentPlaylistData(null);
                                  pushHistory(
                                    routes.PLAYLIST,
                                    `?pid=${props.relatedPlaylistIDs[index]}`
                                  );
                                }}
                              />
                            </Grid>
                          );
                        })}
                    </Grid>
                  </Grid>
                  <Grid item style={{ width: "100%", height: "5vh" }}>
                    <Paper
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "0px",
                        backgroundColor:
                          playlistData && hoveredButton === 1
                            ? playlistData.themeLight
                            : playlistData.themeDark,
                      }}
                    >
                      <Button
                        disableRipple
                        disabled={
                          !relatedPlaylists || !relatedPlaylists.length < 3
                        }
                        style={{ height: "100%", width: "100%" }}
                        onMouseEnter={() => setHoveredButton(1)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handlePanelScrollButton(false)}
                        onMouseDown={() => {
                          panelScrollInterval = setInterval(
                            () => handlePanelScrollButton(false),
                            50
                          );
                        }}
                      >
                        <Grid
                          container
                          style={{ height: "100%", width: "100%" }}
                          justify="center"
                          alignItems="center"
                        >
                          <Grid item>
                            <IconButton
                              disabled={
                                !relatedPlaylists ||
                                !relatedPlaylists.length < 2
                              }
                              style={{
                                height: "5vh",
                                width: "5vh",
                                backgroundColor: "rgb(0,0,0,0)",
                              }}
                            >
                              <ExpandMore
                                style={{
                                  height: "5vh",
                                  width: "5vh",
                                  color:
                                    playlistData && hoveredButton === 1
                                      ? playlistData.themeDark
                                      : playlistData.themeLight,
                                }}
                              />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
          <Grid
            item
            xs
            style={{
              marginLeft: relatedPlaylists ? "1.25vw" : null,
              height: "100%",
              opacity: playlistData ? 1 : 0,
            }}
          >
            <Grid container style={{ height: "100%", width: "100%" }}>
              <Grid item style={{ height: "42.5vh", width: "100%" }}>
                <Paper
                  elevation={0}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "0px",
                    backgroundImage:
                      playlistData &&
                      `linear-gradient(to top, ${playlistData.themeLight}, ${playlistData.themeDark})`,
                  }}
                >
                  <Grid
                    className={styles.scrollbars}
                    container
                    direction="column"
                    wrap="nowrap"
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                    }}
                  >
                    {playlistSongData &&
                      playlistSongIDs &&
                      playlistSongData.map((data, index) => {
                        return (
                          <ProjectDisplaySongListing
                            {...props}
                            index={index}
                            songData={data}
                            likeSong={() => likeSong(index)}
                            playSong={() => playPlayist(index)}
                            songID={playlistSongIDs[index]}
                            playlists={playlists === index}
                            setPlaylists={setPlaylists}
                          />
                        );
                      })}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item style={{ height: "10vh", width: "100%" }}>
                <Paper
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "0px",
                    backgroundColor: playlistData && playlistData.themeDark,
                  }}
                >
                  <Grid
                    container
                    justify="flex-start"
                    alignItems="center"
                    style={{
                      height: "100%",
                      width: "100%",
                      paddingRight: "1.25vw",
                    }}
                  >
                    <Grid
                      item
                      xs
                      style={{ marginLeft: "1.25vw", height: "5vh" }}
                    >
                      <TextIconButton
                        width={"12.5vw"}
                        icon={FilterNone}
                        text={"User Playlists"}
                        onClick={() => setRelatedPlaylists(!relatedPlaylists)}
                        stretch
                        condition={relatedPlaylists}
                        tooltip={
                          "Display other playlists created by the same user"
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        marginLeft: "1.25vw",
                        height: "5vh",
                        width: "12.5vw",
                      }}
                    >
                      <TextIconButton
                        icon={Link}
                        text={"Copy Link"}
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.protocol}//${window.location.host}${routes.PLAYLIST}?pid=${props.currentPlaylistID}`
                          );
                        }}
                        stretch
                        tooltip={"Copy a sharable link to this playlist"}
                      />
                    </Grid>
                    <Grid
                      items
                      style={{
                        marginLeft: "1.25vw",
                        height: "5vh",
                        width: "12.5vw",
                      }}
                    >
                      <TextIconButton
                        icon={Bookmark}
                        text={"save playlist"}
                        onClick={savePlaylist}
                        stretch
                        condition={
                          props.userData &&
                          props.userData.savedPlaylistIDs.includes(
                            props.currentPlaylistID
                          )
                        }
                        tooltip={"Save this playlist to your personal library"}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        marginLeft: "1.25vw",
                        height: "5vh",
                        width: "12.5vw",
                      }}
                    >
                      <TextIconButton
                        icon={PlayArrow}
                        text={"play playlist"}
                        onClick={() => playPlayist()}
                        stretch
                        tooltip={"Play through this playlist sequentially"}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const PlaylistDisplayComposed = compose(withFirebase)(PlaylistDisplayBase);

export default function PlaylistDisplay(props) {
  return <PlaylistDisplayComposed {...props} />;
}
