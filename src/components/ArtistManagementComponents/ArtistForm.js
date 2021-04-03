import React, { useState, useEffect } from "react";
import { SliderPicker } from "react-color";
import { Grid, Paper, Typography } from "@material-ui/core";
import { Clear, Save, Delete, Description, Person } from "@material-ui/icons";
import FormTextfield from "../FormComponents/FormTextfield";
import FormImage from "../FormComponents/FormImage";

import { artistFormTheme } from "../../constants/themes";
import { newArtistData } from "../../constants/templates";
import TextIconButton from "../MiscComponents/TextIconButton";
import { useStyles } from "../../constants/styling";

const ArtistForm = (props) => {
  const styles = useStyles();

  const url =
    props.currentArtistIndex !== null
      ? props.userArtistData[props.currentArtistIndex].imageVersion === 0
        ? props.userArtistIDs[props.currentArtistIndex]
        : `${props.userArtistIDs[props.currentArtistIndex]}_${
            props.userArtistData[props.currentArtistIndex].imageVersion - 1
          }`
      : null;

  const [artistImageFile, setArtistImageFile] = useState(null);
  const [artistImageLocalUrl, setArtistImageLocalUrl] = useState(
    `https://debut-image-files.s3-eu-west-1.amazonaws.com/artistImages/${url}`
  );

  const [artistData, setArtistData] = useState(
    props.currentArtistIndex !== null
      ? props.userArtistData[props.currentArtistIndex]
      : newArtistData(props.userID)
  );
  const [artistName, setArtistName] = useState(
    props.currentArtistIndex !== null
      ? props.userArtistData[props.currentArtistIndex].name
      : ""
  );
  const [artistThemeLight, setArtistThemeLight] = useState(
    props.currentArtistIndex !== null
      ? props.userArtistData[props.currentArtistIndex].themeLight
      : "#8A2BE2"
  );
  const [artistThemeDark, setArtistThemeDark] = useState(
    props.currentArtistIndex !== null
      ? props.userArtistData[props.currentArtistIndex].themeDark
      : "#C71585"
  );
  const [artistBiography, setArtistBiography] = useState(
    props.currentArtistIndex !== null
      ? props.userArtistData[props.currentArtistIndex].biography
      : ""
  );

  let disabled = !artistName || !artistBiography || artistImageLocalUrl.includes("null");

  useEffect(() => {
    if (artistName !== artistData.name) {
      let data = artistData;
      data.name = artistName;
      setArtistData(data);
    }

    if (artistBiography !== artistData.playlistDesc) {
      let data = artistData;
      data.biography = artistBiography;
      setArtistData(data);
    }

    if (artistThemeDark !== artistData.themeDark) {
      let data = artistData;
      data.themeDark = artistThemeDark;
      setArtistData(data);
    }

    if (artistThemeLight !== artistData.themeLight) {
      let data = artistData;
      data.themeLight = artistThemeLight;
      setArtistData(data);
    }
  }, [
    artistName,
    artistData,
    artistBiography,
    artistThemeDark,
    artistThemeLight,
  ]);

  const createUserArtist = async () => {
    const artistID =
      props.currentArtistIndex !== null
        ? props.userArtistIDs[props.currentArtistIndex]
        : null;

    if (artistID) {
      if (artistImageFile) {
        await props.AWS.deleteArtistImage(url)
          .then(async () => {
            await props.AWS.uploadArtistImage(
              artistImageFile,
              `${artistID}_${artistData.imageVersion}`
            )
              .then(() => {
                let newArtistData = artistData;
                newArtistData.imageVersion = newArtistData.imageVersion + 1;
                setArtistData(newArtistData);
              })
              .catch((error) => {
                alert(error);
              });
          })
          .catch((error) => {
            alert(error);
          });
      }

      await props.firebase
        .firestoreSet("artists", artistID, artistData)
        .catch((error) => {
          alert(error);
        });

      let updatedArtistData = props.userArtistData;
      updatedArtistData[props.currentArtistIndex] = artistData;
      props.setUserArtistData(updatedArtistData);
    } else {
      await props.firebase
        .firestoreAdd("artists", artistData)
        .then(async (doc) => {
          let artistID = doc.id;
          await props.firebase
            .firestoreAddUserArtistID(props.userID, artistID)
            .catch((error) => {
              alert(error);
            });
          await props.AWS.uploadArtistImage(artistImageFile, artistID).catch(
            (error) => {
              alert(error);
            }
          );
          await props.setUserData({
            ...props.userData,
            artistIDs: [...props.userData.artistIDs, artistID],
          });

          let updatedUserData = props.userData;
          updatedUserData.artistIDs = [...updatedUserData.artistIDs, artistID];
          props.setUserData(updatedUserData);
        })
        .catch((error) => {
          alert(error);
        });
    }

    props.setCurrentArtistIndex(null);
    props.setArtistForm(null);
  };

  const deleteUserArtist = async (data) => {
    let projectData = [];

    await props.userArtistData[props.currentArtistIndex].projectIDs.map(
      async (projectID) => {
        await props.firebase
          .firestoreGetDoc("projects", projectID)
          .then((doc) => {
            const data = doc.data();
            projectData = [...projectData, data];
          })
          .catch((error) => {
            alert(error);
          });
        await props.firebase.firestoreDelete("projects", projectID).catch((error) => {
          alert(error);
        });
        await props.AWS.deleteProjectCover(
          props.userArtistIDs[props.currentArtistIndex],
          projectID
        ).catch((error) => {
          alert(error);
        });
        await projectData.map((project, index) => {
          project.songIDs.map(async (songID) => {
            await props.firebase
              .firestoreDelete("songs", songID)
              .catch((error) => {
                alert(error);
              });
            await props.AWS.deleteProjectSong(
              props.userArtistIDs[props.currentArtistIndex],
              projectID,
              songID
            ).catch((error) => {
              alert(error);
            });
          });
          return null
        });
      }
    );

    await props.AWS.deleteArtistImage(url).catch((error) => {});

    await props.firebase
      .firestoreDelete("artists", props.userArtistIDs[props.currentArtistIndex])
      .catch((error) => {
        alert(error);
      });

    let updatedArtistIDs = [];

    props.userData.artistIDs.map((artistID) => {
      if (artistID !== props.userArtistIDs[props.currentArtistIndex]) {
        updatedArtistIDs = [...updatedArtistIDs, artistID];
      }
      return null
    });

    await props.firebase
      .firestoreSet("users", props.userID, {
        ...props.userData,
        artistIDs: updatedArtistIDs,
      })
      .catch((error) => {
        alert(error);
      });

    props.setCurrentArtistIndex(null);
    props.setUserData({
      ...props.userData,
      artistIDs: updatedArtistIDs,
    });
    props.setArtistForm(null);
  };

  const clearArtistForm = () => {
    setArtistImageFile(null);
    setArtistName("");
    setArtistThemeLight("#8A2BE2");
    setArtistThemeDark("#C71585");
    setArtistBiography("");
  };

  const handleNewArtistImage = (file) => {
    if (!file || (file && file.type && file.type.indexOf("image") === -1)) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", (event) => {
      setArtistImageLocalUrl(event.target.result);
    });

    setArtistImageFile(file);
  };

  return (
    <Paper
      style={{
        borderRadius: "0px",
        width: "100%",
        height: "100%",
        backgroundImage: `linear-gradient(to top, ${artistThemeDark}, ${artistThemeLight})`,
      }}
    >
      <Grid
        container
        direction="column"
        style={{
          width: "100%",
          height: "100%",
          paddingTop: "2.5vh",
          paddingBottom: "2.5vh",
          paddingLeft: "1.25vw",
          paddingRight: "1.25vw",
        }}
        wrap="nowrap"
      >
        <Grid
          className={styles.scrollbars}
          item
          style={{
            maxWidth: "72.5vw",
            height: "5vh",
            marginBottom: "2.5vh",
            overflow: "auto",
          }}
        >
          <Typography
            variant="h4"
            style={{ color: "white", fontWeight: "bold" }}
          >
            {artistName.length > 0 ? artistName : "New Artist"}
          </Typography>
        </Grid>
        <Grid
          item
          style={{ width: "100%", height: "42.5vh", marginBottom: "2.5vh" }}
        >
          <Grid
            container
            alignItems="flex-start"
            style={{ width: "100%", height: "100%" }}
          >
            <Grid item xs style={{ height: "100%", marginRight: "1.25vw" }}>
              <Grid container direction="column" justify="center">
                <Grid
                  item
                  style={{
                    width: "100%",
                    height: "7.5vh",
                    marginBottom: "2.5vh",
                  }}
                >
                  <FormTextfield
                    icon={Person}
                    value={artistName}
                    onChange={setArtistName}
                    theme={artistFormTheme(artistThemeDark, artistThemeLight)}
                    themeDark={artistThemeDark}
                    themeLight={artistThemeLight}
                    spacing={"2.5vh"}
                    placeholder={"Name..."}
                    tooltip={"Artist name"}
                  />
                </Grid>
                <Grid
                  item
                  style={{
                    width: "100%",
                    marginBottom: "2.5vh",
                    height: "32.5vh",
                  }}
                >
                  <FormTextfield
                    icon={Description}
                    value={artistBiography}
                    onChange={setArtistBiography}
                    multiline
                    rows={13}
                    theme={artistFormTheme(artistThemeDark, artistThemeLight)}
                    themeDark={artistThemeDark}
                    themeLight={artistThemeLight}
                    spacing={"2.5vh"}
                    placeholder={"Biography..."}
                    tooltip={"Artist biography and description"}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ height: "100%", width: "42.5vh" }}>
              <FormImage
                imageUrl={artistImageLocalUrl}
                onChange={handleNewArtistImage}
                tooltip="Artist profile image"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          style={{ width: "100%", height: "10vh", marginBottom: "2.5vh" }}
        >
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{ width: "100%", height: "100%" }}
          >
            <Grid item xs style={{ height: "100%", marginRight: "0.625vw" }}>
              <Paper
                style={{
                  height: "100%",
                  borderRadius: "0px",
                  backgroundColor: artistThemeLight,
                }}
              >
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  style={{
                    width: "100%",
                    height: "100%",
                    paddingRight: "1.25vw",
                    paddingLeft: "1.25vw",
                  }}
                >
                  <Grid item xs style={{ height: "5vh" }}>
                    <SliderPicker
                      color={artistThemeLight}
                      onChange={(color) => setArtistThemeLight(color.hex)}
                      disableAlpha
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs style={{ height: "100%", marginLeft: "0.625vw" }}>
              <Paper
                style={{
                  height: "100%",
                  borderRadius: "0px",
                  backgroundColor: artistThemeDark,
                }}
              >
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  style={{
                    width: "100%",
                    height: "100%",
                    paddingRight: "1.25vw",
                    paddingLeft: "1.25vw",
                    backgroundColor: artistThemeDark,
                  }}
                >
                  <Grid item xs style={{ height: "5vh" }}>
                    <SliderPicker
                      color={artistThemeDark}
                      onChange={(color) => setArtistThemeDark(color.hex)}
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
              style={{ height: "5vh", width: "15vw", marginLeft: "2.5vh" }}
            >
              <TextIconButton
                disabled={!props.currentArtistIndex === null}
                onClick={() => {
                  deleteUserArtist();
                }}
                text={"Delete Artist"}
                icon={Delete}
                stretch
              />
            </Grid>
            <Grid
              item
              style={{ height: "5vh", width: "15vw", marginLeft: "2.5vh" }}
            >
              <TextIconButton
                disabled={disabled}
                onClick={() => {
                  createUserArtist();
                }}
                text={"Save Artist"}
                icon={Save}
                stretch
              />
            </Grid>
            <Grid
              item
              style={{ height: "5vh", width: "15vw", marginLeft: "2.5vh" }}
            >
              <TextIconButton
                onClick={() => {
                  props.setArtistFormClosed();
                  clearArtistForm();
                }}
                text={"Cancel"}
                icon={Clear}
                stretch
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ArtistForm;
