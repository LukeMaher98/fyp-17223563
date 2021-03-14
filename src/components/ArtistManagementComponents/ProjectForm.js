import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import FormAutocomplete from "../FormComponents/FormAutocomplete";
import FormTextfield from "../FormComponents/FormTextfield";
import FormImage from "../FormComponents/FormImage";
import FormMultipleAutocomplete from "../FormComponents/FormMultipleAutocomplete";
import FormDateTimePicker from "../FormComponents/FormDateTimePicker";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { SliderPicker } from "react-color";
import {
  Add,
  Album,
  Assignment,
  AttachFile,
  CalendarToday,
  Cancel,
  Category,
  Clear,
  Delete,
  MusicNote,
  PlayArrow,
  Save,
} from "@material-ui/icons";
import { primaryGenres } from "../../constants/genres";
import { artistFormTheme } from "../../constants/themes";
import { releaseOptions } from "../../constants/listOptions";
import { newProjectData, newSongData } from "../../constants/templates";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import TextIconButton from "../MiscComponents/TextIconButton";
import { useStyles } from "../../constants/styling";

const ProjectForm = (props) => {
  const styles = useStyles();

  const url =
    props.currentProjectIndex !== null
      ? props.artistProjectData[props.currentProjectIndex].imageVersion === 0
        ? props.artistProjectIDs[props.currentProjectIndex]
        : `${props.artistProjectIDs[props.currentProjectIndex]}_${
            props.artistProjectData[props.currentProjectIndex].imageVersion - 1
          }`
      : null;

  const [projectCoverLocalUrl, setProjectCoverLocalUrl] = useState(
    `https://debut-image-files.s3-eu-west-1.amazonaws.com/projectCovers/${
      props.userArtistIDs[props.currentArtistIndex]
    }/${url}`
  );
  const [projectData, setProjectData] = useState(
    props.currentProjectIndex !== null
      ? props.artistProjectData[props.currentProjectIndex]
      : newProjectData()
  );
  const [projectTitle, setProjectTitle] = useState(
    props.currentProjectIndex !== null
      ? props.artistProjectData[props.currentProjectIndex].title
      : null
  );
  const [projectGenres, setProjectGenres] = useState(
    props.currentProjectIndex !== null
      ? props.artistProjectData[props.currentProjectIndex].genres
      : []
  );
  const [projectReleaseDate, setProjectReleaseDate] = useState(
    props.currentProjectIndex !== null
      ? props.artistProjectData[props.currentProjectIndex].debutDate
      : 0
  );
  const [projectReleaseType, setProjectReleaseType] = useState(
    props.currentProjectIndex !== null
      ? props.artistProjectData[props.currentProjectIndex].releaseType
      : null
  );
  const [projectThemeLight, setProjectThemeLight] = useState(
    props.currentProjectIndex !== null
      ? props.artistProjectData[props.currentProjectIndex].themeLight
      : "#8A2BE2"
  );
  const [projectThemeDark, setProjectThemeDark] = useState(
    props.currentProjectIndex !== null
      ? props.artistProjectData[props.currentProjectIndex].themeDark
      : "#C71585"
  );
  const [projectSongIDs, setProjectSongIDs] = useState(
    props.currentProjectIndex !== null
      ? props.artistProjectData[props.currentProjectIndex].songIDs
      : []
  );
  const [projectSongData, setProjectSongData] = useState(
    props.currentProjectIndex !== null ? props.projectSongData : []
  );
  const [projectSongUrls, setProjectSongUrls] = useState(null);
  const [songData, setSongData] = useState(newSongData());
  const [projectSongIndex, setProjectSongIndex] = useState(null);
  const [newSongTitle, setNewSongTitle] = useState(null);
  const [newSongDuration, setNewSongDuration] = useState(0);
  const [newSongFile, setNewSongFile] = useState(null);
  const [newSongLocalUrl, setNewSongLocalUrl] = useState(null);
  const [songFileDisplayName, setSongFileDisplayName] = useState(null);
  const [projectCoverFile, setProjectCoverFile] = useState(null);
  const [filesToBeDeleted, setFilesToBeDeleted] = useState([]);

  useEffect(() => {
    if (
      props.userArtistData &&
      props.userArtistData[props.currentArtistIndex] &&
      !songData.artist
    ) {
      let data = songData;
      data.artist = props.userArtistData[props.currentArtistIndex].name;
      setSongData(data);
    }

    if (
      props.userArtistData &&
      props.userArtistData[props.currentArtistIndex] &&
      !projectData.artist
    ) {
      let data = projectData;
      data.artist = props.userArtistData[props.currentArtistIndex].name;
      setProjectData(data);
    }

    if (
      props.userArtistData &&
      props.userArtistIDs[props.currentArtistIndex] &&
      !songData.artistID
    ) {
      let data = songData;
      data.artistID = props.userArtistIDs[props.currentArtistIndex];
      setSongData(data);
    }

    if (
      props.userArtistData &&
      props.userArtistIDs[props.currentArtistIndex] &&
      !projectData.artistID
    ) {
      let data = projectData;
      data.artistID = props.userArtistIDs[props.currentArtistIndex];
      setProjectData(data);
    }

    if (newSongTitle !== songData.title) {
      let data = songData;
      data.title = newSongTitle;
      setSongData(data);
    }

    if (newSongDuration !== songData.duration) {
      let data = songData;
      data.duration = newSongDuration;
      setSongData(data);
    }

    if (projectTitle !== songData.project) {
      let data = songData;
      data.project = projectTitle;
      setSongData(data);
    }

    if (projectGenres !== songData.genres) {
      let data = songData;
      data.genres = projectGenres;
      setSongData(data);
    }

    if (projectReleaseDate !== songData.debutDate) {
      let data = songData;
      data.debutDate = projectReleaseDate;
      setSongData(data);
    }

    if (projectTitle !== projectData.title) {
      let data = projectData;
      data.title = projectTitle;
      setProjectData(data);
    }

    if (projectThemeDark !== projectData.themeDark) {
      let data = projectData;
      data.themeDark = projectThemeDark;
      setProjectData(data);
    }

    if (projectThemeLight !== projectData.themeLight) {
      let data = projectData;
      data.themeLight = projectThemeLight;
      setProjectData(data);
    }

    if (projectGenres !== projectData.genres) {
      let data = projectData;
      data.genres = projectGenres;
      setProjectData(data);
    }

    if (projectReleaseDate !== projectData.debutDate) {
      let data = projectData;
      data.debutDate = projectReleaseDate;
      setProjectData(data);
    }

    if (projectReleaseType !== projectData.releaseType) {
      let data = projectData;
      data.releaseType = projectReleaseType;
      setProjectData(data);
    }

    if (projectSongUrls === null) {
      if (props.currentProjectIndex !== null) {
        setProjectSongUrls(
          getSongUrls(
            props.artistProjectData[props.currentProjectIndex].songIDs
          )
        );
      } else {
        setProjectSongUrls([]);
      }
    }
  });

  const fillSongFiles = (songIDs) => {
    let songFiles = [];
    for (let i = 0; i < songIDs.length; i++) {
      songFiles = [...songFiles, null];
    }
    return songFiles;
  };

  const [projectSongFiles, setProjectSongFiles] = useState(
    props.currentProjectIndex !== null
      ? fillSongFiles(
          props.artistProjectData[props.currentProjectIndex].songIDs
        )
      : []
  );

  const getSongUrls = (songIDs) => {
    let songUrls = [];

    songIDs.map((songID) => {
      songUrls = [
        ...songUrls,
        `https://debut-audio-files.s3-eu-west-1.amazonaws.com/artistSongs/${
          props.userArtistIDs[props.currentArtistIndex]
        }/${props.artistProjectIDs[props.currentProjectIndex]}/${songID}`,
      ];
    });

    return songUrls;
  };

  const handleProjectCover = (file) => {
    if (!file || (file && file.type && file.type.indexOf("image") === -1)) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", (event) => {
      setProjectCoverLocalUrl(event.target.result);
    });

    setProjectCoverFile(file);
  };

  const handleProjectSong = (file) => {
    if (!file || (file && file.type && file.type.indexOf("audio") === -1)) {
      return;
    }

    var audio = document.createElement("audio");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", (event) => {
      setNewSongLocalUrl(event.target.result);
      audio.src = event.target.result;
      audio.addEventListener(
        "loadedmetadata",
        function () {
          setNewSongDuration(audio.duration);
        },
        false
      );
    });

    setSongFileDisplayName(file.name);
    setNewSongFile(file);
  };

  const clearProjectFormSong = () => {
    setNewSongFile(null);
    setNewSongLocalUrl(null);
    setNewSongTitle("");
    setSongFileDisplayName(null);
    setSongData(
      newSongData(
        props.userArtistData[props.currentArtistIndex].name,
        props.userArtistIDs[props.currentArtistIndex]
      )
    );
  };

  const addProjectSong = () => {
    setProjectSongData([...projectSongData, songData]);
    setProjectSongFiles([...projectSongFiles, newSongFile]);
    setProjectSongUrls([...projectSongUrls, newSongLocalUrl]);
    clearProjectFormSong();
  };

  const deleteProjectSong = (index) => {
    let updatedSongData = [];
    let updatedSongUrls = [];
    let updatedSongFiles = [];
    let updatedSongIDs = [];
    for (let i = 0; i < projectSongData.length; i++) {
      if (i !== index) {
        updatedSongData = [...updatedSongData, projectSongData[i]];
        updatedSongUrls = [...updatedSongUrls, projectSongUrls[i]];
        updatedSongFiles = [...updatedSongFiles, projectSongFiles[i]];
      }
      if (
        projectSongIDs[i] !== projectSongIDs[index] &&
        projectSongIDs[i] !== undefined
      ) {
        updatedSongIDs = [...updatedSongIDs, projectSongIDs[i]];
      }
    }
    setProjectSongData(updatedSongData);
    setProjectSongFiles(updatedSongFiles);
    setProjectSongUrls(updatedSongUrls);
    setProjectSongIDs(updatedSongIDs);
    setFilesToBeDeleted([...filesToBeDeleted, projectSongIDs[index]]);
    if (index === projectSongIndex) {
      setProjectSongIndex(null);
    }
  };

  async function handleProject() {
    const projectID =
      props.currentProjectIndex !== null
        ? props.artistProjectIDs[props.currentProjectIndex]
        : null;

    let songsToUpload = 0;
    let songsUploaded = 0;
    let dataToUpload = [];
    let filesToUpload = [];
    for (let i = 0; i < projectSongFiles.length; i++) {
      if (projectSongFiles[i] !== null) {
        songsToUpload++;
        dataToUpload = [...dataToUpload, projectSongData[i]];
        filesToUpload = [...filesToUpload, projectSongFiles[i]];
      }
    }

    if (projectID) {
      if (projectCoverFile) {
        await props.AWS.deleteProjectCover(url)
          .catch((error) => {
            alert(error);
          })
          .then(async () => {
            await props.AWS.uploadProjectCover(
              projectCoverFile,
              projectData.artistID,
              `${projectID}_${projectData.imageVersion}`
            )
              .then(() => {
                let newProjectData = projectData;
                newProjectData.imageVersion = newProjectData.imageVersion + 1;
                setProjectData(newProjectData);
              })
              .catch((error) => {
                alert(error);
              });
          })
          .catch((error) => {
            alert(error);
          });
      }

      if (filesToBeDeleted.length > 0) {
        for (let i = 0; i < filesToBeDeleted.length; i++) {
          await props.AWS.deleteProjectSong(
            props.userArtistIDs[props.currentArtistIndex],
            projectID,
            filesToBeDeleted[i]
          ).catch((error) => {});

          await props.firebase
            .firestoreDelete("songs", filesToBeDeleted[i])
            .catch((error) => {});
        }

        let updatedSongIDs = [];
        projectData.songIDs.map((songID) => {
          if (!filesToBeDeleted.includes(songID)) {
            updatedSongIDs = [...updatedSongIDs, songID];
          }
        });

        let updatedProjectData = projectData;
        updatedProjectData.songIDs = updatedSongIDs;
        setProjectData(updatedProjectData);
      }

      if (songsToUpload > 0) {
        props.setUploadIndex(props.currentArtistIndex);
        props.setUploadCount(songsToUpload);
        props.setUploadProgress(songsUploaded);

        dataToUpload.map(async (songData, index) => {
          await props.firebase
            .firestoreAdd("songs", {
              ...songData,
              projectID: projectID,
              trackListing: projectData.previousTracks + index,
            })
            .then(async (doc) => {
              let songID = doc.id;
              await props.firebase
                .firestoreAddProjectSongID(projectID, songID)
                .catch((error) => {
                  alert(error);
                });
              await props.AWS.uploadProjectSong(
                filesToUpload[index],
                props.userArtistIDs[props.currentArtistIndex],
                projectID,
                songID
              )
                .then(() => {
                  songsToUpload--;
                  songsUploaded++;
                  props.setUploadProgress(songsUploaded);
                  if (songsToUpload === 0) {
                    props.setUploadIndex(null);
                    props.setArtistProjectData(null);
                  }
                })
                .catch((error) => {
                  alert(error);
                });
            })
            .catch((error) => {
              alert(error);
            });
        });
      }

      await props.firebase
        .firestoreSet("projects", projectID, {
          ...projectData,
          previousTracks: projectData.previousTracks + songsToUpload,
        })
        .catch((error) => {
          alert(error);
        });

      props.setCurrentProjectIndex(null);
      props.setArtistProjectData(null);
    } else {
      await props.firebase
        .firestoreAdd("projects", {
          ...projectData,
          previousTracks: projectSongData.length,
        })
        .then(async (doc) => {
          let projectID = doc.id;

          let updatedUserArtistData = props.userArtistData;
          updatedUserArtistData[props.currentArtistIndex].projectIDs = [
            ...props.artistProjectIDs,
            projectID,
          ];

          await props.firebase
            .firestoreAddArtistProjectID(
              props.userArtistIDs[props.currentArtistIndex],
              projectID
            )
            .catch((error) => {
              alert(error);
            });

          await props.firebase
            .firestoreGetDoc(
              "artists",
              props.userArtistIDs[props.currentArtistIndex]
            )
            .then((doc) => {
              const data = doc.data();
              projectGenres.map(async (genre) => {
                if (!data.genres.includes(genre)) {
                  await props.firebase
                    .firestoreAddArtistGenre(
                      props.userArtistIDs[props.currentArtistIndex],
                      genre
                    )
                    .catch((error) => {
                      alert(error);
                    });
                }
                if (!data.debutDate) {
                  await props.firebase
                    .firestoreAddArtistDebutDate(
                      props.userArtistIDs[props.currentArtistIndex],
                      projectReleaseDate
                    )
                    .catch((error) => {
                      alert(error);
                    });
                }
              });
            })
            .catch((error) => {
              alert(error);
            });

          await props.AWS.uploadProjectCover(
            projectCoverFile,
            props.userArtistIDs[props.currentArtistIndex],
            projectID
          ).catch((error) => {
            alert(error);
          });

          if (songsToUpload > 0) {
            props.setUploadIndex(props.currentArtistIndex);
            props.setUploadCount(songsToUpload);
            props.setUploadProgress(songsUploaded);

            projectSongData.map(async (songData, index) => {
              await props.firebase
                .firestoreAdd("songs", {
                  ...songData,
                  projectID: projectID,
                  trackListing: index,
                })
                .then(async (doc) => {
                  let songID = doc.id;
                  await props.firebase
                    .firestoreAddProjectSongID(projectID, songID)
                    .catch((error) => {
                      alert(error);
                    });
                  await props.AWS.uploadProjectSong(
                    projectSongFiles[index],
                    props.userArtistIDs[props.currentArtistIndex],
                    projectID,
                    songID
                  )
                    .then(() => {
                      songsToUpload--;
                      songsUploaded++;
                      props.setUploadProgress(songsUploaded);
                      if (songsToUpload === 0) {
                        props.setUserArtistData(updatedUserArtistData);
                        props.setUploadIndex(null);
                      }
                    })
                    .catch((error) => {
                      alert(error);
                    });
                })
                .catch((error) => {
                  alert(error);
                });
            });
          }
        });
    }

    props.setCurrentProjectIndex(null);
    props.setProjectForm(null);
  }

  async function deleteProject(data) {
    props.artistProjectData[props.currentProjectIndex].songIDs.map(
      async function (songID) {
        await props.AWS.deleteProjectSong(
          props.userArtistIDs[props.currentArtistIndex],
          props.artistProjectIDs[props.currentProjectIndex],
          songID
        ).catch((error) => {});
        await props.firebase
          .firestoreDelete("songs", songID)
          .catch((error) => {});
      }
    );

    await props.AWS.deleteProjectCover(
      props.userArtistIDs[props.currentArtistIndex],
      url
    ).catch((error) => {});

    await props.firebase
      .firestoreDelete(
        "projects",
        props.artistProjectIDs[props.currentProjectIndex]
      )
      .catch((error) => {});

    let updatedProjectIDs = [];

    props.userArtistData[props.currentArtistIndex].projectIDs.map(
      (projectID) => {
        if (projectID !== props.artistProjectIDs[props.currentProjectIndex]) {
          updatedProjectIDs = [...updatedProjectIDs, projectID];
        }
      }
    );

    await props.firebase
      .firestoreSet("artists", props.userArtistIDs[props.currentArtistIndex], {
        ...props.userArtistData[props.currentArtistIndex],
        projectIDs: updatedProjectIDs,
      })
      .catch((error) => {});

    props.setCurrentProjectIndex(null);
    props.setUserArtistData(null);
    props.setProjectForm(null);
  }

  const canAddSongs =
    projectTitle &&
    projectGenres &&
    projectReleaseType &&
    projectReleaseDate &&
    projectCoverLocalUrl;

  return (
    <Paper
      elevation={3}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        backgroundImage: `linear-gradient(to bottom, ${projectThemeLight}, ${projectThemeDark})`,
      }}
    >
      <Grid
        container
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          paddingBottom: "2.5vh",
          paddingTop: "2.5vh",
          paddingLeft: "1.25vw",
          paddingRight: "1.25vw",
        }}
      >
        <Grid
          className={styles.scrollbars}
          item
          style={{
            width: "72.5vw",
            height: "5vh",
            marginBottom: "2.5vh",
            overflow: "auto",
          }}
        >
          <Typography
            variant="h4"
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            {projectTitle ? projectTitle : "New Project"}
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            width: "45vw",
            height: "100%",
          }}
        >
          <Grid
            container
            direction="column"
            justify="space-between"
            style={{ width: "100%", height: "100%" }}
            wrap="nowrap"
          >
            <Grid
              item
              style={{ width: "100%", height: "27.5vh", marginBottom: "2.5vh" }}
            >
              <Grid container style={{ width: "100%" }}>
                <Grid item xs>
                  <Grid
                    container
                    direction="column"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Grid
                      item
                      style={{
                        width: "100%",
                        height: "7.5vh",
                        marginBottom: "2.5vh",
                      }}
                    >
                      <FormTextfield
                        icon={Album}
                        value={projectTitle}
                        onChange={setProjectTitle}
                        placeholder={"Title..."}
                        theme={artistFormTheme(
                          projectThemeDark,
                          projectThemeLight
                        )}
                        themeDark={projectThemeDark}
                        themeLight={projectThemeLight}
                        spacing={"2.5vh"}
                        tooltip={"The title of this project"}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        width: "100%",
                        height: "7.5vh",
                        marginBottom: "2.5vh",
                      }}
                    >
                      <FormDateTimePicker
                        value={projectReleaseDate}
                        onChange={setProjectReleaseDate}
                        themeDark={projectThemeDark}
                        themeLight={projectThemeLight}
                        theme={artistFormTheme(
                          projectThemeDark,
                          projectThemeLight
                        )}
                        spacing={"2.6vh"}
                        icon={CalendarToday}
                        tooltip={
                          "The date after which this project will be visble to other users"
                        }
                        placeholder={"Release date..."}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        width: "100%",
                        height: "7.5vh",
                      }}
                    >
                      <FormAutocomplete
                        icon={Assignment}
                        options={releaseOptions}
                        value={projectReleaseType}
                        onChange={setProjectReleaseType}
                        placeholder={"Format..."}
                        themeDark={projectThemeDark}
                        themeLight={projectThemeLight}
                        theme={artistFormTheme(
                          projectThemeDark,
                          projectThemeLight
                        )}
                        spacing={"2.5vh"}
                        inputSize={"7.5vh"}
                        tooltip={"The format of this release"}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  style={{
                    width: "27.5vh",
                    height: "27.5vh",
                    marginLeft: "1.25vw",
                  }}
                >
                  <FormImage
                    tooltip={"This project's cover art"}
                    imageUrl={projectCoverLocalUrl}
                    onChange={handleProjectCover}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              style={{
                width: "100%",
                height: "15vh",
                marginBottom: "2.5vh",
              }}
            >
              <FormMultipleAutocomplete
                icon={Category}
                options={primaryGenres}
                value={projectGenres}
                onChange={setProjectGenres}
                onDelete={(value) => {
                  let genres = [];
                  projectGenres.map((genre) => {
                    if (genre !== value) {
                      genres = [...genres, genre];
                    }
                  });
                  setProjectGenres(genres);
                }}
                canAdd={projectGenres.length < 3}
                tooltip={"The genre(s) of the material on this project"}
                placeholder={projectGenres.length > 0 ? "" : "Genres..."}
                theme={artistFormTheme(projectThemeDark, projectThemeLight)}
                themeDark={projectThemeDark}
                themeLight={projectThemeLight}
                inputSize={"15vh"}
              />
            </Grid>
            <Grid item xs style={{ width: "100%" }}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{
                  width: "100%",
                }}
              >
                <Grid item style={{ width: "100%", marginBottom: "2.5vh" }}>
                  <Grid container justify="center" alignItems="center">
                    <Grid
                      item
                      xs
                      style={{ height: "7.5vh", marginRight: "0.625vw" }}
                    >
                      <Paper style={{ height: "100%", borderRadius: "0px" }}>
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{
                            width: "100%",
                            height: "100%",
                            paddingRight: "1.25vw",
                            paddingLeft: "1.25vw",
                            backgroundColor: projectThemeLight,
                          }}
                        >
                          <Grid item xs style={{ height: "5vh" }}>
                            <SliderPicker
                              color={projectThemeLight}
                              onChange={(color) =>
                                setProjectThemeLight(color.hex)
                              }
                              disableAlpha
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid
                      item
                      xs
                      style={{ height: "7.5vh", marginLeft: "0.625vw" }}
                    >
                      <Paper style={{ height: "100%", borderRadius: "0px" }}>
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{
                            width: "100%",
                            height: "100%",
                            paddingRight: "1.25vw",
                            paddingLeft: "1.25vw",
                            backgroundColor: projectThemeDark,
                          }}
                        >
                          <Grid item xs style={{ height: "5vh" }}>
                            <SliderPicker
                              color={projectThemeDark}
                              onChange={(color) =>
                                setProjectThemeDark(color.hex)
                              }
                              disableAlpha
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item style={{ width: "100%" }}>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <Grid
                      item
                      style={{
                        height: "5vh",
                        width: "10vw",
                        marginLeft: "2.5vh",
                      }}
                    >
                      <TextIconButton
                        disabled={url === null}
                        onClick={() => {
                          deleteProject();
                        }}
                        text={"Delete Project"}
                        icon={Delete}
                        stretch
                        tooltip={`Delete this project from this artist's discography`}
                        placement={"bottom"}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        height: "5vh",
                        width: "10vw",
                        marginLeft: "2.5vh",
                      }}
                    >
                      <TextIconButton
                        disabled={!(projectSongData.length > 0)}
                        onClick={handleProject}
                        text={"Save Project"}
                        icon={Save}
                        stretch
                        tooltip={`Save this project to this artist's discography`}
                        placement={"bottom"}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        height: "5vh",
                        width: "10vw",
                        marginLeft: "2.5vh",
                      }}
                    >
                      <TextIconButton
                        onClick={() => {
                          props.setProjectFormClosed();
                        }}
                        text={"Cancel"}
                        icon={Clear}
                        stretch
                        tooltip={"Return to artist management"}
                        placement={"bottom"}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
            style={{ width: "100%", height: "100%" }}
          >
            <Grid
              item
              style={{
                width: "100%",
                marginBottom: "2.5vh",
                height: projectSongIndex !== null ? "32.5vh" : "45vh",
              }}
            >
              <Paper
                elevation={3}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0px",
                  backgroundImage: `linear-gradient(to bottom, ${projectThemeLight}, ${projectThemeDark})`,
                }}
              >
                <Grid
                  className={styles.scrollbars}
                  container
                  direction="column"
                  wrap="nowrap"
                  style={{ width: "100%", height: "100%", overflow: "auto" }}
                >
                  {projectSongData.map((track, index) => {
                    return (
                      <Grid
                        item
                        style={{
                          width: "100%",
                        }}
                      >
                        <Paper
                          elevation={3}
                          style={{
                            width: "100%",
                            height: "10vh",
                            borderRadius: "0px",
                            backgroundImage: `linear-gradient(to right, ${projectThemeLight}, ${projectThemeDark})`,
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
                              style={{
                                height: "10vh",
                                width: "10vh",
                              }}
                            >
                              <Paper
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  borderRadius: "0px",
                                  backgroundImage: `url(${projectCoverLocalUrl})`,
                                  backgroundSize: "100% 100%",
                                }}
                              />
                            </Grid>
                            <Grid item xs style={{ overflow: "auto" }}>
                              <Typography
                                variant="subtitle1"
                                style={{
                                  color: "white",
                                  marginLeft: "1.25vw",
                                }}
                              >
                                {projectSongData[index].title}
                              </Typography>
                            </Grid>
                            <Grid item style={{ marginLeft: "1.25vw" }}>
                              <SimpleIconButton
                                icon={PlayArrow}
                                onClick={() => {
                                  if (projectSongIndex !== index) {
                                    props.setCurrentSongIndex(null);
                                    setProjectSongIndex(index);
                                  } else {
                                    setProjectSongIndex(null);
                                  }
                                }}
                                tooltip={"Preview this song"}
                              />
                            </Grid>
                            <Grid item style={{ marginLeft: "1.25vw" }}>
                              <SimpleIconButton
                                icon={Cancel}
                                onClick={() => deleteProjectSong(index)}
                                tooltip={
                                  "Remove this song from the project's track list"
                                }
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
            {projectSongIndex !== null && (
              <Grid
                item
                style={{ width: "100%", height: "10vh", marginBottom: "2.5vh" }}
              >
                <AudioPlayer
                  style={{
                    height: "100%",
                    backgroundImage: `linear-gradient(to right, ${projectThemeLight}, ${projectThemeDark})`,
                  }}
                  customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
                  src={projectSongUrls[projectSongIndex]}
                  autoPlay
                />
              </Grid>
            )}
            <Grid
              item
              style={{ height: "7.5vh", width: "100%", marginBottom: "2.5vh" }}
            >
              <FormTextfield
                icon={MusicNote}
                value={newSongTitle}
                onChange={setNewSongTitle}
                placeholder={"Song..."}
                theme={artistFormTheme(projectThemeDark, projectThemeLight)}
                themeDark={projectThemeDark}
                themeLight={projectThemeLight}
                disabled={!canAddSongs}
                spacing={"2.5vh"}
                tooltip={
                  "The title of the attached song to be added to the project's track list"
                }
              />
            </Grid>
            <Grid
              item
              style={{
                width: "100%",
              }}
            >
              <Grid
                container
                justify="center"
                alignItems="center"
                style={{ width: "100%", height: "100%" }}
              >
                <Grid
                  item
                  style={{
                    height: "5vh",
                    width: "10vw",
                    marginRight: "0.625vw",
                  }}
                >
                  <input
                    accept="audio/*"
                    id="song-file"
                    type="file"
                    style={{
                      display: "none",
                      cursor: "pointer",
                    }}
                    onChange={(event) => {
                      handleProjectSong(Array.from(event.target.files)[0]);
                    }}
                  />
                  <TextIconButton
                    text={
                      songFileDisplayName
                        ? songFileDisplayName
                        : "Add Song File"
                    }
                    icon={AttachFile}
                    stretch
                    condition={songFileDisplayName && newSongFile}
                    label={"song-file"}
                    input={true}
                    disabled={!canAddSongs}
                    tooltip={`Attach an audio file to add to this project`}
                    placement={"bottom"}
                  />
                </Grid>
                <Grid
                  item
                  xs
                  style={{
                    height: "5vh",
                    marginLeft: "0.625vw",
                  }}
                >
                  <TextIconButton
                    onClick={addProjectSong}
                    text={"Add Song to Project"}
                    icon={Add}
                    stretch
                    disabled={!newSongFile || !newSongTitle}
                    tooltip={`Add the attached song to the project's track list`}
                    placement={"bottom"}
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

export default ProjectForm;
