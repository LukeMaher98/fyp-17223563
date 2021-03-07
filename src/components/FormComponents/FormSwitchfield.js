import React from "react";
import { Grid, ThemeProvider, TextField, Switch } from "@material-ui/core";

const FormSwitchfield = (props) => {
  let Icon = props.icon;
  return (
    <Grid item xs>
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ width: "100%" }}
        spacing={1}
      >
        <Grid item>
          <Icon style={{ color: "rgb(255,255,255, 0.5)" }} />
        </Grid>
        <Grid item xs>
          <ThemeProvider theme={props.theme}>
            <TextField
              style={{
                backgroundImage: "rgb(255,255,255, 0.5)",
                borderRadius: "4px",
                marginBottom: "10px"
              }}
              value={props.value ? props.on : props.off}
              variant="filled"
              size="small"
              disabled
              fullWidth
            />
          </ThemeProvider>
        </Grid>
        <Grid item>
          <ThemeProvider theme={props.theme}>
            <Switch
              checked={props.value}
              onChange={() => props.onChange(!props.value)}
            />
          </ThemeProvider>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FormSwitchfield;
