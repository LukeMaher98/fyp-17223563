import React from "react";
import { Grid, Paper, Typography, Tooltip } from "@material-ui/core";
import { Clear, FilterNone, Mic, Person } from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { pushHistory } from "../../constants/utils";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { useStyles } from "../../constants/styling";

const LibraryArtistListingBase = (props) => {
  const styles = useStyles();

  const url =
    props.artistData.imageVersion === 0
      ? props.followedArtistIDs[props.index]
      : `${props.followedArtistIDs[props.index]}_${
          props.artistData.imageVersion - 1
        }`;

  const removeArtist = async () => {
    let user = props.userData;
    let artist = props.artistData

    let followedArtistIDs = [];
    user.followedArtistIDs.map((artistID) => {
      if (artistID !== props.followedArtistIDs[props.index]) {
        followedArtistIDs = [...followedArtistIDs, artistID];
      }
    });
    user.followedArtistIDs = followedArtistIDs;
    artist.followCount--;

    await props.firebase
      .firestoreSet("users", props.userID, user)
      .catch((error) => {
        alert(error);
      });

      await props.firebase
      .firestoreSet("projects", props.followedArtistIDs[props.index], artist)
      .catch((error) => {
        alert(error);
      });

    props.setUserData(user);
    props.setFollowedArtistIDs(null)
  };

  return (
    <Paper
      elevation={3}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "0px",
        backgroundImage: `linear-gradient(to right, ${props.artistData.themeLight}, ${props.artistData.themeDark})`,
      }}
    >
      <Grid
        container
        alignItems="center"
        style={{
          width: "100%",
          height: "100%",
          paddingRight: "1.25vw",
        }}
      >
        <Grid item style={{ height: "100%", width: "10vh" }}>
          <Paper
            style={{
              borderRadius: "0px",
              width: "100%",
              height: "100%",
              backgroundImage: `url(https://debut-image-files.s3-eu-west-1.amazonaws.com/artistImages/${url})`,
              backgroundSize: "100% 100%",
            }}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Artist"} placement="top" arrow>
            <Person style={{ color: "white" }} />
          </Tooltip>
        </Grid>
        <Grid
          item
          xs
          style={{ overflow: "auto", marginLeft: "1.25vw", maxHeight: "7.5vh" }}
          className={styles.scrollbars}
        >
          <Typography
            variant="subtitle1"
            style={{
              color: "white",
            }}
          >
            {props.artistData.name}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <Tooltip title={"Projects in discography"} placement="top" arrow>
            <FilterNone style={{ color: "white" }} />
          </Tooltip>
        </Grid>
        <Grid
          item
          xs
          style={{ overflow: "auto", marginLeft: "1.25vw", maxHeight: "7.5vh" }}
          className={styles.scrollbars}
        >
          <Typography
            variant="subtitle1"
            style={{
              color: "white",
            }}
          >
            {props.artistData.projectIDs.length}
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={Mic}
            onClick={() => {
              props.setCurrentArtistID(null);
              props.setCurrentArtistData(null);
              pushHistory(
                routes.ARTIST_DISPLAY,
                `?aid=${props.followedArtistIDs[props.index]}`
              );
            }}
            tooltip={"Go to artist display page"}
          />
        </Grid>
        <Grid item style={{ marginLeft: "1.25vw" }}>
          <SimpleIconButton
            icon={Clear}
            onClick={removeArtist}
            tooltip={"Remove artist from your library"}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const LibraryArtistListingComposed = compose(withFirebase)(
  LibraryArtistListingBase
);

export default function LibraryArtistListing(props) {
  return <LibraryArtistListingComposed {...props} />;
}
