import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@material-ui/core";
import ProjectPanel from "./ProjectPanel";
import ArtistDisplayPanel from "./ArtistDisplayPanel";
import ArtistForm from "./ArtistForm";
import ProjectForm from "./ProjectForm";
import ProjectDisplayPanel from "./ProjectDisplayPanel";
import { withFirebase } from "../../firebase/context";
import { withAWS } from "../../AWS/context";
import { compose } from "recompose";
import TextIconButton from "../MiscComponents/TextIconButton";
import HeaderBar from "../MiscComponents/HeaderBar";
import { Add, Edit, Mic } from "@material-ui/icons";
import { useStyles } from "../../constants/styling";

function ArtistManagementBase(props) {
  const styles = useStyles();

  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  useEffect(() => {
    if (props.userData && props.userArtistIDs !== props.userData.artistIDs) {
      props.setUserArtistIDs(props.userData.artistIDs);
      props.setUserArtistData(null);
    }

    if (!props.userArtistData && props.userArtistIDs) {
      let artistData = [];
      props.userArtistIDs.map((artistID) => {
        props.firebase.firestoreGetDoc("artists", artistID).then((doc) => {
          let data = doc.data();
          artistData = [...artistData, data];
          if (artistData.length === props.userArtistIDs.length) {
            props.setUserArtistData(artistData);
          }
        });
      });
      props.setArtistProjectIDs(null);
    }

    if (
      props.currentArtistIndex !== null &&
      props.userArtistData &&
      props.userArtistData[props.currentArtistIndex].projectIDs !==
        props.artistProjectIDs
    ) {
      props.setArtistProjectIDs(
        props.userArtistData[props.currentArtistIndex].projectIDs
      );
      props.setArtistProjectData(null);
    }

    if (!props.artistProjectData && props.artistProjectIDs) {
      let projectData = [];
      props.artistProjectIDs.map((projectID) => {
        props.firebase.firestoreGetDoc("projects", projectID).then((doc) => {
          let data = doc.data();
          projectData = [...projectData, data];
          if (projectData.length === props.artistProjectIDs.length) {
            props.setArtistProjectData(projectData);
          }
        });
      });
      props.setProjectSongIDs(null);
    }

    if (
      props.currentProjectIndex !== null &&
      props.artistProjectData &&
      props.artistProjectData[props.currentProjectIndex].songIDs !==
        props.projectSongIDs
    ) {
      props.setProjectSongIDs(
        props.artistProjectData[props.currentProjectIndex].songIDs
      );
      props.setProjectSongData(null);
    }

    if (!props.projectSongData && props.projectSongIDs) {
      let songData = [];
      props.projectSongIDs.map((songID) => {
        props.firebase.firestoreGetDoc("songs", songID).then((doc) => {
          let data = doc.data();
          songData = [...songData, data];
          if (songData.length === props.projectSongIDs.length) {
            props.setProjectSongData(songData);
          }
        });
      });
    }
  });

  const handlePanel = (panel) => {
    props.setCurrentArtistIndex(
      props.currentArtistIndex === panel ? null : panel
    );
    props.setArtistDisplay(props.currentArtistIndex === panel ? null : true);
    props.setArtistProjectIDs(null);
    props.setCurrentProjectIndex(null);
  };

  const handleArtistFormOpen = () => {
    props.setArtistForm(true);
    props.setProjectForm(null);
    props.setArtistDisplay(null);
    props.setProjectDisplay(null);
  };

  const handleProjectFormOpen = () => {
    props.setProjectDisplay(null);
    props.setArtistForm(null);
    props.setArtistDisplay(null);
    props.setProjectForm(true);
  };

  const handleArtistFormClosed = () => {
    props.setArtistDisplay(props.currentArtistIndex !== null ? true : null);
    props.setArtistForm(null);
  };

  const setProjectDisplayClosed = () => {
    props.setProjectDisplay(null);
    props.setCurrentProjectIndex(null);
    props.setArtistProjectIDs(null);
  };

  const handleProjectViewOpen = (index) => {
    props.setCurrentProjectIndex(
      props.currentProjectIndex === index ? null : index
    );
    props.setProjectDisplay(props.currentProjectIndex === index ? null : true);
    props.setProjectForm(null);
    props.setArtistForm(null);
    props.setArtistDisplay(true);
    props.setProjectSongData(null);
  };

  const handleProjectFormClosed = () => {
    props.setCurrentArtistIndex(null);
    props.setCurrentProjectIndex(null);
    props.setProjectSongData(null);
    props.setProjectSongIDs(null);
    props.setProjectForm(null);
  };

  return (
    <Grid container className={props.body} wrap="nowrap">
      {!props.projectDisplay && !props.projectForm && !props.artistForm && (
        <Grid
          item
          xs
          style={{
            maxHeight: "100%",
            width: "100%",
            marginBottom: "2.5vh",
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
              style={{ width: "100%", height: "10vh", marginBottom: "2.5vh" }}
            >
              <HeaderBar content={"Artist Management"} icon={Mic} />
            </Grid>
            <Grid item style={{ width: "100%", height: "52.5vh" }}>
              <Paper
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0px",
                  backgroundColor: "rgb(0,0,0,0.1)",
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
                  {props.userArtistData &&
                    props.userArtistData.map((data, index) => {
                      return (
                        <Grid item style={{ width: "100%" }}>
                          <ProjectPanel
                            buttonFunction={handleProjectFormOpen}
                            {...props}
                            itemFunction={handleProjectViewOpen}
                            index={index}
                            locked={props.uploadIndex === index}
                            expanded={
                              props.currentArtistIndex === index &&
                              props.uploadIndex !== index
                            }
                            handleChange={() => handlePanel(index)}
                            artistData={data}
                            hoveredAlbum={hoveredAlbum}
                            setHoveredAlbum={setHoveredAlbum}
                          />
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
                height: "10vh",
              }}
            >
              <Paper
                elevation={3}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage:
                    "linear-gradient(to bottom, blueviolet, mediumvioletred)",
                  borderRadius: "0px",
                }}
              >
                <Grid
                  container
                  style={{ width: "100%", height: "100%" }}
                  justify="center"
                  alignItems="center"
                >
                  <Grid
                    item
                    style={{
                      height: "5vh",
                      width: "10vw",
                    }}
                  >
                    <TextIconButton
                      disabled={
                        props.uploadIndex === props.currentArtistIndex &&
                        props.uploadIndex !== null
                      }
                      onClick={handleArtistFormOpen}
                      text={
                        props.currentArtistIndex === null
                          ? "New Artist"
                          : "Edit Artist"
                      }
                      icon={props.currentArtistIndex === null ? Add : Edit}
                      tooltip={
                        props.currentArtistIndex === null
                          ? "Create a new artist persona"
                          : props.userArtistData &&
                            `Edit the artist profile for ${
                              props.userArtistData[props.currentArtistIndex]
                                .name
                            }`
                      }
                      stretch
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )}
      {props.artistDisplay && (
        <Grid
          item
          style={{
            height: "75vh",
            width: "16.25vw",
            marginLeft: "1.25vw",
          }}
        >
          <ArtistDisplayPanel
            {...props}
            handleArtistFormOpen={handleArtistFormOpen}
          />
        </Grid>
      )}
      {props.artistForm && (
        <Grid
          item
          xs
          style={{
            height: "75vh",
          }}
        >
          <ArtistForm setArtistFormClosed={handleArtistFormClosed} {...props} />
        </Grid>
      )}
      {props.projectDisplay && (
        <Grid
          item
          xs
          style={{
            height: "75vh",
            width: "57.5vw",
            marginLeft: "1.25vw",
          }}
        >
          <ProjectDisplayPanel
            {...props}
            setProjectFormOpen={handleProjectFormOpen}
            setProjectDisplayClosed={setProjectDisplayClosed}
          />
        </Grid>
      )}
      {props.projectForm && (
        <Grid
          item
          xs
          style={{
            height: "75vh",
          }}
        >
          <ProjectForm
            {...props}
            setProjectFormClosed={handleProjectFormClosed}
          />
        </Grid>
      )}
    </Grid>
  );
}

const ArtistManagementComposed = compose(
  withFirebase,
  withAWS
)(ArtistManagementBase);

export default function ArtistManagement(props) {
  return <ArtistManagementComposed {...props} />;
}
