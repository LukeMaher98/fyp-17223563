import React, { useEffect, useState } from "react";
import { Typography, Grid, Paper, Tooltip } from "@material-ui/core";
import {
  PlayArrow,
  Person,
  ThumbUpAlt,
  Album,
  Headset,
  Bookmark,
  Category,
  Link,
} from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { replaceHistory, pushHistory, compare } from "../../constants/utils";
import TextIconButton from "../MiscComponents/TextIconButton";
import ProjectDisplaySongListing from "../ProjectDisplayComponents/ProjectDisplaySongListing";
import NumericLabel from "react-pretty-numbers";
import { useStyles } from "../../constants/styling";

const ProjectDisplayBase = (props) => {
  const styles = useStyles();

  const [playlists, setPlaylists] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [projectSongData, setProjectSongData] = useState(null);
  const [hoveredGenre, setHoveredGenre] = useState(null);

  const url =
    props.currentProjectData && props.currentProjectData.imageVersion !== 0
      ? `${props.currentProjectID}_${props.currentProjectData.imageVersion - 1}`
      : props.currentProjectID;

  const artistUrl =
    props.currentArtistData && props.currentArtistData.imageVersion !== 0
      ? `${props.currentArtistID}_${props.currentArtistData.imageVersion - 1}`
      : props.currentArtistID;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const getProjectFromHref = async (projectID, artistID) => {
      await props.firebase
        .firestoreGetDoc("projects", projectID)
        .then((doc) => {
          let data = doc.data();
          if (!data) {
            replaceHistory(routes.HOME);
          }
          props.setCurrentProjectData(data);
          setProjectData(data);
          const state = `${window.location.protocol}//${window.location.host}${routes.PROJECT}/${data.artist}/${data.title}`;
          window.history.replaceState({ path: state }, "", state);
        });

      await props.firebase.firestoreGetDoc("artists", artistID).then((doc) => {
        let data = doc.data();
        props.setCurrentProjectArtistData(data);
      });
    };

    if (
      !(urlParams.get("pid") && urlParams.get("aid")) &&
      !(props.currentProjectID && props.currentArtistID)
    ) {
      replaceHistory(routes.HOME);
    }

    if (
      urlParams.get("pid") &&
      urlParams.get("aid") &&
      !(props.currentProjectID && props.currentArtistID)
    ) {
      let projectID = urlParams.get("pid");
      let artistID = urlParams.get("aid");
      props.setCurrentProjectID(projectID);
      props.setCurrentProjectArtistID(artistID);
      props.setCurrentProjectData(null);
      props.setCurrentProjectArtistData(null);
      props.setCurrentProjectSongData(null);
      props.setCurrentProjectSongIDs(null);
      setProjectSongData(null);
      setProjectData(null);
      getProjectFromHref(projectID, artistID);
    }

    if (props.currentProjectData && !projectData) {
      setProjectData(props.currentProjectData);
      props.setCurrentProjectSongIDs(null);
    }

    if (
      props.currentProjectData &&
      props.currentProjectData.songIDs !== props.currentProjectSongIDs
    ) {
      props.setCurrentProjectSongIDs(props.currentProjectData.songIDs);
      props.setCurrentProjectSongData(null);
    }

    if (props.currentProjectSongIDs && !props.currentProjectSongData) {
      let projectSongs = [];
      props.currentProjectSongIDs.map(async (songID) => {
        await props.firebase.firestoreGetDoc("songs", songID).then((doc) => {
          let data = doc.data();
          projectSongs = [...projectSongs, data];
          if (props.currentProjectSongIDs.length === projectSongs.length) {
            projectSongs = projectSongs.sort((a, b) =>
              compare(b, a, "trackListing")
            );
            props.setCurrentProjectSongData(projectSongs);
            setProjectSongData(projectSongs);
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

  const playProject = (index) => {
    props.setCurrentSongIndex(null);
    props.setPlayerSongIDs([...projectData.songIDs]);
    props.setPlayerSongData([...projectSongData]);
    props.setCurrentSongIndex(index ? index : 0);
  };

  const bookmarkProject = async () => {
    let user = props.userData;
    let project = props.currentProjectData;

    if (!user.bookmarkedProjectIDs.includes(props.currentProjectID)) {
      user.bookmarkedProjectIDs = [
        ...user.bookmarkedProjectIDs,
        props.currentProjectID,
      ];
      project.bookmarkCount++;
    } else {
      let bookmarkedProjectIDs = [];
      user.bookmarkedProjectIDs.map((projectID) => {
        if (projectID !== props.currentProjectID) {
          bookmarkedProjectIDs = [...bookmarkedProjectIDs, projectID];
        }
      });
      user.bookmarkedProjectIDs = bookmarkedProjectIDs;
      project.bookmarkCount--;
    }

    await props.firebase
      .firestoreSet("users", props.userID, user)
      .catch((error) => {
        alert("An error occured");
      });

    props.setCurrentProjectData(project);
    props.setUserData(user);
    props.setCurrentProjectSongIDs(null);
  };

  const likeSong = async (index) => {
    let song = projectSongData[index];
    let project = projectData;
    let artist = props.currentArtistData;
    let user = props.userData;

    if (!user.likedSongIDs.includes(project.songIDs[index])) {
      song.likeCount += 1;
      project.likeCount += 1;
      artist.likeCount += 1;

      user.likedSongIDs = [
        props.currentProjectData.songIDs[index],
        ...user.likedSongIDs,
      ];
    } else {
      song.likeCount -= 1;
      project.likeCount -= 1;
      artist.likeCount -= 1;

      let likedSongIDs = [];
      user.likedSongIDs.map((songID) => {
        if (songID !== props.currentProjectData.songIDs[index]) {
          likedSongIDs = [songID, ...likedSongIDs];
        }
      });
      user.likedSongIDs = likedSongIDs;
    }

    await props.firebase
      .firestoreSet("users", props.userID, user)
      .catch((error) => {
        alert("An error occured");
      });

    await props.firebase
      .firestoreSet("artists", props.currentArtistID, artist)
      .catch((error) => {
        alert("An error occured");
      });

    await props.firebase
      .firestoreSet("projects", props.currentProjectID, project)
      .catch((error) => {
        alert("An error occured");
      });

    await props.firebase
      .firestoreSet("songs", project.songIDs[index], song)
      .catch((error) => {
        alert("An error occured");
      });

    props.setCurrentProjectData(project);
    props.setCurrentProjectSongIDs(null);
  };

  return (
    <Grid container direction="column" className={props.body}>
      <Grid
        item
        style={{
          height: "20vh",
          width: "100%",
          marginBottom: "2.5vh",
          opacity: projectData ? 1 : 0,
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
                backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${props.currentArtistID}/${url})`,
                backgroundSize: "cover",
              }}
            />
          </Grid>
          <Grid
            item
            style={{
              height: "100%",
              opacity: projectData ? 1 : 0,
              width: "calc(71.25vw - 80vh)",
            }}
          >
            <Paper
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage:
                  projectData &&
                  `linear-gradient(to right, ${projectData.themeLight}, ${projectData.themeDark})`,
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
                          backgroundColor: projectData && projectData.themeDark,
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
                              title={"Project title"}
                              placement={"top"}
                              arrow
                            >
                              <Album
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
                        {projectData && projectData.title}
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
                          backgroundColor: projectData && projectData.themeDark,
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
                              <Person
                                fontSize={"large"}
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
                        {projectData && projectData.artist}
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
              opacity: projectData ? 1 : 0,
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
                    backgroundColor: projectData && projectData.themeDark,
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
                      projectData &&
                      `linear-gradient(to right, ${projectData.themeLight}, ${projectData.themeDark})`,
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
                    {projectData &&
                      projectData.genres.map((genre, index) => {
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
                                    ? `linear-gradient(to right, ${projectData.themeDark}, ${projectData.themeLight})`
                                    : `linear-gradient(to right, ${projectData.themeLight}, ${projectData.themeDark})`,
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
              opacity: projectData ? 1 : 0,
            }}
          >
            <Paper
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage:
                  projectData &&
                  `linear-gradient(to right, ${projectData.themeLight}, ${projectData.themeDark})`,
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
                          backgroundColor: projectData && projectData.themeDark,
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
                              title={"Number of project plays"}
                              placement={"top"}
                              arrow
                            >
                              <Headset
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
                              {projectData && projectData.playCount}
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
                          backgroundColor: projectData && projectData.themeDark,
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
                              title={"Number of project likes"}
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
                              {projectData && projectData.likeCount}
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
          opacity: projectData ? 1 : 0,
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
                  projectData &&
                  `linear-gradient(to top, ${projectData.themeLight}, ${projectData.themeDark})`,
              }}
            >
              <Grid
                className={styles.scrollbars}
                container
                direction="column"
                wrap="nowrap"
                style={{ width: "100%", height: "100%", overflow: "auto" }}
              >
                {projectSongData &&
                  projectSongData.map((data, index) => {
                    return (
                      <ProjectDisplaySongListing
                        {...props}
                        index={index}
                        songData={data}
                        likeSong={() => likeSong(index)}
                        playSong={() => playProject(index)}
                        songID={projectData.songIDs[index]}
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
                backgroundColor: projectData && projectData.themeDark,
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
                <Grid item style={{ height: "100%", width: "10vh" }}>
                  <Paper
                    style={{
                      borderRadius: "0px",
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/artistImages/${artistUrl})`,
                      backgroundSize: "cover",
                    }}
                  />
                </Grid>
                <Grid item xs style={{ marginLeft: "1.25vw", height: "5vh" }}>
                  <TextIconButton
                    width={"12.5vw"}
                    stretch
                    icon={Person}
                    text={"go to artist"}
                    onClick={() =>
                      pushHistory(
                        routes.ARTIST_DISPLAY,
                        `?aid=${props.currentArtistID}`
                      )
                    }
                    tooltip={"Go to this project's artist display page"}
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
                        `${window.location.protocol}//${window.location.host}${routes.PROJECT}?aid=${props.currentArtistID}&pid=${props.currentProjectID}`
                      );
                    }}
                    stretch
                    tooltip={"Copy a sharable link to this project"}
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
                    icon={Bookmark}
                    text={"bookmark project"}
                    onClick={bookmarkProject}
                    stretch
                    condition={
                      props.userData &&
                      props.userData.bookmarkedProjectIDs.includes(
                        props.currentProjectID
                      )
                    }
                    tooltip={"Save this project to your personal library"}
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
                    text={"play project"}
                    onClick={() => playProject()}
                    stretch
                    tooltip={"Play through this project sequentially"}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const ProjectDisplayComposed = compose(withFirebase)(ProjectDisplayBase);

export default function GenreDisplay(props) {
  return <ProjectDisplayComposed {...props} />;
}
