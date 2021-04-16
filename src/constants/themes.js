import { createMuiTheme } from "@material-ui/core";

export const formTheme = (underline, hover) =>
  createMuiTheme({
    palette: {
      primary: {
        main: underline,
        light: hover
      },
    },
    overrides: {
      MuiInput: {
        root: {
          color: "white",
        },
      },
      MuiFilledInput: {
        root: {
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          borderRadius: "0px"
        },
      },
    },
  });
