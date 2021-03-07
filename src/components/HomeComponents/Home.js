import React, { useEffect, useState } from "react";
import { Grid, Paper } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { homeButtons } from "../../constants/buttons";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";

import HeaderBar from "../MiscComponents/HeaderBar";
import SearchBar from "../MiscComponents/SearchBar";
import FeedProjectListing from "./FeedProjectListing";
import UserLibrary from "./UserLibrary";
import PlaylistManagement from "./PlaylistManagement";
import { pushHistory, compare } from "../../constants/utils";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { useStyles } from "../../constants/styling";

const HomeBase = (props) => {
  const styles = useStyles();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (
      props.userData &&
      props.followedArtistIDs !== props.userData.followedArtistIDs
    ) {
      props.setFollowedArtistIDs(props.userData.followedArtistIDs);
      props.setFollowedArtistData(null);
      props.setFollowedArtistProjectData(null);
    }

    if (
      props.userData &&
      props.bookmarkedProjectIDs !== props.userData.bookmarkedProjectIDs
    ) {
      props.setBookmarkedProjectIDs(props.userData.bookmarkedProjectIDs);
      props.setBookmarkedProjectData(null);
    }

    if (props.userData && props.likedSongIDs !== props.userData.likedSongIDs) {
      props.setLikedSongIDs(props.userData.likedSongIDs);
      props.setLikedSongData(null);
    }

    if (
      props.userData &&
      props.savedPlaylistIDs !== props.userData.savedPlaylistIDs
    ) {
      props.setSavedPlaylistIDs(props.userData.savedPlaylistIDs);
      props.setSavedPlaylistData(null);
    }

    if (
      props.userData &&
      props.createdPlaylistIDs !== props.userData.playlistIDs
    ) {
      props.setCreatedPlaylistIDs(props.userData.playlistIDs);
      props.setCreatedPlaylistData(null);
    }

    if (
      !(props.followedArtistData && props.followedArtistProjectIDs) &&
      props.followedArtistIDs
    ) {
      let artistData = [];
      let projectIDs = [];
      props.followedArtistIDs.map(async (artistID) => {
        await props.firebase
          .firestoreGetDoc("artists", artistID)
          .then(async (doc) => {
            let data = doc.data();
            if (!data) {
              let updatedArtistIDs = [];
              props.followedArtistIDs.map((id) => {
                if (id !== artistID) {
                  updatedArtistIDs = [...updatedArtistIDs, id];
                }
                return true;
              });
              let updatedUserData = props.userData;
              updatedUserData.followedArtistIDs = updatedArtistIDs;
              await props.firebase.firestoreSet(
                "users",
                props.userID,
                updatedUserData
              );
              props.setUserData(updatedUserData);
              props.setFollowedArtistIDs(updatedArtistIDs);
            } else {
              artistData = [...artistData, data];
              projectIDs = [...projectIDs, ...data.projectIDs];
              if (artistData.length === props.followedArtistIDs.length) {
                props.setFollowedArtistData(artistData);
                props.setFollowedArtistProjectIDs(projectIDs);
              }
            }
            return;
          });
      });
    }

    if (!props.followedArtistProjectData && props.followedArtistProjectIDs) {
      let projectData = [];
      props.followedArtistProjectIDs.map(async (projectID) => {
        await props.firebase.firestoreGetDoc("projects", projectID).then((doc) => {
          let data = doc.data();
          if (data.debutDate.seconds * 1000 < new Date().getTime()) {
            projectData = [...projectData, data];
          } else {
            projectData = [...projectData, null];
          }
          if (projectData.length === props.followedArtistProjectIDs.length) {
            let sortedCouples = [];
            projectData.map((data, index) => {
              if (data !== null) {
                sortedCouples = [
                  ...sortedCouples,
                  { data: data, id: props.followedArtistProjectIDs[index] },
                ];
              }
              return null;
            });
            sortedCouples = sortedCouples.sort((a, b) =>
              compare(a.data, b.data, "debutDate")
            );
            let sortedIDs = [];
            let sortedData = [];
            sortedCouples.map((couple) => {
              sortedIDs = [couple.id, ...sortedIDs];
              sortedData = [couple.data, ...sortedData];
              return null;
            });
            props.setFollowedArtistProjectData(sortedData);
            props.setFollowedArtistProjectIDs(sortedIDs);
          }
        });
        return null;
      });
    }

    if (!props.bookmarkedProjectData && props.bookmarkedProjectIDs) {
      let projectData = [];
      props.bookmarkedProjectIDs.map(async (projectID) => {
        await props.firebase.firestoreGetDoc("projects", projectID).then(async (doc) => {
          let data = doc.data();
          if (!data) {
            let updatedProjectIDs = [];
            props.bookmarkedProjectIDs.map((id) => {
              if (id !== projectID) {
                updatedProjectIDs = [...updatedProjectIDs, id];
              }
              return null;
            });
            let updatedUserData = props.userData;
            updatedUserData.bookmarkedProjectIDs = updatedProjectIDs;
            await props.firebase.firestoreSet("users", props.userID, updatedUserData);
            props.setUserData(updatedUserData);
            props.setBookmarkedProjectIDs(updatedProjectIDs);
          } else {
            projectData = [...projectData, data];
            if (projectData.length === props.bookmarkedProjectIDs.length) {
              props.setBookmarkedProjectData(projectData);
            }
          }
        });
        return null;
      });
    }

    if (!props.likedSongData && props.likedSongIDs) {
      let songData = [];
      props.likedSongIDs.map(async (songID) => {
        await props.firebase.firestoreGetDoc("songs", songID).then(async (doc) => {
          let data = doc.data();
          if (!data) {
            let updatedSongIDs = [];
            props.likedSongIDs.map((id) => {
              if (id !== songID) {
                updatedSongIDs = [...updatedSongIDs, id];
              }
              return null;
            });
            let updatedUserData = props.userData;
            updatedUserData.likedSongIDs = updatedSongIDs;
            await props.firebase.firestoreSet("users", props.userID, updatedUserData);
            props.setUserData(updatedUserData);
            props.setLikedSongIDs(updatedSongIDs);
          } else {
            songData = [...songData, data];
            if (songData.length === props.likedSongIDs.length) {
              props.setLikedSongData(songData);
            }
          }
        });
        return null;
      });
    }

    if (!props.savedPlaylistData && props.savedPlaylistIDs) {
      let playlistData = [];
      props.savedPlaylistIDs.map(async (playlistID) => {
        await props.firebase.firestoreGetDoc("playlists", playlistID).then(async (doc) => {
          let data = doc.data();
          if (!data) {
            let updatedPlaylistIDs = [];
            props.savedPlaylistIDs.map((id) => {
              if (id !== playlistID) {
                updatedPlaylistIDs = [...updatedPlaylistIDs, id];
              }
              return null;
            });
            let updatedUserData = props.userData;
            updatedUserData.savedPlaylistIDs = updatedPlaylistIDs;
            await props.firebase.firestoreSet("users", props.userID, updatedUserData);
            props.setUserData(updatedUserData);
            props.setSavedPlaylistIDs(updatedPlaylistIDs);
          } else {
            playlistData = [...playlistData, data];
            if (playlistData.length === props.savedPlaylistIDs.length) {
              props.setSavedPlaylistData(playlistData);
            }
          }
        });
        return null;
      });
    }

    if (!props.createdPlaylistData && props.createdPlaylistIDs) {
      let playlistData = [];
      props.createdPlaylistIDs.map(async (playlistID) => {
        await props.firebase.firestoreGetDoc("playlists", playlistID).then((doc) => {
          let data = doc.data();
          playlistData = [...playlistData, data];
          if (playlistData.length === props.createdPlaylistIDs.length) {
            props.setCreatedPlaylistData(playlistData);
          }
        });
        return null;
      });
    }

    if (!props.homeState) {
      pushHistory(`${routes.HOME}/feed`);
    }
  });

  const bookmarkProject = async (
    bookmarkedProjectID,
    bookmarkedProjectData
  ) => {
    let user = props.userData;
    let projectData = bookmarkedProjectData;

    await props.firebase
      .firestoreGetDoc("artists", projectData.artistID)
      .then(async (doc) => {
        let artist = doc.data();

        if (!user.bookmarkedProjectIDs.includes(bookmarkedProjectID)) {
          user.bookmarkedProjectIDs = [
            ...user.bookmarkedProjectIDs,
            bookmarkedProjectID,
          ];
          artist.bookmarkCount++;
          projectData.bookmarkCount++;
        } else {
          let bookmarkedProjectIDs = [];
          user.bookmarkedProjectIDs.map((projectID) => {
            if (projectID !== bookmarkedProjectID) {
              bookmarkedProjectIDs = [...bookmarkedProjectIDs, projectID];
            }
            return null;
          });
          user.bookmarkedProjectIDs = bookmarkedProjectIDs;
          artist.bookmarkCount--;
          projectData.bookmarkCount--;
        }

        await props.firebase
          .firestoreSet("users", props.userID, user)
          .catch((error) => {
            alert("An error occured");
          });

        await props.firebase
          .firestoreSet("artists", projectData.artistID, artist)
          .catch((error) => {
            alert("An error occured");
          });

        await props.firebase
          .firestoreSet("projects", bookmarkedProjectID, projectData)
          .catch((error) => {
            alert("An error occured");
          });

        props.setBookmarkedProjectIDs(null);
      });
  };

  return (
    <Grid container direction="column" wrap="nowrap" className={props.body}>
      <Grid item style={{ width: "100%", marginBottom: "2.5vh" }}>
        <Grid container style={{ width: "100%" }}>
          <Grid item xs>
            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder={"Filter..."}
              tooltip={"Filter your material by name or title"}
            />
          </Grid>
          <Grid item style={{ height: "100%", marginLeft: "1.25vw" }}>
            <Paper
              style={{
                width: "10vh",
                height: "10vh",
                borderRadius: "0px",
                backgroundImage:
                  "linear-gradient(to right, blueviolet, mediumvioletred)",
              }}
              elevation={3}
            >
              <Grid
                container
                alignItems="center"
                justify="center"
                style={{ height: "100%", width: "100%" }}
              >
                <Grid item>
                  <SimpleIconButton
                    onClick={() => setSearch("")}
                    tooltip={"Clear search filter"}
                    icon={Close}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item style={{ marginLeft: "1.25vw" }}>
            <HeaderBar buttons={homeButtons(props.homeState)} />
          </Grid>
        </Grid>
      </Grid>
      {props.homeState === 0 && (
        <Grid
          item
          style={{
            height: "62.5vh",
            width: "100%",
          }}
        >
          <Paper
            elevation={3}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "0px",
              backgroundColor: "rgb(0,0,0,0.1)",
            }}
          >
            <Grid
              container
              direction="column"
              style={{
                height: "100%",
                width: "100%",
                overflow: "auto",
              }}
              wrap="nowrap"
              className={styles.scrollbars}
            >
              {props.followedArtistProjectData &&
                props.followedArtistProjectIDs &&
                props.followedArtistProjectData.map((data, index) => {
                  if (
                    data.title
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase()) ||
                    data.artist
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  )
                    return (
                      <Grid
                        item
                        style={{
                          width: "100%",
                          height: "17.5vh",
                          marginBottom: "2.5vh",
                        }}
                      >
                        <FeedProjectListing
                          bookmarkProject={() =>
                            bookmarkProject(
                              props.followedArtistProjectIDs[index],
                              data
                            )
                          }
                          index={index}
                          projectData={data}
                          projectID={props.followedArtistProjectIDs[index]}
                          {...props}
                        />
                      </Grid>
                    );
                  return null;
                })}
            </Grid>
          </Paper>
        </Grid>
      )}
      {props.homeState === 1 && (
        <Grid item style={{ width: "100%", height: "100%" }}>
          <UserLibrary {...props} search={search} />
        </Grid>
      )}
      {props.homeState === 2 && (
        <Grid item style={{ width: "100%", height: "62.5vh" }}>
          <PlaylistManagement {...props} search={search} />
        </Grid>
      )}
    </Grid>
  );
};

const HomeComposed = compose(withFirebase)(HomeBase);

export default function Search(props) {
  return <HomeComposed {...props} />;
}
