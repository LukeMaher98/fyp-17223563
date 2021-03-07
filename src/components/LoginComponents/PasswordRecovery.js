import React, { useState } from "react";
import { Typography, Grid, Paper } from "@material-ui/core";
import { withFirebase } from "../../firebase";
import * as routes from "../../constants/routes";
import { withRouter, Redirect } from "react-router-dom";
import { compose } from "recompose";
import { pushHistory } from "../../constants/utils";
import FormTextfield from "../FormComponents/FormTextfield";
import { AlternateEmail, Send } from "@material-ui/icons";
import { artistFormTheme } from "../../constants/themes";
import TextIconButton from "../MiscComponents/TextIconButton";

const RecoverPasswordBase = (props) => {
  const [email, setEmail] = useState("");

  const submit = (event) => {
    const userEmail = email;

    if (userEmail !== "") {
      props.firebase
        .doPasswordReset(userEmail)
        .then((authUser) => {
          setEmail("");
          alert("Please check your email");
          pushHistory(routes.LOGIN);
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      alert("All fields must be filled out");
    }
    event.preventDefault();
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item xs style={{ height: "100%" }}>
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
                Recover your password
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
                    value={email}
                    onChange={setEmail}
                    themeDark={"#C71585	"}
                    themeLight={"#8A2BE2"}
                    spacing={"2.5vh"}
                    tooltip={"Enter the email associated with your account"}
                    placeholder={"Email..."}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ height: "5vh", marginTop: "2.5vh" }}>
              <Grid container style={{ height: "100%" }}>
                <Grid item style={{ height: "100%", marginRight: "1.25vw" }}>
                  <TextIconButton
                    icon={Send}
                    width={"12.5vw"}
                    text={"Submit"}
                    onClick={(event) => submit(event)}
                    stretch
                    disabled={!email}
                    tooltip={"Submit your email address. You will receive a password reset link in your inbox"}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

const RecoverPasswordComposed = compose(
  withRouter,
  withFirebase
)(RecoverPasswordBase);

export default function RecoverPassword(props) {
  if (props.currentUser) {
    return <Redirect to={`${routes.HOME}`} />;
  }

  return <RecoverPasswordComposed currentUser={props.currentUser} />;
}
