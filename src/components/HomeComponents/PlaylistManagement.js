import React from "react";
import { Grid, Paper, } from "@material-ui/core";
import { Add, ViewList } from "@material-ui/icons";
import { withFirebase } from "../../firebase/context";
import { withAWS } from "../../AWS/context";
import { compose } from "recompose";

import PlaylistForm from "./PlaylistForm";
import PlaylistListing from "./PlaylistListing";
import Playlist from "./Playlist";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";

const PlaylistManagementBase = (props) => {
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
            <Grid item style={{ paddingBottom: "2.5vh" }}>
              <SimpleIconButton
                icon={Add}
                onClick={() => {
                  props.setCurrentPlaylistIndex(null);
                  props.setPlaylistState(0);
                }}
                tooltip={"Create new playlist"}
                placement={"left"}
                condition={props.playlistState === 0}
              />
            </Grid>
            <Grid item style={{ paddingBottom: "2.5vh" }}>
              <SimpleIconButton
                icon={ViewList}
                onClick={() => {
                  props.setCurrentPlaylistIndex(null);
                  props.setPlaylistState(1);
                }}
                tooltip={"Display your created playlists"}
                placement={"left"}
                condition={props.playlistState === 1 && props.currentPlaylistIndex === null}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      {props.playlistState === 0 && (
        <Grid
          item
          style={{
            height: "62.5vh",
            width: "68.75vw",
            marginBottom: "2.5vh",
            marginLeft: "1.25vw",
          }}
        >
          <PlaylistForm {...props} />
        </Grid>
      )}
      {props.playlistState === 1 && props.currentPlaylistIndex === null && (
        <Grid
          item
          xs
          style={{
            height: "62.5vh",
            marginLeft: "1.25vw",
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
            >
              {props.createdPlaylistData &&
                props.createdPlaylistIDs &&
                props.createdPlaylistData.map((data, index) => {
                  if (
                    data.playlistName
                      .toLocaleLowerCase()
                      .includes(props.search.toLocaleLowerCase())
                  )
                    return (
                      <Grid
                        item
                        style={{
                          height: "10vh",
                          width: "100%",
                          marginBottom: "2.5vh",
                        }}
                      >
                        <PlaylistListing
                          {...props}
                          index={index}
                          playlistData={data}
                          playlistID={props.createdPlaylistIDs[index]}
                        />
                      </Grid>
                    );
                })}
            </Grid>
          </Paper>
        </Grid>
      )}
      {props.playlistState === 1 && props.currentPlaylistIndex !== null && (
        <Grid
          item
          xs
          style={{
            height: "100%",
            marginBottom: "2.5vh",
            marginLeft: "1.25vw",
          }}
        >
          <Playlist
            {...props}
            playlistID={props.createdPlaylistIDs[props.currentPlaylistIndex]}
            playlistData={props.createdPlaylistData[props.currentPlaylistIndex]}
          />
        </Grid>
      )}
    </Grid>
  );
};

const PlaylistManagementComposed = compose(
  withFirebase,
  withAWS
)(PlaylistManagementBase);

export default function PlaylistManagement(props) {
  return <PlaylistManagementComposed {...props} />;
}
