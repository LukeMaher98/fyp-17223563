import React, { useState, useEffect } from "react";
import { SliderPicker } from "react-color";
import { Grid, Paper, Typography } from "@material-ui/core";
import {
  Clear,
  Save,
  Delete,
  PlaylistPlay,
  Description,
} from "@material-ui/icons";
import FormTextfield from "../FormComponents/FormTextfield";
import FormImage from "../FormComponents/FormImage";

import { artistFormTheme } from "../../constants/themes";

import { newPlaylistData } from "../../constants/templates";
import TextIconButton from "../MiscComponents/TextIconButton";
import { useStyles } from "../../constants/styling";

const PlaylistForm = (props) => {
  const styles = useStyles();

  const url =
    props.currentPlaylistIndex !== null
      ? props.createdPlaylistData[props.currentPlaylistIndex].imageVersion === 0
        ? props.createdPlaylistIDs[props.currentPlaylistIndex]
        : `${props.createdPlaylistIDs[props.currentPlaylistIndex]}_${
            props.createdPlaylistData[props.currentPlaylistIndex].imageVersion -
            1
          }`
      : null;

  const [playlistImageLocalUrl, setPlaylistImageLocalUrl] = useState(
    `https://debut-image-files.s3-eu-west-1.amazonaws.com/playlistImages/${url}`
  );

  const [playlistData, setPlaylistData] = useState(
    props.currentPlaylistIndex !== null && props.userData
      ? props.createdPlaylistData[props.currentPlaylistIndex]
      : newPlaylistData(props.userID, props.userData.userName)
  );
  const [playlistName, setPlaylistName] = useState(
    props.currentPlaylistIndex !== null
      ? props.createdPlaylistData[props.currentPlaylistIndex].playlistName
      : ""
  );
  const [playlistDesc, setPlaylistDesc] = useState(
    props.currentPlaylistIndex !== null
      ? props.createdPlaylistData[props.currentPlaylistIndex].description
      : ""
  );
  const [playlistThemeLight, setPlaylistThemeLight] = useState(
    props.currentPlaylistIndex !== null
      ? props.createdPlaylistData[props.currentPlaylistIndex].themeLight
      : "#8A2BE2"
  );
  const [playlistThemeDark, setPlaylistThemeDark] = useState(
    props.currentPlaylistIndex !== null
      ? props.createdPlaylistData[props.currentPlaylistIndex].themeDark
      : "#C71585"
  );
  const [playlistImageFile, setPlaylistImageFile] = useState(
    props.currentPlaylistIndex !== null
      ? props.createdPlaylistData[props.currentPlaylistIndex].imageUrl
      : ""
  );

  useEffect(() => {
    if (playlistName !== playlistData.playlistName) {
      let data = playlistData;
      data.playlistName = playlistName;
      setPlaylistData(data);
    }

    if (playlistDesc !== playlistData.playlistDesc) {
      let data = playlistData;
      data.description = playlistDesc;
      setPlaylistData(data);
    }

    if (playlistThemeDark !== playlistData.themeDark) {
      let data = playlistData;
      data.themeDark = playlistThemeDark;
      setPlaylistData(data);
    }

    if (playlistThemeLight !== playlistData.themeLight) {
      let data = playlistData;
      data.themeLight = playlistThemeLight;
      setPlaylistData(data);
    }
  });

  let disabled = !playlistName || !playlistDesc;

  async function createUserPlaylist() {
    const playlistID = props.createdPlaylistIDs[props.currentPlaylistIndex]
      ? props.createdPlaylistIDs[props.currentPlaylistIndex]
      : null;

    if (playlistID) {
      await props.firebase
        .firestoreSet("playlists", playlistID, playlistData)
        .catch((error) => {
          alert("error creating playlist, please try again");
        });

      if (playlistImageFile) {
        await props.AWS.deletePlaylistImage(url).catch((error) => {
          alert("error creating playlist, please try again");
        });

        await props.firebase
          .firestoreSet("playlists", playlistID, {
            ...playlistData,
            imageVersion: playlistData.imageVersion + 1,
          })
          .then(async () => {
            await props.AWS.uploadPlaylistImage(
              playlistImageFile,
              `${playlistID}_${playlistData.imageVersion}`
            )
              .then(() => {
                playlistData.imageVersion = playlistData.imageVersion + 1;
              })
              .catch((error) => {
                alert("error creating playlist, please try again");
              });
          })
          .catch((error) => {
            alert("error creating playlist, please try again");
          });
      }

      let updatedPlaylistData = props.createdPlaylistData;
      updatedPlaylistData[props.currentPlaylistIndex] = playlistData;
      props.setCreatedPlaylistData(updatedPlaylistData);
    } else {
      await props.firebase
        .firestoreAdd("playlists", playlistData)
        .then((doc) => {
          let playlistID = doc.id;
          props.firebase
            .firestoreAddUserPlaylistID(props.userID, playlistID)
            .catch((error) => {
              alert("error creating playlist, please try again");
            });
          if (playlistImageFile) {
            props.AWS.uploadPlaylistImage(playlistImageFile, playlistID).catch(
              (error) => {
                alert("error creating playlist, please try again");
              }
            );
          }
          props.setUserData({
            ...props.userData,
            playlistIDs: [...props.createdPlaylistIDs, playlistID],
          });
        })
        .catch((error) => {
          alert(error);
        });
    }

    props.setCurrentPlaylistIndex(null);
    props.setPlaylistState(1);
  }

  async function deleteUserPlaylist() {
    await props.AWS.deletePlaylistImage(url).catch((error) => {});
    await props.firebase
      .firestoreDelete(
        "playlists",
        props.createdPlaylistIDs[props.currentPlaylistIndex]
      )
      .catch((error) => {
        alert("error deleting playlist, please try again");
      });

    let updatedPlaylistIDs = [];
    props.createdPlaylistIDs.map((playlistID) => {
      if (playlistID !== props.createdPlaylistIDs[props.currentPlaylistIndex]) {
        updatedPlaylistIDs = [...updatedPlaylistIDs, playlistID];
      }
    });

    await props.firebase
      .firestoreSet("users", props.userID, {
        ...props.userData,
        playlistIDs: updatedPlaylistIDs,
      })
      .catch((error) => {
        alert("error deleting playlist, please try again");
      });

    props.setCurrentPlaylistIndex(null);
    props.setUserData({
      ...props.userData,
      playlistIDs: updatedPlaylistIDs,
    });
    props.setPlaylistState(1);
  }

  const handlePlaylistImage = (file) => {
    if (!file || (file && file.type && file.type.indexOf("image") === -1)) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", (event) => {
      setPlaylistImageLocalUrl(event.target.result);
    });

    setPlaylistImageFile(file);
  };

  return (
    <Paper
      style={{
        borderRadius: "0px",
        width: "100%",
        height: "100%",
        backgroundImage: `linear-gradient(to top, ${playlistThemeDark}, ${playlistThemeLight})`,
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
            {playlistName.length > 0 ? playlistName : "New Playlist"}
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
                    icon={PlaylistPlay}
                    value={playlistName}
                    onChange={setPlaylistName}
                    theme={artistFormTheme(
                      playlistThemeDark,
                      playlistThemeLight
                    )}
                    themeDark={playlistThemeDark}
                    themeLight={playlistThemeLight}
                    spacing={"2.5vh"}
                    tooltip={"Playlist name"}
                  />
                </Grid>
                <Grid
                  item
                  style={{
                    width: "100%",
                    marginBottom: "2.5vh",
                    height: "22.5vh",
                  }}
                >
                  <FormTextfield
                    icon={Description}
                    value={playlistDesc}
                    onChange={setPlaylistDesc}
                    multiline
                    rows={8}
                    theme={artistFormTheme(
                      playlistThemeDark,
                      playlistThemeLight
                    )}
                    themeDark={playlistThemeDark}
                    themeLight={playlistThemeLight}
                    spacing={"2.5vh"}
                    tooltip={"Playlist description"}
                  />
                </Grid>
                <Grid item style={{ width: "100%", height: "7.5vh" }}>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Grid
                      item
                      xs
                      style={{ height: "100%", marginRight: "0.625vw" }}
                    >
                      <Paper
                        style={{
                          height: "100%",
                          borderRadius: "0px",
                          backgroundColor: playlistThemeLight,
                        }}
                      >
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{
                            width: "100%",
                            height: "100%",
                            paddingLeft: "1.25vw",
                            paddingRight: "1.25vw",
                          }}
                        >
                          <Grid item xs style={{ height: "5vh" }}>
                            <SliderPicker
                              color={playlistThemeLight}
                              onChange={(color) =>
                                setPlaylistThemeLight(color.hex)
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
                      style={{ height: "100%", marginLeft: "0.625vw" }}
                    >
                      <Paper
                        style={{
                          height: "100%",
                          borderRadius: "0px",
                          backgroundColor: playlistThemeDark,
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
                              color={playlistThemeDark}
                              onChange={(color) =>
                                setPlaylistThemeDark(color.hex)
                              }
                              disableAlpha
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ height: "100%", width: "42.5vh" }}>
              <FormImage
                imageUrl={playlistImageLocalUrl}
                onChange={handlePlaylistImage}
                tooltip={"Playlist image"}
              />
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
                disabled={props.currentPlaylistIndex === null}
                onClick={() => {
                  deleteUserPlaylist();
                }}
                text={"Delete Playlist"}
                tooltip={"Delete this playlist from your personal library"}
                placement={"bottom"}
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
                  createUserPlaylist();
                }}
                text={"Save Playlist"}
                tooltip={"Save your changes to this playlist"}
                placement={"bottom"}
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
                  props.setCurrentPlaylistIndex(null);
                  props.setCreatedPlaylistData(null);
                  props.setPlaylistState(1);
                }}
                text={"Cancel"}
                tooltip={"Return to your playlist library"}
                placement={"bottom"}
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

export default PlaylistForm;
