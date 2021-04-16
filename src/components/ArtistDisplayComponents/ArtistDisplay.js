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
  ThumbUpAlt,
  FilterNone,
  Mic,
  GroupAdd,
  Link,
  Category,
  People,
  ExpandLess,
  ExpandMore,
  Assignment,
} from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { replaceHistory, pushHistory } from "../../constants/utils";
import ProjectItem from "../ItemComponents/ProjectItem";
import TextIconButton from "../MiscComponents/TextIconButton";
import ProjectDisplaySongListing from "../ProjectDisplayComponents/ProjectDisplaySongListing";
import NumericLabel from "react-pretty-numbers";
import { useStyles } from "../../constants/styling";

const ArtistDisplayBase = (props) => {
  const styles = useStyles();

  const [playlists, setPlaylists] = useState(null);
  const [hoveredAlbum, setHoveredAlbum] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredGenre, setHoveredGenre] = useState(null);

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

  const [artistData, setArtistData] = useState(
    props.currentArtistData ? props.currentArtistData : null
  );
  const [artistProjectData, setArtistProjectData] = useState(
    props.currentArtistProjects ? props.currentArtistProjects : null
  );
  const [artistTopTrackIDs, setArtistTopTrackIDs] = useState(
    props.currentArtistTopTrackIDs ? props.currentArtistTopTrackIDs : null
  );
  const [artistTopTrackData, setArtistTopTrackData] = useState(
    props.currentArtistTopTrackData ? props.currentArtistTopTrackData : null
  );

  const url = artistData
    ? artistData.imageVersion === 0
      ? props.currentArtistID
      : `${props.currentArtistID}_${artistData.imageVersion - 1}`
    : null;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const getArtistFromHref = async (artistID) => {
      await props.firebase.firestoreGetDoc("artists", artistID).then((doc) => {
        let data = doc.data();
        props.setCurrentArtistData(data);
        setArtistData(data);
        const state = `${window.location.protocol}//${window.location.host}${routes.ARTIST_DISPLAY}/${data.name}/`;
        window.history.replaceState({ path: state }, "", state);
      });
    };

    if (!urlParams.get("aid") && !props.currentArtistID) {
      replaceHistory(routes.HOME);
    }

    if (urlParams.get("aid") && !props.currentArtistID) {
      const artistID = urlParams.get("aid");
      props.setCurrentArtistID(artistID);
      props.setCurrentArtistProjectIDs(null);
      props.setCurrentArtistTrackIDs(null);
      setArtistProjectData(null);
      setArtistData(null);
      setArtistTopTrackIDs(null);
      setArtistTopTrackData(null);
      getArtistFromHref(artistID);
    }

    if (props.currentArtistData !== artistData) {
      setArtistData(props.currentArtistData);
      props.setCurrentArtistTrackIDs(null);
      props.setCurrentArtistProjectIDs(null);
    }

    const getArtistTopTrackIDs = async () => {
      let songData = [];
      let songIDs = [];
      await props.firebase
        .firestoreLimitedGet(
          "songs",
          ["likeCount", "desc"],
          "artistID",
          props.currentArtistID,
          10
        )
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            let id = doc.id;
            songData = [...songData, data];
            songIDs = [...songIDs, id];
          });
        })
        .then(() => {
          props.setCurrentArtistTrackIDs(songIDs);
          props.setCurrentArtistTrackData(songData);
        });
    };

    if (artistData && !props.currentArtistTopTrackIDs) {
      getArtistTopTrackIDs();
    }

    if (props.currentArtistTopTrackIDs && !artistTopTrackIDs) {
      setArtistTopTrackIDs(props.currentArtistTopTrackIDs);
    }

    if (props.currentArtistTopTrackData && !artistTopTrackData) {
      setArtistTopTrackData(props.currentArtistTopTrackData);
    }

    if (
      props.currentArtistData &&
      props.currentArtistData.projectIDs !== props.currentArtistProjectIDs
    ) {
      props.setCurrentArtistProjectIDs(props.currentArtistData.projectIDs);
      props.setCurrentArtistProjectData(null);
    }

    if (props.currentArtistProjectIDs && !props.currentArtistProjectData) {
      let artistProjects = [];
      props.currentArtistProjectIDs.map(async (projectID) => {
        await props.firebase
          .firestoreGetDoc("projects", projectID)
          .then((doc) => {
            let data = doc.data();
            if (data.debutDate.seconds * 1000 < new Date().getTime()) {
              artistProjects = [...artistProjects, data];
            }
          })
          .then(() => {
            props.setCurrentArtistProjectData(artistProjects);
            setArtistProjectData(artistProjects);
          });
      });
    }

    if (
      props.currentArtistProjectData &&
      artistProjectData !== props.currentArtistProjectData
    ) {
      setArtistProjectData(props.currentArtistProjectData);
    }

    if (
      props.userData &&
      props.createdPlaylistIDs !== props.userData.playlistIDs
    ) {
      props.setArtistCreatedPlaylistIDs(props.userData.playlistIDs);
      props.setArtistCreatedPlaylistData(null);
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
              props.setArtistCreatedPlaylistData(playlistData);
            }
          });
      });
    }
  });

  const playTopTracks = (index) => {
    props.setCurrentSongIndex(null);
    props.setPlayerSongIDs([...artistTopTrackIDs]);
    props.setPlayerSongData([...artistTopTrackData]);
    props.setCurrentSongIndex(index ? index : 0);
  };

  const followArtist = async () => {
    let user = props.userData;
    let artist = props.currentArtistData;

    if (!user.followedArtistIDs.includes(props.currentArtistID)) {
      user.followedArtistIDs = [
        ...user.followedArtistIDs,
        props.currentArtistID,
      ];
      artist.followCount++;
    } else {
      let followedArtistIDs = [];
      user.followedArtistIDs.map((artistID) => {
        if (artistID !== props.currentArtistID) {
          followedArtistIDs = [...followedArtistIDs, artistID];
        }
      });
      user.followedArtistIDs = followedArtistIDs;
      artist.followCount--;
    }

    await props.firebase
      .firestoreSet("users", props.userID, user)
      .catch((error) => {
        alert(error);
      });

      await props.firebase
      .firestoreSet("artists", props.currentArtistID, artist)
      .catch((error) => {
        alert(error);
      });

    props.setCurrentArtistData(artist);
    props.setUserData(user);
    props.setCurrentArtistTrackIDs(null);
  };

  const likeSong = async (index) => {
    let song = artistTopTrackData[index];

    await props.firebase
      .firestoreGetDoc("projects", song.projectID)
      .then(async (doc) => {
        let project = doc.data();
        let artist = props.currentArtistData;
        let user = props.userData;

        if (!user.likedSongIDs.includes(artistTopTrackIDs[index])) {
          user.likedSongIDs = [artistTopTrackIDs[index], ...user.likedSongIDs];
          song.likeCount++;
          project.likeCount++;
          artist.likeCount++;
        } else {
          let likedSongIDs = [];
          user.likedSongIDs.map((songID) => {
            if (songID !== artistTopTrackIDs[index]) {
              likedSongIDs = [songID, ...likedSongIDs];
            }
          });
          user.likedSongIDs = likedSongIDs;
          song.likeCount--;
          project.likeCount--;
          artist.likeCount--;
        }

        await props.firebase
          .firestoreSet("users", props.userID, user)
          .catch((error) => {
            alert(error);
          });

        await props.firebase
          .firestoreSet("artists", props.currentArtistID, artist)
          .catch((error) => {
            alert(error);
          });

        await props.firebase
          .firestoreSet("projects", song.projectID, project)
          .catch((error) => {
            alert(error);
          });

        await props.firebase
          .firestoreSet("songs", artistTopTrackIDs[index], song)
          .catch((error) => {
            alert(error);
          });

        props.setUserData(user);
        props.setCurrentArtistData(artist);
        props.setCurrentArtistTrackIDs(null);
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
          opacity: artistData ? 1 : 0,
        }}
      >
        <Grid container style={{ width: "100%", height: "100%" }} wrap="nowrap">
          <Grid
            item
            style={{ height: "100%", minWidth: "20vh", marginRight: "1.25vw" }}
          >
            <Paper
              elevation={3}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage: props.currentArtistID
                  ? `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/artistImages/${url})`
                  : null,
                backgroundSize: "100% 100%",
              }}
            />
          </Grid>
          <Grid
            item
            style={{
              height: "100%",
              width: "calc(70vw - 100vh)",
              opacity: artistData ? 1 : 0,
            }}
          >
            <Paper
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage:
                  artistData &&
                  `linear-gradient(to right, ${artistData.themeLight}, ${artistData.themeDark})`,
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
                  xs
                  style={{
                    height: "50%",
                    overflow: "auto",
                  }}
                >
                  <Grid
                    container
                    alignItems="center"
                    justify="flex-start"
                    style={{ width: "100%", height: "100%", overflow: "auto" }}
                  >
                    <Grid
                      item
                      style={{
                        marginRight: "1.25vw",
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
                          backgroundColor: artistData && artistData.themeDark,
                        }}
                      >
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <Grid item>
                            <Tooltip title={"Artist"} placement={"top"} arrow>
                              <Mic
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
                        {artistData && artistData.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs style={{ height: "50%", overflow: "auto" }}>
                  <Grid
                    container
                    alignItems="center"
                    justify="flex-start"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Grid
                      item
                      style={{
                        marginRight: "1.25vw",
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
                          backgroundColor: artistData && artistData.themeDark,
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
                              title={"Artist biography"}
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
                          maxHeight: "10vh",
                        }}
                      >
                        {artistData && artistData.biography}
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
              minWidth: "40vh",
              marginLeft: "1.25vw",
              opacity: artistData ? 1 : 0,
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
                    backgroundColor: artistData && artistData.themeDark,
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
                      artistData &&
                      `linear-gradient(to right, ${artistData.themeLight}, ${artistData.themeDark})`,
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
                    {artistData &&
                      artistData.genres.map((genre, index) => {
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
                                    ? `linear-gradient(to right, ${artistData.themeDark}, ${artistData.themeLight})`
                                    : `linear-gradient(to right, ${artistData.themeLight}, ${artistData.themeDark})`,
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
                                    style={{
                                      color: "white",
                                    }}
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
              minWidth: "20vh",
              marginLeft: "1.25vw",
              opacity: artistData ? 1 : 0,
            }}
          >
            <Paper
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage:
                  artistData &&
                  `linear-gradient(to right, ${artistData.themeLight}, ${artistData.themeDark})`,
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
                          backgroundColor: artistData && artistData.themeDark,
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
                              title={"Number of projects"}
                              placement={"top"}
                              arrow
                            >
                              <FilterNone
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
                              {artistData && artistData.projectIDs.length}
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
                          backgroundColor: artistData && artistData.themeDark,
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
                              title={"Number of followers"}
                              placement={"top"}
                              arrow
                            >
                              <People
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
                              {artistData && artistData.followCount}
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
          <Grid
            item
            style={{
              height: "100%",
              minWidth: "20vh",
              marginLeft: "1.25vw",
              opacity: artistData ? 1 : 0,
            }}
          >
            <Paper
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage:
                  artistData &&
                  `linear-gradient(to right, ${artistData.themeLight}, ${artistData.themeDark})`,
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
                          backgroundColor: artistData && artistData.themeDark,
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
                              title={"Number of song plays"}
                              placement={"top"}
                              arrow
                            >
                              <PlayArrow
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
                              {artistData && artistData.playCount}
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
                          backgroundColor: artistData && artistData.themeDark,
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
                              title={"Number of song likes"}
                              placement={"top"}
                              arrow
                            >
                              <ThumbUpAlt
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
                              {artistData && artistData.likeCount}
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
        xs
        style={{
          width: "100%",
          marginBottom: "2.5vh",
          opacity: artistData ? 1 : 0,
        }}
      >
        <Grid container style={{ width: "100%", height: "100%" }}>
          {artistData && (
            <Grid
              item
              style={{
                height: "100%",
                width: "23.75vw",
                opacity: artistData ? 1 : 0,
              }}
            >
              <Paper
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0px",
                  backgroundImage: `linear-gradient(to top, ${artistData.themeLight}, ${artistData.themeDark})`,
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
                          hoveredButton === 0
                            ? artistData.themeLight
                            : artistData.themeDark,
                      }}
                    >
                      <Button
                        disableRipple
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
                              style={{
                                height: "5vh",
                                width: "5vh",
                                backgroundColor: "rgb(0,0,0,0)",
                              }}
                            >
                              <ExpandLess
                                fontSize="large"
                                style={{
                                  color:
                                    hoveredButton === 0
                                      ? artistData.themeDark
                                      : artistData.themeLight,
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
                      alignItems="flex-start"
                      justify="flex-start"
                      style={{
                        paddingTop: "2.5vh",
                        paddingBottom: "2.5vh",
                        paddingRight: "1.25vw",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                      }}
                      id="scroll"
                      ref={panelRef}
                    >
                      {artistProjectData &&
                        artistProjectData.map((data, index) => {
                          return (
                            <Grid
                              item
                              style={{
                                width: "10vw",
                                marginBottom: "2.5vh",
                                marginLeft: "1.25vw",
                              }}
                            >
                              <ProjectItem
                                {...props}
                                projectData={data}
                                index={index}
                                marginLeft={true}
                                projectID={artistData.projectIDs[index]}
                                hovered={hoveredAlbum}
                                artistID={props.currentArtistID}
                                setHovered={setHoveredAlbum}
                                itemFunction={() => {
                                  props.setCurrentProjectID(null);
                                  props.setCurrentProjectData(null);
                                  pushHistory(
                                    routes.PROJECT,
                                    `?aid=${props.currentArtistID}&pid=${artistData.projectIDs[index]}`
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
                          hoveredButton === 1
                            ? artistData.themeLight
                            : artistData.themeDark,
                      }}
                    >
                      <Button
                        disableRipple
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
                              style={{
                                height: "5vh",
                                width: "5vh",
                                backgroundColor: "rgb(0,0,0,0)",
                              }}
                            >
                              <ExpandMore
                                fontSize="large"
                                style={{
                                  color:
                                    hoveredButton === 1
                                      ? artistData.themeDark
                                      : artistData.themeLight,
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
              marginLeft: "1.25vw",
              height: "52.5vh",
            }}
          >
            <Grid
              container
              direction="column"
              style={{ width: "100%", height: "100%" }}
            >
              <Grid item style={{ width: "100%", height: "42.5vh" }}>
                <Paper
                  elevation={0}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "0px",
                    backgroundImage:
                      artistData &&
                      `linear-gradient(to top, ${artistData.themeLight}, ${artistData.themeDark})`,
                  }}
                >
                  <Grid
                    className={styles.scrollbars}
                    container
                    direction="column"
                    wrap="nowrap"
                    style={{ width: "100%", height: "100%", overflow: "auto" }}
                  >
                    {artistTopTrackData &&
                      artistTopTrackIDs &&
                      artistTopTrackData.map((data, index) => {
                        return (
                          <ProjectDisplaySongListing
                            {...props}
                            index={index}
                            songData={data}
                            likeSong={() => likeSong(index)}
                            playSong={() => playTopTracks(index)}
                            songID={artistTopTrackIDs[index]}
                            playlists={playlists === index}
                            setPlaylists={setPlaylists}
                            setCreatedPlaylistData={
                              props.setArtistCreatedPlaylistData
                            }
                            setCreatedPlaylistIndex={
                              props.setArtistCreatedPlaylistIndex
                            }
                          />
                        );
                      })}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item style={{ height: "10vh", width: "100%" }}>
                <Paper
                  elevation={3}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "0px",
                    backgroundColor: artistData && artistData.themeDark,
                  }}
                >
                  <Grid
                    container
                    alignItems="center"
                    justify="flex-end"
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                      paddingRight: "1.25vw",
                    }}
                  >
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
                            `${window.location.protocol}//${window.location.host}${routes.ARTIST_DISPLAY}?aid=${props.currentArtistID}`
                          );
                        }}
                        stretch
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
                        icon={GroupAdd}
                        text={"Follow Artist"}
                        onClick={followArtist}
                        condition={
                          props.userData &&
                          props.userData.followedArtistIDs.includes(
                            props.currentArtistID
                          )
                        }
                        stretch
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
                        text={"Play Top Tracks"}
                        onClick={() => playTopTracks()}
                        stretch
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

const ArtistDisplayComposed = compose(withFirebase)(ArtistDisplayBase);

export default function ArtistDisplay(props) {
  return <ArtistDisplayComposed {...props} />;
}
