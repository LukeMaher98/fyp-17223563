import React, { createRef, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  AppBar,
  makeStyles,
  Drawer,
  Paper,
  TextField,
  Tooltip,
  ThemeProvider,
  IconButton,
} from "@material-ui/core";
import {
  Home,
  LibraryMusic,
  ChevronLeft,
  ChevronRight,
  PlayArrow,
  SkipNext,
  Album,
  Shuffle,
  ExitToApp,
  Search,
  Reorder,
  Radio,
  Pause,
  VolumeUp,
  VolumeOff,
  SkipPrevious,
} from "@material-ui/icons";
import { withFirebase } from "../../firebase";
import * as routes from "../../constants/routes";
import { compose } from "recompose";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/src/styles.scss";
import { pushHistory } from "../../constants/utils";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { artistFormTheme } from "../../constants/themes";
import "./custom.scss";
import SongItem from "../ItemComponents/SongItem";
import * as scrollStyles from "../../constants/styling";

let playerScrollInterval = null;

const MainNavigation = (props) => {
  const styles = scrollStyles.useStyles();

  const [hoveredPlayerSong, setHoveredPlayerSong] = useState(null);
  const [playerHovered, setPlayerHovered] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [search, setSearch] = useState("");
  const [scrollReset, setScrollReset] = useState(false);

  const [currentSongUrl, setCurrentSongUrl] = useState(null);
  const [currentSongData, setCurrentSongData] = useState(null);

  const useStyles = makeStyles((theme) => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 2,
      height: "10%",
      backgroundImage: "linear-gradient(to bottom, indigo, purple)",
    },
    playerPaper: {
      backgroundColor: "rgb(0,0,128, 0)",
      height: !(props.playerOpen || playerHovered)
        ? "10vh"
        : "calc(10vh + 10vw)",
      overflow: "hidden",
    },
    content: {
      flexGrow: 1,
    },
  }));

  const classes = useStyles();
  let playerRef = createRef();

  const clearSearch = () => {
    props.setSearchArtistData(null);
    props.setSearchArtistIDs(null);
    props.setSearchProjectData(null);
    props.setSearchProjectIDs(null);
    props.setSearchSongData(null);
    props.setSearchSongIDs(null);
  };

  const navigate = (route, href) => {
    props.setPlayerOpen(null);
    pushHistory(route, href);
  };

  const signOut = async (event) => {
    await props.firebase.doSignOut().catch((error) => {
      alert(error);
    });
  };

  const handlePlayerScrollButton = (direction) => {
    if (playerRef.current) {
      if (direction === true) {
        playerRef.current.scrollLeft -= 100;
      } else {
        playerRef.current.scrollLeft += 100;
      }
    }
  };

  const handleSongEnded = () => {
    props.setCurrentSongIndex(null);
    if (props.currentSongIndex !== props.playlistSongIDs.length - 1) {
      props.setCurrentSongIndex(props.currentSongIndex + 1);
      setScrollReset(true);
    }
    props.setCurrentInterval(0);
  };

  const handlePlaySong = (index) => {
    if (index !== props.currentSongIndex) {
      props.setCurrentSongIndex(index);
      props.setCurrentInterval(0);
      setScrollReset(true);
    }
  };

  function shuffleQueue() {
    props.setCurrentSongIndex(null);
    let shuffleIndices = [];
    for (let i = 0; i < props.playlistSongIDs.length; i++) {
      shuffleIndices = [...shuffleIndices, i];
    }
    for (var i = shuffleIndices.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffleIndices[i];
      shuffleIndices[i] = shuffleIndices[j];
      shuffleIndices[j] = temp;
    }
    let shuffledSongIDs = [];
    let shuffledSongData = [];
    shuffleIndices.map((index) => {
      shuffledSongIDs = [...shuffledSongIDs, props.playlistSongIDs[index]];
      shuffledSongData = [...shuffledSongData, props.displaySongData[index]];
    });
    props.setPlayerSongIDs(shuffledSongIDs);
    props.setPlayerSongData(shuffledSongData);
    props.setCurrentSongIndex(0);
  }

  useEffect(() => {
    if (
      scrollReset &&
      document.getElementById("scroll") &&
      (props.playerOpen || playerHovered)
    ) {
      let scroll = document.getElementById("scroll");
      scroll.scrollIntoView();
      setScrollReset(false);
    }

    if (
      props.displaySongData[props.currentSongIndex] &&
      !(props.displaySongData[props.currentSongIndex] === currentSongData)
    ) {
      setCurrentSongData(props.displaySongData[props.currentSongIndex]);
      props.firebase
        .firestoreGetDoc(
          "projects",
          props.displaySongData[props.currentSongIndex].projectID
        )
        .then((doc) => {
          let data = doc.data();
          setCurrentSongUrl(
            `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${
              data.artistID
            }/${
              data.imageVersion === 0
                ? props.displaySongData[props.currentSongIndex].projectID
                : `${props.displaySongData[props.currentSongIndex].projectID}_${
                    data.imageVersion - 1
                  }`
            })`
          );
        });
    }
  });

  const playSong = async (songData, songID) => {
    let song = songData;
    song.playCount += 1;

    await props.firebase
      .firestoreGetDoc("projects", song.projectID)
      .then(async (doc) => {
        let project = doc.data();
        project.playCount += 1;

        await props.firebase
          .firestoreSet("projects", song.projectID, project)
          .then(() => {
            props.setCurrentProjectData(project);
          })
          .catch((error) => {
            alert("An error occured");
          });
      });

    await props.firebase
      .firestoreGetDoc("artists", song.artistID)
      .then(async (doc) => {
        let artist = doc.data();
        artist.playCount += 1;

        await props.firebase
          .firestoreSet("artists", song.artistID, artist)
          .then(() => {
            props.setCurrentArtistData(artist);
          })
          .catch((error) => {
            alert("An error occured");
          });
      });

    await props.firebase.firestoreSet("songs", songID, song).catch((error) => {
      alert("An error occured");
    });
  };

  const onListen = (songData, songID) => {
    if (props.currentSongIndex !== null) {
      props.setCurrentInterval(props.currentInterval + 1000);
      if (props.currentInterval > songData.duration * 500) {
        playSong(songData, songID);
        props.setCurrentInterval(0);
      }
    }
  };

  const skipButton = (direction) => {
    if (props.playlistSongIDs.length > 0) {
      if (props.currentSongIndex === null) {
        props.setCurrentSongIndex(0);
      } else if (
        (props.currentSongIndex < props.playlistSongIDs.length - 1 &&
          props.currentSongIndex > 0) ||
        (props.currentSongIndex === props.playlistSongIDs.length - 1 &&
          direction < 0) ||
        (props.currentSongIndex === 0 && direction > 0)
      ) {
        props.setCurrentSongIndex(null);
        props.setCurrentInterval(0);
        setScrollReset(true);
        props.setCurrentSongIndex(props.currentSongIndex + direction);
      }
    }
  };

  const PlayerUIButton = (icon, index, tooltip, marginBottom, onClick) => {
    let Icon = icon;
    return (
      <Box
        onMouseEnter={() => setHoveredButton(index)}
        onMouseLeave={() => setHoveredButton(null)}
        onClick={onClick ? onClick : null}
        style={{ backgroundColor: "rgb(0,0,0,0)", cursor: "pointer" }}
      >
        <Tooltip title={tooltip} placement={"top"} arrow>
          <Icon
            style={{
              color: hoveredButton === index ? "mediumvioletred" : "white",
              marginBottom: marginBottom ? marginBottom : null,
            }}
          />
        </Tooltip>
      </Box>
    );
  };

  return (
    <Box>
      <AppBar
        className={classes.appBar}
        style={{ paddingLeft: "2.5vw", paddingRight: "2.5vw" }}
      >
        <Grid
          container
          alignItems="center"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Grid item style={{ width: "5vw", marginRight: "2.5vw" }}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="space-evenly"
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <Grid item>
                <Typography
                  variant="h4"
                  style={{
                    color: "white",
                    fontFamily: "Lucida Console, Courier, monospace",
                  }}
                >
                  Debut
                </Typography>
              </Grid>
              <Grid item style={{ overflow: "auto" }}>
                <Typography variant="subtitle1" style={{ color: "white" }}>
                  {props.userData && props.userData.userName}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs style={{ height: "5vh" }}>
            <Paper
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "0px",
                backgroundImage:
                  "linear-gradient(to left, mediumvioletred, blueviolet)",
              }}
              elevation={3}
            >
              <ThemeProvider
                theme={artistFormTheme("#C71585", "#8A2BE2")}
                style={{ width: "100%", height: "100%" }}
              >
                <TextField
                  variant="filled"
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  InputProps={{
                    startAdornment: (
                      <Tooltip
                        title={"Search songs, projects, artists and playlists"}
                        placement="bottom"
                        arrow
                      >
                        <Search style={{ color: "white" }} />
                      </Tooltip>
                    ),
                    inputProps: {
                      style: {
                        height: "2.625vh",
                        marginTop: "-1.625vh",
                        marginLeft: "2.5vh",
                      },
                    },
                  }}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search..."
                />
              </ThemeProvider>
            </Paper>
          </Grid>
          <Grid item style={{ marginLeft: "1.25vw" }}>
            <Grid
              container
              alignItems="center"
              justify="flex-end"
              style={{ width: "100%" }}
            >
              <Grid item style={{ marginRight: "3.75vw" }}>
                <SimpleIconButton
                  onClick={() => {
                    if (search !== "") {
                      clearSearch();
                      props.setSearchField(search);
                      navigate(routes.SEARCH);
                      setSearch("");
                    }
                  }}
                  disabled={
                    !search ||
                    !search.length > 0 ||
                    props.locked !== props.progress
                  }
                  icon={Search}
                  tooltip={"Search"}
                />
              </Grid>
              <Grid item style={{ marginRight: "1.25vw" }}>
                <SimpleIconButton
                  onClick={() => {
                    navigate(`${routes.HOME}`);
                  }}
                  icon={Home}
                  tooltip={"Home"}
                  disabled={props.locked !== props.progress}
                />
              </Grid>
              <Grid item style={{ marginRight: "1.25vw" }}>
                <SimpleIconButton
                  onClick={() => {
                    props.setCurrentGenre(null);
                    navigate(`${routes.GENRE}/browser`);
                  }}
                  icon={Reorder}
                  tooltip={"Genre Browser"}
                  disabled={props.locked !== props.progress}
                />
              </Grid>
              <Grid item style={{ marginRight: "1.25vw" }}>
                <SimpleIconButton
                  onClick={() => navigate(routes.ARTIST)}
                  icon={LibraryMusic}
                  tooltip={"Artist Management"}
                  disabled={props.locked !== props.progress}
                />
              </Grid>
              <Grid item style={{ marginRight: "1.25vw" }}>
                <SimpleIconButton
                  onClick={() =>
                    props.setPlayerOpen(props.playerOpen === null ? true : null)
                  }
                  icon={Radio}
                  tooltip={`${
                    props.playerOpen ? "Close" : "Open"
                  } Music Player`}
                  condition={props.playerOpen}
                />
              </Grid>
              <Grid item>
                <SimpleIconButton
                  onClick={() => signOut()}
                  icon={ExitToApp}
                  tooltip={"Sign Out"}
                  disabled={props.locked !== props.progress}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AppBar>
      <Drawer
        open={true}
        anchor="bottom"
        variant="persistent"
        PaperProps={{ style: { backgroundColor: "rgb(0,0,0,0)" } }}
      >
        <Paper
          elevation={3}
          onMouseEnter={() => {
            setPlayerHovered(true);
            if (props.displaySongData.length > 0) {
              setScrollReset(true);
            }
          }}
          onMouseLeave={() => setPlayerHovered(null)}
          style={{
            height: !(props.playerOpen || playerHovered)
              ? "10vh"
              : "calc(10vh + 10vw)",
            width: "100%",
            borderRadius: "0px",
          }}
        >
          <Paper
            elevation={0}
            onMouseEnter={() => setHoveredButton(0)}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              position: "absolute",
              height: "1vh",
              width: "2.5vw",
              bottom: "10vh",
              left: "0px",
              borderRadius: "0px",
              backgroundColor: hoveredButton === 0 ? "purple" : "indigo",
              cursor: "pointer",
            }}
          />
          <Paper
            elevation={0}
            style={{
              position: "absolute",
              height: "10vh",
              width: "2.5vw",
              bottom: "0px",
              left: "0px",
              borderRadius: "0px",
              backgroundImage: "linear-gradient(to bottom, indigo, purple)",
            }}
          />
          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="flex-start"
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            {(props.playerOpen || playerHovered) && (
              <Grid
                item
                style={{
                  height: "10vw",
                  width: "100vw",
                }}
              >
                <Paper
                  style={{
                    width: "100%",
                    height: "100%",

                    borderRadius: "0px",
                    backgroundColor: "indigo",
                  }}
                >
                  <Grid
                    container
                    style={{
                      height: "100%",
                      width: "100vw",
                      overflowX: "hidden",
                    }}
                  >
                    <Grid
                      item
                      style={{
                        height: "100%",
                        width: "2.5vw",
                      }}
                    >
                      <Paper
                        elevation={3}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: "0px",
                          backgroundColor:
                            hoveredButton === 0 ? "purple" : "indigo",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePlayerScrollButton(true)}
                        onMouseDown={() => {
                          playerScrollInterval = setInterval(
                            () => handlePlayerScrollButton(true),
                            50
                          );
                        }}
                        onMouseUp={() => clearInterval(playerScrollInterval)}
                        onMouseEnter={() => setHoveredButton(0)}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        <Grid
                          container
                          style={{ height: "100%", width: "100%" }}
                          alignItems="center"
                          justify="center"
                        >
                          <Grid item>
                            <ChevronLeft
                              fontSize="large"
                              style={{
                                color:
                                  hoveredButton === 0 ? "indigo" : "purple",
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid
                      item
                      style={{
                        height: "100%",
                        width: "95vw",
                        backgroundColor: "white",
                      }}
                    >
                      <Grid
                        container
                        style={{
                          width: "100%",
                          height: "100%",
                          overflow: "auto",
                          overflowX: "hidden",
                          backgroundImage:
                            "linear-gradient(to right, blueviolet, mediumvioletred)",
                        }}
                        ref={playerRef}
                        wrap="nowrap"
                      >
                        {props.displaySongData.map((data, index) => {
                          return (
                            <Grid
                              id={
                                index === props.currentSongIndex
                                  ? "scroll"
                                  : null
                              }
                              style={{
                                opacity:
                                  index === props.currentSongIndex ||
                                  index === hoveredPlayerSong
                                    ? 1
                                    : 0.5,
                              }}
                              item
                            >
                              <SongItem
                                songData={data}
                                index={index}
                                hovered={hoveredPlayerSong}
                                songID={props.playlistSongIDs[index]}
                                setHovered={setHoveredPlayerSong}
                                itemFunction={() => {
                                  props.setCurrentProjectID(null);
                                  props.setCurrentProjectData(null);
                                  props.setCurrentProjectArtistID(null);
                                  pushHistory(
                                    routes.PROJECT,
                                    `?aid=${data.artistID}&pid=${data.projectID}`
                                  );
                                }}
                                secondaryFunction={() => handlePlaySong(index)}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      style={{
                        height: "100%",
                        width: "2.5vw",
                      }}
                    >
                      <Paper
                        elevation={3}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: "0px",
                          backgroundColor:
                            hoveredButton === 1 ? "purple" : "indigo",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePlayerScrollButton(false)}
                        onMouseDown={() => {
                          playerScrollInterval = setInterval(
                            () => handlePlayerScrollButton(false),
                            50
                          );
                        }}
                        onMouseUp={() => clearInterval(playerScrollInterval)}
                        onMouseEnter={() => setHoveredButton(1)}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        <Grid
                          container
                          style={{ height: "100%", width: "100%" }}
                          alignItems="center"
                          justify="center"
                        >
                          <Grid item>
                            <ChevronRight
                              fontSize="large"
                              style={{
                                color:
                                  hoveredButton === 1 ? "indigo" : "purple",
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
            <Grid
              item
              style={{
                height: "10vh",
                width: "100%",
                backgroundImage: "linear-gradient(to bottom, indigo, purple)",
              }}
            >
              <Grid container style={{ height: "100%", width: "100%" }}>
                <Grid item xs style={{ height: "100%" }}>
                  <AudioPlayer
                    style={{
                      padding: "0px",
                      backgroundColor: "rgb(0,0,0,0)",
                      height: "100%",
                      width: "100%",
                      paddingRight: "2.5vw",
                      paddingLeft: "2.5vw",
                      paddingTop: "1.25vh",
                      paddingBottom: "1.25vh",
                    }}
                    showJumpControls={false}
                    showSkipControls={true}
                    autoPlayAfterSrcChange={props.currentSongIndex !== null}
                    onEnded={handleSongEnded}
                    onClickNext={() => skipButton(1)}
                    onClickPrevious={() => skipButton(-1)}
                    onListen={() =>
                      onListen(
                        props.displaySongData[props.currentSongIndex],
                        props.playlistSongIDs[props.currentSongIndex]
                      )
                    }
                    customAdditionalControls={[
                      PlayerUIButton(Shuffle, 2, "Shuffle", null, shuffleQueue),
                    ]}
                    customProgressBarSection={[
                      RHAP_UI.CURRENT_TIME,
                      RHAP_UI.PROGRESS_BAR,
                      RHAP_UI.CURRENT_LEFT_TIME,
                    ]}
                    customVolumeControls={[RHAP_UI.VOLUME]}
                    customIcons={{
                      play: PlayerUIButton(
                        PlayArrow,
                        3,
                        "Play",
                        "0.625vh",
                        () => skipButton(0)
                      ),
                      pause: PlayerUIButton(Pause, 4, "Pause", "0.625vh"),
                      previous: PlayerUIButton(
                        SkipPrevious,
                        5,
                        "Previous song",
                        "0.5vh"
                      ),
                      next: PlayerUIButton(SkipNext, 6, "Next song", "0.5vh"),
                      volume: PlayerUIButton(VolumeUp, 7, "Mute"),
                      volumeMute: PlayerUIButton(VolumeOff, 8, "Unmute"),
                    }}
                    src={
                      props.displaySongData[props.currentSongIndex]
                        ? `https://debut-audio-files.s3-eu-west-1.amazonaws.com/artistSongs/${
                            props.displaySongData[props.currentSongIndex]
                              .artistID
                          }/${
                            props.displaySongData[props.currentSongIndex]
                              .projectID
                          }/${props.playlistSongIDs[props.currentSongIndex]}`
                        : null
                    }
                  />
                </Grid>
                <Grid item style={{ height: "100%", width: "10vh" }}>
                  <Paper
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "0px",
                      backgroundImage: currentSongUrl,
                      backgroundSize: "cover",
                    }}
                  >
                    {!props.displaySongData[props.currentSongIndex] && (
                      <Grid
                        container
                        style={{ height: "100%", width: "100%" }}
                        justify="center"
                        alignItems="center"
                      >
                        <Grid item>
                          <IconButton
                            disabled={true}
                            size="small"
                            style={{ backgroundColor: "rgb(0,0,0,0.5)" }}
                          >
                            <Album style={{ color: "white" }} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )}
                  </Paper>
                </Grid>
                {props.displaySongData[props.currentSongIndex] && (
                  <Grid
                    item
                    style={{
                      height: "10vh",
                      width: "15vw",
                      backgroundColor: "rgb(0,0,0,0)",
                    }}
                  >
                    <Grid
                      container
                      direction="column"
                      justify="space-evenly"
                      alignItems="flex-start"
                      style={{
                        paddingRight: "1.25vw",
                        paddingLeft: "1.25vw",
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <Grid
                        className={styles.scrollbars}
                        item
                        style={{
                          width: "100%",
                          overflow: "auto",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: "white",
                          }}
                        >
                          {props.displaySongData[props.currentSongIndex].title}
                        </Typography>
                      </Grid>
                      <Grid
                        className={styles.scrollbars}
                        item
                        style={{
                          width: "100%",
                          overflow: "auto",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          style={{
                            color: "white",
                          }}
                        >
                          {props.displaySongData[props.currentSongIndex].artist}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Drawer>
    </Box>
  );
};

const MainNavigationComposed = compose(withFirebase)(MainNavigation);

export default MainNavigationComposed;
