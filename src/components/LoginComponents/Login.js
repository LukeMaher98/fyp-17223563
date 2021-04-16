import React, { useState } from "react";
import { Typography, Grid, Paper, Link } from "@material-ui/core";
import { withFirebase } from "../../firebase";
import * as routes from "../../constants/routes";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import FormTextfield from "../FormComponents/FormTextfield";
import {
  AlternateEmail,
  Business,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Edit,
  Help,
  Language,
  Lock,
  LockOpen,
  LockOutlined,
  Person,
} from "@material-ui/icons";
import TextIconButton from "../MiscComponents/TextIconButton";
import { pushHistory } from "../../constants/utils";
import PasswordCheck from "./PasswordCheck";
import { newUserData } from "../../constants/templates";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import gdpr from "../../documents/GDPR Agreement.pdf";
import eula from "../../documents/EULA Agreement.pdf";

const LoginFormBase = (props) => {
  const [login, setLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState(null);
  const [loginPassword, setLoginPassword] = useState(null);
  const [signupEmail, setSignupEmail] = useState(null);
  const [signupPassword, setSignupPassword] = useState(null);
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState(null);
  const [username, setUsername] = useState(null);

  const emailLogIn = async (event) => {
    await props.firebase
      .doSignInWithEmailAndPassword(loginEmail, loginPassword)
      .then(() => {
        clearFields();
      })
      .catch((error) => {
        alert(error);
      });
    event.preventDefault();
  };

  const emailSignUp = async (event) => {
    await props.firebase
      .doCreateUserWithEmailAndPassword(signupEmail, signupPassword)
      .then(async () => {
        clearFields();
        await props.firebase.firestoreAdd(
          "users",
          newUserData(signupEmail, username)
        );
      })
      .catch((error) => {
        alert(error);
      });
  };

  const googleSignIn = async () => {
    await props.firebase
      .doSignInWithGoogle()
      .then(async (res) => {
        clearFields();
        if (res.additionalUserInfo.isNewUser) {
          await props.firebase.firestoreAdd(
            "users",
            newUserData(
              res.additionalUserInfo.profile.email,
              res.additionalUserInfo.profile.email.split("@")[0]
            )
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const clearFields = () => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupPasswordConfirm("");
  };

  const canSignUp =
    signupEmail &&
    signupPassword &&
    signupPassword === signupPasswordConfirm &&
    signupPassword.length >= 8;

  return (
    <Grid container direction="column" alignItems="center">
      <Grid
        item
        style={{ height: "10vh", width: "25vw", marginBottom: "2.5vh" }}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          style={{
            height: "100%",
            width: "100%",
            paddingLeft: "1.25vw",
            paddingRight: "1.25vw",
          }}
        >
          <Grid item>
            <Typography
              variant="h2"
              style={{
                fontFamily: "Lucida Console, Courier, monospace",
                color: "white",
              }}
            >
              Debut
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        style={{ height: "70vh", width: "100%", marginBottom: "2.5vh" }}
      >
        <Grid
          container
          alignItems="center"
          style={{ height: "70vh", width: "100%" }}
        >
          <Grid
            item
            style={{
              height: login ? "100%" : "87.5%",
              width: login ? "41.484375vw" : "32.265625vw",
              marginRight: "0.625vw",
            }}
          >
            <Paper
              disabled={!login}
              elevation={3}
              style={{
                height: "100%",
                width: login ? "100%" : "32.265625vw",
                borderRadius: "0px",
                opacity: login ? 1 : 0.5,
                backgroundImage: `linear-gradient(to right, indigo, purple)`,
              }}
            >
              <Grid
                container
                direction="column"
                justify="space-between"
                alignItems="center"
                style={{
                  height: "100%",
                  width: "100%",
                  paddingTop: "2.5vh",
                  paddingBottom: "2.5vh",
                  paddingLeft: "1.25vw",
                  paddingRight: "1.25vw",
                }}
              >
                <Grid
                  item
                  style={{
                    height: "10vh",
                  }}
                >
                  <Typography
                    variant="h3"
                    style={{
                      color: "white",
                      fontFamily: "Lucida Console, Courier, monospace",
                    }}
                  >
                    Have an account?
                  </Typography>
                </Grid>
                <Grid item style={{ width: "100%" }}>
                  <Grid container style={{ width: "100%" }}>
                    <Grid
                      item
                      style={{
                        height: "7.5vh",
                        width: "100%",
                        marginBottom: "2.5vh",
                      }}
                    >
                      <FormTextfield
                        icon={AlternateEmail}
                        value={loginEmail}
                        onChange={setLoginEmail}
                        themeDark={"#C71585	"}
                        themeLight={"#8A2BE2"}
                        spacing={"2.5vh"}
                        placeholder={"Enter email..."}
                        tooltip={"Enter the email associated with your account"}
                        disabled={!login}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        height: "7.5vh",
                        width: "100%",
                      }}
                    >
                      <FormTextfield
                        password={true}
                        icon={Lock}
                        value={loginPassword}
                        onChange={setLoginPassword}
                        themeDark={"#C71585	"}
                        themeLight={"#8A2BE2"}
                        spacing={"2.5vh"}
                        placeholder={"Enter password..."}
                        tooltip={"Enter your password"}
                        disabled={!login}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item style={{ height: "5vh", marginTop: "5vh" }}>
                  <Grid container style={{ height: "100%" }}>
                    <Grid
                      item
                      style={{ height: "100%", marginRight: "0.625vw" }}
                    >
                      <TextIconButton
                        icon={LockOpen}
                        width={"12.5vw"}
                        text={"Log In"}
                        onClick={emailLogIn}
                        stretch
                        disabled={!(loginEmail && loginPassword)}
                        tooltip={"Log in using your entered details"}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{ height: "100%", marginLeft: "0.625vw" }}
                    >
                      <TextIconButton
                        icon={Help}
                        width={"12.5vw"}
                        text={"Forgot password?"}
                        onClick={() => pushHistory(routes.PASSWORD_RECOVERY)}
                        stretch
                        disabled={!login}
                        tooltip={
                          "Reset your password through your email address"
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid
            item
            style={{
              height: !login ? "100%" : "87.5%",
              width: !login ? "41.484375vw" : "32.265625vw",
              marginLeft: "0.625vw",
            }}
          >
            <Paper
              disabled={login}
              elevation={3}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                opacity: !login ? 1 : 0.5,
                backgroundImage: `linear-gradient(to right, indigo, purple)`,
              }}
            >
              <Grid
                container
                direction="column"
                justify="space-between"
                alignItems="center"
                style={{
                  height: "100%",
                  width: "100%",
                  paddingTop: "2.5vh",
                  paddingBottom: "2.5vh",
                  paddingLeft: "1.25vw",
                  paddingRight: "1.25vw",
                }}
              >
                <Grid
                  item
                  style={{
                    height: !login ? "10vh" : "7.5vh",
                  }}
                >
                  <Typography
                    variant="h3"
                    style={{
                      color: "white",
                      fontFamily: "Lucida Console, Courier, monospace",
                    }}
                  >
                    Want one?
                  </Typography>
                </Grid>
                <Grid item style={{ width: "100%" }}>
                  <Grid container style={{ width: "100%" }}>
                    <Grid
                      item
                      style={{
                        height: "7.5vh",
                        width: "100%",
                        marginBottom: "2.5vh",
                      }}
                    >
                      <FormTextfield
                        icon={Person}
                        value={username}
                        onChange={setUsername}
                        themeDark={"#C71585	"}
                        themeLight={"#8A2BE2"}
                        spacing={"2.5vh"}
                        placeholder={"Enter username..."}
                        tooltip={
                          "Enter the username you wish to associate with your account"
                        }
                        disabled={login}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        height: "7.5vh",
                        width: "100%",
                        marginBottom: "2.5vh",
                      }}
                    >
                      <FormTextfield
                        icon={AlternateEmail}
                        value={signupEmail}
                        onChange={setSignupEmail}
                        themeDark={"#C71585	"}
                        themeLight={"#8A2BE2"}
                        spacing={"2.5vh"}
                        placeholder={"Enter email..."}
                        tooltip={
                          "Enter the email address you wish to associate with your account"
                        }
                        disabled={login}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        height: "7.5vh",
                        width: "100%",
                        marginBottom: "2.5vh",
                      }}
                    >
                      <FormTextfield
                        password={true}
                        icon={LockOutlined}
                        value={signupPassword}
                        onChange={setSignupPassword}
                        themeDark={"#C71585	"}
                        themeLight={"#8A2BE2"}
                        spacing={"2.5vh"}
                        placeholder={"Enter password..."}
                        tooltip={"Enter your password"}
                        disabled={login}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        height: "7.5vh",
                        width: "100%",
                      }}
                    >
                      <FormTextfield
                        password={true}
                        icon={Lock}
                        value={signupPasswordConfirm}
                        onChange={setSignupPasswordConfirm}
                        themeDark={"#C71585	"}
                        themeLight={"#8A2BE2"}
                        spacing={"2.5vh"}
                        placeholder={"Confirm password..."}
                        tooltip={
                          "Confirm your password. It should match the one entered above"
                        }
                        disabled={login}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  style={{ height: "5vh", marginTop: !login ? "5vh" : "2.5vh" }}
                >
                  <Grid container style={{ height: "100%" }}>
                    <Grid
                      item
                      style={{ height: "100%", marginRight: "1.25vw" }}
                    >
                      <TextIconButton
                        icon={Edit}
                        width={"12.5vw"}
                        text={"Sign up"}
                        onClick={emailSignUp}
                        stretch
                        disabled={!canSignUp}
                      />
                    </Grid>
                    {signupPassword && (
                      <Grid item style={{ height: "100%", width: "12.5vw" }}>
                        <PasswordCheck
                          password={signupPassword}
                          confirm={signupPasswordConfirm}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid item style={{ width: "100%", height: "10vh" }}>
        <Grid
          container
          style={{ width: "100%", height: "100%" }}
          justify="center"
        >
          <Grid
            item
            style={{
              height: "100%",
              width: "calc(20vw + 10vh)",
              marginBottom: "2.5vh",
            }}
          >
            <Paper
              elevation={3}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage: `linear-gradient(to right, indigo, purple)`,
              }}
            >
              <Grid
                container
                alignItems="center"
                justify="space-between"
                style={{
                  height: "100%",
                  width: "100%",
                  paddingLeft: "1.25vw",
                  paddingRight: "1.25vw",
                }}
              >
                <Grid item style={{ height: "5vh" }}>
                  <SimpleIconButton
                    icon={ChevronLeft}
                    onClick={() => {
                      setLogin(true);
                      clearFields();
                    }}
                    condition={login}
                    placement={"left"}
                    tooltip={"Login form"}
                  />
                </Grid>
                <Grid item style={{ height: "5vh" }}>
                  <TextIconButton
                    icon={Language}
                    width={"15vw"}
                    text={"Use your google account"}
                    onClick={googleSignIn}
                    tooltip={
                      "If you have a Google account, you can use it to log in"
                    }
                    stretch
                  />
                </Grid>
                <Grid item style={{ height: "5vh" }}>
                  <SimpleIconButton
                    icon={ChevronRight}
                    onClick={() => {
                      setLogin(false);
                      clearFields();
                    }}
                    condition={!login}
                    placement={"right"}
                    tooltip={"Signup form"}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid
            item
            style={{
              height: "10vh",
              width: "calc(3.75vw + 10vh)",
              marginBottom: "2.5vh",
              position: "absolute",
              right: "1.25vw",
              bottom: "0vh",
            }}
          >
            <Paper
              elevation={3}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                backgroundImage: `linear-gradient(to right, indigo, purple)`,
              }}
            >
              <Grid
                container
                alignItems="center"
                justify="space-between"
                style={{
                  height: "100%",
                  width: "100%",
                  paddingLeft: "1.25vw",
                  paddingRight: "1.25vw",
                }}
              >
                <Grid item style={{ height: "5vh" }}>
                  <Link href={eula} target="_blank">
                    <SimpleIconButton
                      icon={Business}
                      placement={"top"}
                      tooltip={"End User Licence Agreement"}
                    />
                  </Link>
                </Grid>
                <Grid item style={{ height: "5vh" }}>
                  <Link href={gdpr} target="_blank">
                    <SimpleIconButton
                      icon={Cloud}
                      placement={"top"}
                      tooltip={"General Data Protection Regulation Agreement"}
                    />
                  </Link>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const LoginForm = compose(withRouter, withFirebase)(LoginFormBase);

export default function Login(props) {
  return <LoginForm {...props} />;
}
