import React from "react";
import { Grid, TextField, Paper, ThemeProvider, Tooltip } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { formTheme } from "../../constants/themes";

export default function SearchBar(props) {
  return (
    <Grid item xs style={{ height: "100%" }}>
      <Paper
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "0px",
          backgroundImage:
            "linear-gradient(to right, blueviolet, mediumvioletred",
        }}
        elevation={3}
      >
        <ThemeProvider
          theme={formTheme("#C71585", "#8A2BE2")}
          style={{ width: "100%", height: "100%" }}
        >
          <TextField
            variant="filled"
            style={{
              height: "100%",
              width: "100%",
            }}
            InputProps={{
              startAdornment: (
                <Tooltip title={props.tooltip} placement="left" arrow>
                  <Search style={{ color: "white", marginLeft: "1.25vw" }} />
                </Tooltip>
              ),
              inputProps: {
                style: {
                  height: "7.5vh",
                  marginTop: "-1.375vh",
                  marginLeft: "1.25vw",
                },
              },
            }}
            value={props.search}
            onChange={(event) => props.setSearch(event.target.value)}
            placeholder={props.placeholder}
          />
        </ThemeProvider>
      </Paper>
    </Grid>
  );
}
