import React from "react";
import { Grid, Typography } from "@material-ui/core";

const IconInfo = (props) => {
  const Icon = props.icon;
  return (
    <Grid
      container
      wrap="nowrap"
      justify={props.justify}
      alignItems="center"
      style={{ width: "100%", height: "100%" }}
    >
      <Grid item style={{ marginRight: "1.25vw" }}>
        <Icon fontSize="large" />
      </Grid>
      <Grid
        item
        style={{
          overflow: "auto",
        }}
      >
        <Typography
          variant={props.variant}
          style={{
            color: props.color ? props.color : "white",
            fontWeight: "bold"
          }}
        >
          {props.data}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default IconInfo;
