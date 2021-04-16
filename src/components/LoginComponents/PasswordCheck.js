import React from "react";
import { Box, Paper, Tooltip, Grid, Typography } from "@material-ui/core";
import { Help } from "@material-ui/icons";

const PasswordCheck = (props) => {
  let message = "This password is secure!";
  let strength = 1;
  let valid = true;
  let highSec = 4;

  if (props.password.length < 12) {
    strength -= 1/6;
    message = "A longer password is more secure";
  }
  if (!props.password.match(/[a-z]/)) {
    strength -= 1/6;
    message = "Password does not contain a lowercase character";
    highSec--;
  }
  if (!props.password.match(/[A-Z]/)) {
    strength -= 1/6;
    message = "Password does not contain an uppercase character";
    highSec--;
  }
  if (!props.password.match(/[0-9]/)) {
    strength -= 1/6;
    message = "Password does not contain a number";
    highSec--;
  }
  if (!props.password.match(/[^a-zA-Z0-9]/)) {
    strength -= 1/6;
    message = "Password does not contain a special character";
    highSec--;
  }
  if (props.password.length < 8) {
    strength -= 1/6;
    message = "Password is of insufficient length";
    valid = false;
  }

  const color = valid ? (highSec > 2 ? "darkcyan" : "gold") : "crimson";

  const showMatchWarning =
    props.password && props.confirm && props.password !== props.confirm;

  const showPasswordStrength =
    (props.password && !props.confirm) ||
    (props.password && props.confirm && props.password === props.confirm);

  console.log(strength);

  return (
    <Grid
      container
      alignItems="center"
      style={{ height: "100%", width: "100%" }}
    >
      {showPasswordStrength && (
        <Grid item style={{ marginRight: "1.25vw" }}>
          <Tooltip title={message} placement="top" arrow>
            <Help fontSize="large" style={{ color: "mediumvioletred" }} />
          </Tooltip>
        </Grid>
      )}
      {showPasswordStrength && (
        <Grid item xs style={{ height: "50%" }}>
          <Paper
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "whitesmoke",
              borderRadius: "0px",
            }}
          >
            <Box
              style={{
                borderRadius: "0px",
                width: `${100 * strength}%`,
                height: "100%",
                backgroundColor: color,
              }}
            />
          </Paper>
        </Grid>
      )}
      {showMatchWarning && (
        <Grid item>
          <Typography
            variant="h6"
            style={{ color: "crimson", fontWeight: "bold" }}
          >
            Passwords must match
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default PasswordCheck;
