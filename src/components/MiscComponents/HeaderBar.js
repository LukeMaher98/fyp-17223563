import React from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import TextIconButton from "./TextIconButton";

export default function HeaderBar(props) {
  return (
    <Grid item style={{ width: "100%", height: "10vh" }}>
      <Paper
        style={{
          height: "100%",
          borderRadius: "0px",
          backgroundImage:
            "linear-gradient(to right, blueviolet, mediumvioletred)",
        }}
        elevation={3}
      >
        <Grid
          container
          alignItems="center"
          justify="space-between"
          style={{
            height: "100%",
            paddingRight: "1.25vw",
          }}
        >
          {props.icon && (
            <Grid item style={{ width: "10vh", height: "100%" }}>
              <Paper
                elevation={3}
                style={{
                  borderRadius: "0px",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "purple",
                }}
              >
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Grid item>
                    <props.icon fontSize="large" style={{ color: "white" }} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
          {props.content && (
            <Grid item xs style={{ marginLeft: "1.25vw" }}>
              <Typography
                variant={"h4"}
                style={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {props.content}
              </Typography>
            </Grid>
          )}
          {props.buttons && (
            <Grid item style={{ height: "100%" }}>
              <Grid
                container
                alignItems="center"
                style={{
                  height: "100%",
                }}
              >
                {props.buttons.map((button) => {
                  return (
                    <Grid item style={{ marginLeft: "1.25vw", height: "5vh" }}>
                      <TextIconButton
                        icon={button.icon}
                        text={button.text}
                        onClick={button.onClick}
                        condition={button.condition}
                        tooltip={button.tooltip}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
}
