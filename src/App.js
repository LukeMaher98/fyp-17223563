import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "./history";
import * as routes from "./constants/routes";
import LoginContainer from "./containers/LoginContainer";
import PasswordRecoveryContainer from "./containers/PasswordRecoveryContainer";
import PasswordResetContainer from "./containers/PasswordResetContainer";
import { withFirebase } from "./firebase/context";
import { withAWS } from "./AWS";
import { compose } from "recompose";
import { makeStyles, Grid } from "@material-ui/core";
import MusicPlayer from "react-responsive-music-player";

import SearchContainer from "./containers/SearchContainer";
import MainNavContainer from "./containers/MainNavContainer";
import ArtistManagementContainer from "./containers/ArtistManagementContainer";
import GenreBrowserContainer from "./containers/GenreBrowserContainer";
import GenreDisplayContainer from "./containers/GenreDisplayContainer";
import ProjectDisplayContainer from "./containers/ProjectDisplayContainer";
import ArtistDisplayContainer from "./containers/ArtistDisplayContainer";
import HomeContainer from "./containers/HomeContainer";
import PlaylistDisplayContainer from "./containers/PlaylistDisplayContainer";

const useStyles = makeStyles((theme) => ({
  loggedIn: {
    minWidth: "100vw",
    minHeight: "87.5vh",
    paddingLeft: "12.5vw",
    paddingRight: "12.5vw",
    marginTop: "12.5vh",
  },
  loggedOut: {
    minWidth: "100vw",
    minHeight: "97.5vh",
    paddingLeft: "12.5vw",
    paddingRight: "12.5vw",
    marginTop: "2.5vh",
  },
  page: {
    backgroundImage: "linear-gradient(to bottom, indigo, darkmagenta)",
    overflow: "hidden",
  },
}));

function AppBase(props) {
  const classes = useStyles();

  useEffect(() => {
    props.firebase.auth.onAuthStateChanged((authUser) => {
      if (authUser !== null) {
        props.setUserAuth(authUser);
      } else {
        props.setUserAuth(false);
        props.setUserID(null);
        props.setUserData(null);
        props.setUserArtistIDs(null);
        props.setUserArtistData(null);
        props.setArtistProjectIDs(null);
        props.setArtistProjectData(null);
        props.setProjectSongIDs(null);
        props.setProjectSongData(null);
        props.setCurrentProjectIndex(null);
        props.setCurrentArtistIndex(null);
        props.setCurrentPlaylistIndex(null);
        props.setCreatedPlaylistIDs(null);
        props.setCreatedPlaylistData(null);
        props.setCurrentPlaylistSongIDs(null);
        props.setCurrentPlaylistSongData(null);
        props.setFollowedArtistIDs(null);
        props.setFollowedArtistData(null);
        props.setFollowedArtistProjectIDs(null);
        props.setFollowedArtistProjectData(null);
        props.setLikedSongIDs(null);
        props.setLikedSongData(null);
        props.setBookmarkedProjectIDs(null);
        props.setBookmarkedProjectData(null);
        props.setSavedPlaylistIDs(null);
        props.setSavedPlaylistData(null);
      }
    });

    const getUserInfo = async () => {
      await props.firebase
        .firestoreGet1("users", "email", props.currentUser.email)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let id = doc.id;
            let data = doc.data();
            props.setUserID(id);
            props.setUserData(data);
          });
        });
    };

    if (props.currentUser && (!props.userData || !props.userID)) {
      getUserInfo();
    }
  });

  const authenticator = (condition, route, component) => {
    if (condition === true) {
      return props.currentUser ? component : () => <Redirect to={route} />;
    } else {
      return props.currentUser ? () => <Redirect to={route} /> : component;
    }
  };

  return (
    <Grid container className={classes.page} justify="center">
      {props.currentUser !== null && (
        <Grid
          item
          className={
            props.currentUser !== false ? classes.loggedIn : classes.loggedOut
          }
        >
          {props.currentUser !== false && <MainNavContainer />}
          <Router history={history}>
            <Switch>
              <Route
                path={routes.ARTIST}
                exact={true}
                component={authenticator(
                  true,
                  routes.LOGIN,
                  ArtistManagementContainer
                )}
              />
              <Route
                path={`${routes.GENRE}/browser`}
                exact={true}
                component={authenticator(
                  true,
                  routes.LOGIN,
                  GenreBrowserContainer
                )}
              />
              <Route
                path={`${routes.GENRE}/:genre`}
                exact={false}
                component={authenticator(
                  true,
                  routes.LOGIN,
                  GenreDisplayContainer
                )}
              />
              <Route
                path={routes.PROJECT}
                exact={true}
                component={authenticator(
                  true,
                  routes.LOGIN,
                  ProjectDisplayContainer
                )}
              />
              <Route
                path={routes.ARTIST_DISPLAY}
                exact={true}
                component={authenticator(
                  true,
                  routes.LOGIN,
                  ArtistDisplayContainer
                )}
              />
              <Route
                path={routes.PLAYLIST}
                exact={true}
                component={authenticator(
                  true,
                  routes.LOGIN,
                  PlaylistDisplayContainer
                )}
              />
              <Route
                path={`${routes.PROJECT}/:artist/:project`}
                exact={false}
                component={authenticator(
                  true,
                  routes.LOGIN,
                  ProjectDisplayContainer
                )}
              />
              <Route
                path={`${routes.ARTIST_DISPLAY}/:artist`}
                exact={false}
                component={authenticator(
                  true,
                  routes.LOGIN,
                  ArtistDisplayContainer
                )}
              />
              <Route
                path={`${routes.PLAYLIST}/:playlist`}
                exact={false}
                component={authenticator(
                  true,
                  routes.LOGIN,
                  PlaylistDisplayContainer
                )}
              />
              <Route
                path={routes.SEARCH}
                exact={true}
                component={authenticator(true, routes.LOGIN, SearchContainer)}
              />
              <Route
                path={`${routes.SEARCH}/:search/`}
                exact={false}
                component={authenticator(true, routes.LOGIN, SearchContainer)}
              />
              <Route
                path={`${routes.HOME}/feed`}
                homeState={0}
                exact={true}
                component={authenticator(true, routes.LOGIN, () => (
                  <HomeContainer homeState={0} />
                ))}
              />
              <Route
                path={`${routes.HOME}/library`}
                exact={true}
                component={authenticator(true, routes.LOGIN, () => (
                  <HomeContainer homeState={1} />
                ))}
              />
              <Route
                path={`${routes.HOME}/playlists`}
                homeState={0}
                exact={true}
                component={authenticator(true, routes.LOGIN, () => (
                  <HomeContainer homeState={2} />
                ))}
              />
              <Route
                path={routes.HOME}
                exact={false}
                component={authenticator(true, routes.LOGIN, HomeContainer)}
              />
              <Route
                exact
                path={routes.LOGIN}
                component={authenticator(false, routes.HOME, LoginContainer)}
              />
              <Route
                exact
                path={routes.PASSWORD_RECOVERY}
                component={authenticator(
                  false,
                  routes.HOME,
                  PasswordRecoveryContainer
                )}
              />
              <Route
                exact
                path={routes.PASSWORD_RESET}
                component={authenticator(
                  false,
                  routes.HOME,
                  PasswordResetContainer
                )}
              />
              <Route
                path={routes.LANDING}
                component={() => {
                  return <Redirect to={routes.HOME} />;
                }}
              />
            </Switch>
          </Router>
        </Grid>
      )}
    </Grid>
  );
}

const AppComposed = compose(withFirebase, withAWS)(AppBase);

export default function App(props) {
  return <AppComposed {...props} />;
}
