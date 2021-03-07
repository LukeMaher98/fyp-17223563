import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  scrollbars: {
    "&::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0, 0.25)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0, 0.25)",
      width: "6px",
      height: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(255,255,255,.25)",
      width: "6px",
      height: "6px",
    },
    "&::-webkit-scrollbar-corner": { 
        backgroundColor: "rgba(0,0,0, 0.1)"
    }
  },
}));