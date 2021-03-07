import React, { useEffect } from "react";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { Grid, Paper } from "@material-ui/core";
import PlaylistHeading from "./PlaylistHeading";
import PlaylistSongListing from "./PlaylistSongListing";
import { useStyles } from "../../constants/styling";

const PlaylistBase = (props) => {
  const styles = useStyles();

  useEffect(() => {
    if (
      props.currentPlaylistSongIDs !==
      props.createdPlaylistData[props.currentPlaylistIndex].songIDs
    ) {
      props.setCurrentPlaylistSongIDs(
        props.createdPlaylistData[props.currentPlaylistIndex].songIDs
      );
      props.setCurrentPlaylistSongData(null);
    }

    if (props.currentPlaylistSongIDs && !props.currentPlaylistSongData) {
      let songData = [];
      props.currentPlaylistSongIDs.map(async (songID) => {
        await props.firebase.firestoreGetDoc("songs", songID).then(async (doc) => {
          let data = doc.data();
          if (!data) {
            let updatedSongIDs = [];
            props.currentPlaylistSongIDs.map((id) => {
              if (id !== songID) {
                updatedSongIDs = [...updatedSongIDs, id];
              }
            });
            let updatedPlaylistData = props.createdPlaylistData;
            updatedPlaylistData[
              props.currentPlaylistIndex
            ].songIDs = updatedSongIDs;
            await props.firebase.firestoreSet(
              "playlists",
              props.createdPlaylistIDs[props.currentPlaylistIndex],
              updatedPlaylistData
            );
            props.setCreatedPlaylistData(updatedPlaylistData);
          } else {
            songData = [...songData, data];
            if (songData.length === props.currentPlaylistSongIDs.length) {
              props.setCurrentPlaylistSongData(songData);
            }
          }
        });
      });
    }
  });

  const playSong = (index) => {
    props.setPlaylistSongIDs([
      props.currentPlaylistSongIDs[index],
      ...props.playerSongIDs,
    ]);
    props.setDisplaySongData([
      props.currentPlaylistSongData[index],
      ...props.playerSongData,
    ]);
  };

  const queueSong = (index) => {
    props.setPlaylistSongIDs([
      ...props.playerSongIDs,
      props.currentPlaylistSongIDs[index],
    ]);
    props.setDisplaySongData([
      ...props.playerSongIDs,
      props.currentPlaylistSongData[index],
    ]);
  };

  const playPlaylist = () => {
    props.setPlaylistSongIDs([
      ...props.currentPlaylistSongIDs,
      ...props.playerSongIDs,
    ]);
    props.setDisplaySongData([
      ...props.currentPlaylistSongData,
      ...props.playerSongData,
    ]);
  };

  const queuePlaylist = () => {
    props.setPlaylistSongIDs([
      ...props.playerSongIDs,
      ...props.currentPlaylistSongIDs,
    ]);
    props.setDisplaySongData([
      ...props.playerSongData,
      ...props.currentPlaylistSongData,
    ]);
  };

  return (
    <Grid
      container
      direction="column"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Grid
        item
        style={{
          height: "10vh",
          marginBottom: "2.5vh",
          width: "100%",
        }}
      >
        <PlaylistHeading
          {...props}
          playPlaylist={playPlaylist}
          queuePlaylist={queuePlaylist}
        />
      </Grid>
      <Grid
        item
        style={{
          height: "50vh",
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
            className={styles.scrollbars}
            container
            direction="column"
            style={{
              height: "100%",
              width: "100%",
              overflow: "auto",
            }}
            wrap="nowrap"
          >
            {props.currentPlaylistSongData &&
              props.currentPlaylistSongIDs &&
              props.currentPlaylistSongData.map((data, index) => {
                if (
                  data.title
                    .toLocaleLowerCase()
                    .includes(props.search.toLocaleLowerCase())
                )
                  return (
                    <Grid
                      item
                      style={{
                        height: "10vh",
                        width: "100%",
                      }}
                    >
                      <PlaylistSongListing
                        {...props}
                        index={index}
                        songData={data}
                        songID={props.currentPlaylistSongIDs[index]}
                        playSong={() => playSong(index)}
                        queueSong={() => queueSong(index)}
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

const PlaylistComposed = compose(withFirebase)(PlaylistBase);

export default function Playlist(props) {
  return <PlaylistComposed {...props} />;
}
