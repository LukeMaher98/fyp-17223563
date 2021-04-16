import React, { useState } from "react";
import { Typography, Grid, Paper } from "@material-ui/core";
import { withFirebase } from "../../firebase";
import * as routes from "../../constants/routes";
import { withRouter, Redirect } from "react-router-dom";
import { compose } from "recompose";
import FormTextfield from "../FormComponents/FormTextfield";
import TextIconButton from "../MiscComponents/TextIconButton";
import { Lock, LockOutlined, Send } from "@material-ui/icons";
import { pushHistory } from "../../constants/utils";
import { formTheme } from "../../constants/themes";
import PasswordCheck from "./PasswordCheck";

const ResetPasswordBase = (props) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submit = async (event) => {
    await props.firebase.doVerifyPasswordResetCode(props.resetKey).then(async () => {
      await props.firebase
        .doConfirmPasswordReset(props.resetKey, newPassword)
        .then(() => {
          alert("Password Successfully Reset");
          setNewPassword("");
          setConfirmPassword("");
          pushHistory(routes.LOGIN);
        })
        .catch((error) => {
          alert(error);
        })
        .catch((error) => {
          alert(error);
        });
    });

    event.preventDefault();
  };

  return (
    <Grid container justify="center">
      <Grid item xs style={{ height: "100%" }}>
        <Paper
          elevation={3}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "0px",
            backgroundImage: `linear-gradient(to left, indigo, purple)`,
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
                Reset your password
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
                    password={true}
                    icon={LockOutlined}
                    value={newPassword}
                    onChange={setNewPassword}
                    theme={formTheme("#C71585	", "#8A2BE2")}
                    themeDark={"#C71585	"}
                    themeLight={"#8A2BE2"}
                    spacing={"2.5vh"}
                    tooltip={"Enter your new password"}
                    placeholder={"Enter password..."}
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
                    icon={Lock}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    theme={formTheme("#C71585	", "#8A2BE2")}
                    themeDark={"#C71585	"}
                    themeLight={"#8A2BE2"}
                    spacing={"2.5vh"}
                    tooltip={
                      "Confirm your new password. It should match the one entered above"
                    }
                    placeholder={"Confirm password..."}
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
                    text={"Submit Password"}
                    onClick={(event) => submit(event)}
                    stretch
                    disabled={
                      newPassword === "" ||
                      confirmPassword === "" ||
                      newPassword.length < 8 ||
                      newPassword !== confirmPassword
                    }
                    tooltip={
                      "Submit your new password. You will be take back to the login page"
                    }
                  />
                </Grid>
                {confirmPassword && newPassword && (
                  <Grid item style={{ height: "100%", width: "12.5vw" }}>
                    <PasswordCheck
                      password={newPassword}
                      confirm={confirmPassword}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

const ResetPasswordComposed = compose(
  withRouter,
  withFirebase
)(ResetPasswordBase);

export default function ResetPassword(props) {
  const urlParams = new URLSearchParams(window.location.search);

  if (
    !urlParams.get("mode") ||
    !urlParams.get("oobCode") ||
    !urlParams.get("apiKey") ||
    !urlParams.get("lang")
  ) {
    return <Redirect to={`${routes.LOGIN}`} />;
  }

  return <ResetPasswordComposed resetKey={urlParams.get("oobCode")} />;
}
