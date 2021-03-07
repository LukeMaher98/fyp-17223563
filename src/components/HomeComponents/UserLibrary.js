import React from "react";
import { Grid, Paper } from "@material-ui/core";
import { withFirebase } from "../../firebase/context";
import { contentDisplayButtons } from "../../constants/buttons";
import SimpleIconButton from "../../components/MiscComponents/SimpleIconButton";
import { compose } from "recompose";

import LibrarySongListing from "./LibrarySongListing";
import LibraryProjectListing from "./LibraryProjectListing";
import LibraryArtistListing from "./LibraryArtistListing";
import LibraryPlaylistListing from "./LibraryPlaylistListing";
import { useStyles } from "../../constants/styling";

const UserLibraryBase = (props) => {
const styles = useStyles()

  return (
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
            backgroundImage: "linear-gradient(to right, blueviolet, mediumvioletred)",
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
              props.libraryState,
              props.setLibraryState,
              "your saved"
            ).map((data) => {
              return (
                <Grid item style={{ paddingBottom: "2.5vh" }}>
                  <SimpleIconButton
                    onClick={data.onClick}
                    condition={data.condition}
                    icon={data.icon}
                    placement={"left"}
                    tooltip={data.tooltip}
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
          marginLeft: "1.25vw",
          height: "62.5vh",
          width: "68.75vw"
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
            {props.libraryState === 0 &&
              props.likedSongData &&
              props.likedSongIDs &&
              props.likedSongData.map((data, index) => {
                if (
                  data.title
                    .toLocaleLowerCase()
                    .includes(props.search.toLocaleLowerCase()) ||
                  data.artist
                    .toLocaleLowerCase()
                    .includes(props.search.toLocaleLowerCase()) ||
                  data.project
                    .toLocaleLowerCase()
                    .includes(props.search.toLocaleLowerCase())
                )
                  return (
                    <Grid
                      item
                      style={{
                        width: "100%",
                        minHeight: "10vh",
                      }}
                    >
                      <LibrarySongListing
                        {...props}
                        songData={data}
                        index={index}
                      />
                    </Grid>
                  );
              })}
            {props.libraryState === 1 &&
              props.bookmarkedProjectData &&
              props.bookmarkedProjectIDs &&
              props.bookmarkedProjectData.map((data, index) => {
                if (
                  data.title
                    .toLocaleLowerCase()
                    .includes(props.search.toLocaleLowerCase()) ||
                  data.artist
                    .toLocaleLowerCase()
                    .includes(props.search.toLocaleLowerCase())
                )
                  return (
                    <Grid
                      item
                      style={{
                        width: "100%",
                        minHeight: "10vh",
                      }}
                    >
                      <LibraryProjectListing
                        {...props}
                        projectData={data}
                        index={index}
                      />
                    </Grid>
                  );
              })}
            {props.libraryState === 2 &&
              props.followedArtistData &&
              props.followedArtistIDs &&
              props.followedArtistData.map((data, index) => {
                if (
                  data.name
                    .toLocaleLowerCase()
                    .includes(props.search.toLocaleLowerCase())
                )
                  return (
                    <Grid
                      item
                      style={{
                        width: "100%",
                        minHeight: "10vh",
                      }}
                    >
                      <LibraryArtistListing
                        {...props}
                        artistData={data}
                        index={index}
                      />
                    </Grid>
                  );
              })}
            {props.libraryState === 3 &&
              props.savedPlaylistData &&
              props.savedPlaylistIDs &&
              props.savedPlaylistData.map((data, index) => {
                if (
                  data.playlistName
                    .toLocaleLowerCase()
                    .includes(props.search.toLocaleLowerCase())
                )
                  return (
                    <Grid
                      item
                      style={{
                        width: "100%",
                        minHeight: "10vh",
                      }}
                    >
                      <LibraryPlaylistListing
                        {...props}
                        playlistData={data}
                        playlistID={props.savedPlaylistIDs[index]}
                        index={index}
                      />
                    </Grid>
                  );
              })}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

const UserLibraryComposed = compose(withFirebase)(UserLibraryBase);

export default function UserLibraryFeed(props) {
  return <UserLibraryComposed {...props} />;
}
