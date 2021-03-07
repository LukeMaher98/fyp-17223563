import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import HeaderBar from "../MiscComponents/HeaderBar";
import { contentIcons } from "../../constants/icons";
import { pushHistory, replaceHistory } from "../../constants/utils";
import { contentDisplayButtons } from "../../constants/buttons";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import SongItem from "../ItemComponents/SongItem";
import ProjectItem from "../ItemComponents/ProjectItem";
import PlaylistItem from "../ItemComponents/PlaylistItem";
import ArtistItem from "../ItemComponents/ArtistItem";
import { useStyles } from "../../constants/styling";

const SearchBase = (props) => {
  const styles = useStyles();
  const PanelIcon = props.searchIndex
    ? contentIcons[props.searchIndex]
    : contentIcons[0];

  const [hovered, setHovered] = useState(null);
  const [displayData, setDisplayData] = useState(null);
  const [displayIDs, setDisplayIDs] = useState(null);

  const getCurrentHeader = () => {
    switch (true) {
      case props.searchIndex === 0:
        return `"${props.searchField}" Songs`;
      case props.searchIndex === 1:
        return `"${props.searchField}" Projects`;
      case props.searchIndex === 2:
        return `"${props.searchField}" Artists`;
      case props.searchIndex === 3:
        return `"${props.searchField}" Playlists`;
      default:
        return null;
    }
  };

  const playSong = (songID, songData) => {
    props.setCurrentSongIndex(null);
    props.setPlayerSongIDs([songID]);
    props.setPlayerSongData([songData]);
    props.setCurrentSongIndex(0);
  };

  useEffect(() => {
    if (!props.searchField) {
      let searchTerms = window.location.href.split("/");
      if (searchTerms[4]) {
        props.setSearchField(searchTerms[4]);
      } else {
        replaceHistory(`${routes.HOME}/feed`);
      }
    }

    const doSearch =
      props.searchField &&
      (!props.searchArtistData ||
        !props.searchArtistIDs ||
        !props.searchProjectData ||
        !props.searchProjectIDs ||
        !props.searchSongData ||
        !props.searchSongIDs ||
        !props.searchPlaylistData ||
        !props.searchPlaylistIDs);

    const searchProjects = async (terms) => {
      let searchedProjectData = [];
      let searchedProjectIDs = [];
      await props.firebase
        .firestoreGetFlat("projects")
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            let id = doc.id;
            terms.map((term) => {
              if (
                data.title
                  .toLocaleLowerCase()
                  .includes(term.toLocaleLowerCase()) &&
                !searchedProjectData.includes(data) &&
                data.debutDate.seconds * 1000 < new Date().getTime()
              ) {
                searchedProjectData = [data, ...searchedProjectData];
                searchedProjectIDs = [id, ...searchedProjectIDs];
              }
            });
          });
        });
      props.setSearchProjectData(searchedProjectData);
      props.setSearchProjectIDs(searchedProjectIDs);
    };

    const searchArtists = async (terms) => {
      let searchedArtistData = [];
      let searchedArtistIDs = [];
      await props.firebase.firestoreGetFlat("artists").then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          let id = doc.id;
          terms.map((term) => {
            if (
              data.name
                .toLocaleLowerCase()
                .includes(term.toLocaleLowerCase()) &&
              !searchedArtistData.includes(data)
            ) {
              searchedArtistData = [data, ...searchedArtistData];
              searchedArtistIDs = [id, ...searchedArtistIDs];
            }
          });
        });
      });
      props.setSearchArtistData(searchedArtistData);
      props.setSearchArtistIDs(searchedArtistIDs);
    };

    const searchSongs = async (terms) => {
      let searchedSongData = [];
      let searchedSongIDs = [];
      await props.firebase.firestoreGetFlat("songs").then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          let id = doc.id;
          terms.map((term) => {
            if (
              data.title
                .toLocaleLowerCase()
                .includes(term.toLocaleLowerCase()) &&
              !searchedSongData.includes(data) &&
              data.debutDate.seconds * 1000 < new Date().getTime()
            ) {
              searchedSongData = [data, ...searchedSongData];
              searchedSongIDs = [id, ...searchedSongIDs];
            }
          });
        });
      });
      props.setSearchSongData(searchedSongData);
      props.setSearchSongIDs(searchedSongIDs);
    };

    const searchPlaylists = async (terms) => {
      let searchedPlaylistData = [];
      let searchedPlaylistIDs = [];
      await props.firebase
        .firestoreGetFlat("playlists")
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            let id = doc.id;
            terms.map((term) => {
              if (
                data.playlistName
                  .toLocaleLowerCase()
                  .includes(term.toLocaleLowerCase()) &&
                !searchedPlaylistData.includes(data)
              ) {
                searchedPlaylistData = [data, ...searchedPlaylistData];
                searchedPlaylistIDs = [id, ...searchedPlaylistIDs];
              }
            });
          });
        })
        .then(() => {
          props.setSearchPlaylistData(searchedPlaylistData);
          props.setSearchPlaylistIDs(searchedPlaylistIDs);
        });
    };

    if (doSearch) {
      let searchTerms = props.searchField.split(" ");
      if (searchTerms.length > 1) {
        searchTerms = [props.searchField, ...searchTerms];
      }
      searchArtists(searchTerms);
      searchProjects(searchTerms);
      searchSongs(searchTerms);
      searchPlaylists(searchTerms);
      const state = `${window.location.protocol}//${window.location.host}${routes.SEARCH}/${props.searchField}`;
      window.history.replaceState({ path: state }, "", state);
    }

    if (
      props.searchIndex === 0 &&
      props.searchSongData &&
      displayData !== props.searchSongData
    ) {
      setDisplayIDs(props.searchSongIDs);
      setDisplayData(props.searchSongData);
    }

    if (
      props.searchIndex === 1 &&
      props.searchProjectData &&
      displayData !== props.searchProjectData
    ) {
      setDisplayIDs(props.searchProjectIDs);
      setDisplayData(props.searchProjectData);
    }

    if (
      props.searchIndex === 2 &&
      props.searchArtistData &&
      displayData !== props.searchArtistData
    ) {
      setDisplayIDs(props.searchArtistIDs);
      setDisplayData(props.searchArtistData);
    }

    if (
      props.searchIndex === 3 &&
      props.searchPlaylistData &&
      displayData !== props.searchPlaylistData
    ) {
      setDisplayIDs(props.searchPlaylistIDs);
      setDisplayData(props.searchPlaylistData);
    }
  });

  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid item style={{ width: "100%", marginBottom: "2.5vh" }}>
        <HeaderBar
          content={`Search results for "${props.searchField}"`}
          icon={Search}
        />
      </Grid>
      <Grid item xs style={{ width: "100%", marginBottom: "2.5vh" }}>
        <Grid container style={{ width: "100%", height: "100%" }}>
          <Grid
            item
            style={{
              height: "100%",
              width: "5vw",
            }}
          >
            <Paper
              style={{
                width: "5vw",
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
                direction="column"
                style={{ height: "100%", width: "100%", paddingTop: "2.5vh" }}
              >
                {contentDisplayButtons(
                  props.searchIndex,
                  props.setSearchIndex,
                  "searched"
                ).map((data) => {
                  return (
                    <Grid item style={{ paddingBottom: "2.5vh" }}>
                      <SimpleIconButton
                        dims={"2.5vw"}
                        onClick={data.onClick}
                        condition={data.condition}
                        icon={data.icon}
                        tooltip={data.tooltip}
                        placement={"left"}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs style={{ height: "100%", marginLeft: "1.25vw" }}>
            <Accordion
              style={{
                width: "100%",
                borderRadius: "0px",
                backgroundColor: "rgb(0,0,0,0)",
              }}
              expanded={true}
            >
              <AccordionSummary
                style={{
                  backgroundImage: `linear-gradient(to left, blueviolet, mediumvioletred )`,
                  cursor: "default",
                  padding: "0px",
                  height: "10vh",
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  justify="space-between"
                  style={{
                    width: "100%",
                    height: "100%",
                    paddingRight: "1.25vw",
                  }}
                >
                  <Grid item style={{ width: "5vw", height: "10vh" }}>
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "indigo",
                      }}
                    >
                      <Grid item>
                        <PanelIcon
                          fontSize="large"
                          style={{
                            color: "white",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs style={{ marginLeft: "1.25vw" }}>
                    <Typography variant={"h4"} style={{ color: "white" }}>
                      {getCurrentHeader()}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  padding: "0px",
                  backgroundImage: `linear-gradient(to right, rgb(199,21,133, 0.5), rgb(138,43,226, 0.5))`,
                  width: "100%",
                  height: "52.5vh",
                }}
              >
                <Grid
                  className={styles.scrollbars}
                  container
                  justify="flex-start"
                  alignItems="glex-start"
                  style={{
                    width: "100%",
                    height: "100%",
                    paddingTop: "2.5vh",
                    paddingLeft: "1.25vw",
                    overflow: "auto",
                  }}
                >
                  {displayData &&
                    displayIDs &&
                    displayData.map((data, index) => {
                      return (
                        <Grid
                          item
                          style={{
                            marginRight: "1.25vw",
                            marginBottom: "2.5vh",
                          }}
                        >
                          {props.searchIndex === 0 && (
                            <SongItem
                              songData={data}
                              index={index}
                              hovered={hovered}
                              songID={displayIDs[index]}
                              setHovered={setHovered}
                              itemFunction={() =>
                                playSong(displayIDs[index], data)
                              }
                            />
                          )}
                          {props.searchIndex === 1 && (
                            <ProjectItem
                              {...props}
                              projectData={data}
                              index={index}
                              projectID={displayIDs[index]}
                              hovered={hovered}
                              artistID={data.artistID}
                              setHovered={setHovered}
                              itemFunction={() => {
                                props.setCurrentProjectID(null);
                                props.setCurrentProjectData(null);
                                props.setCurrentProjectArtistID(null);
                                props.setCurrentProjectArtistData(null);
                                pushHistory(
                                  routes.PROJECT,
                                  `?aid=${data.artistID}&pid=${displayIDs[index]}`
                                );
                              }}
                            />
                          )}
                          {props.searchIndex === 2 && (
                            <ArtistItem
                              {...props}
                              artistData={data}
                              index={index}
                              artistID={displayIDs[index]}
                              hovered={hovered}
                              setHovered={setHovered}
                              itemFunction={() => {
                                props.setCurrentArtistID(null);
                                props.setCurrentArtistData(null);
                                pushHistory(
                                  routes.ARTIST_DISPLAY,
                                  `?aid=${displayIDs[index]}`
                                );
                              }}
                            />
                          )}
                          {props.searchIndex === 3 && (
                            <PlaylistItem
                              {...props}
                              playlistData={data}
                              index={index}
                              playlistID={displayIDs[index]}
                              hovered={hovered}
                              setHovered={setHovered}
                              itemFunction={() => {
                                props.setCurrentPlaylistID(null);
                                props.setCurrentPlaylistData(null);
                                pushHistory(
                                  routes.PLAYLIST,
                                  `?pid=${displayIDs[index]}`
                                );
                              }}
                            />
                          )}
                        </Grid>
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const SearchComposed = compose(withFirebase)(SearchBase);

export default function SearchComponent(props) {
  return <SearchComposed {...props} />;
}
