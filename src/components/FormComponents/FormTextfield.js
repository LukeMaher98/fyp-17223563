import React from "react";
import { ThemeProvider, TextField, Paper, Tooltip } from "@material-ui/core";
import { artistFormTheme } from "../../constants/themes";
import { useStyles } from "../../constants/styling";

const FormTextfield = (props) => {
  const styles = useStyles();

  return (
    <Paper
      elevation={3}
      style={{
        opacity: props.disabled ? 0.5 : 1,
        height: "100%",
        width: "100%",
        borderRadius: "0px",
        backgroundImage: `linear-gradient(to left, ${props.themeDark}, ${props.themeLight})`,
      }}
    >
      <ThemeProvider
        theme={artistFormTheme(props.themeDark, props.themeLight)}
        style={{ width: "100%", height: "100%" }}
      >
        <TextField
          type={props.password ? "password" : "text"}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            marginTop: props.spacing,
          }}
          InputProps={{
            startAdornment: (
              <Tooltip
                title={props.tooltip}
                placement={props.placement ? props.placement : "top"}
                arrow
                disableHoverListener={!props.tooltip}
                disableFocusListener={!props.tooltip}
                disableTouchListener={!props.tooltip}
              >
                <props.icon
                  style={{
                    color: props.themeDark,
                    marginLeft: "1.25vw",
                    paddingBottom: props.spacing,
                  }}
                />
              </Tooltip>
            ),
            inputProps: {
              className: styles.scrollbars,
              style: {
                marginLeft: "1.25vw",
                paddingBottom: props.spacing,
              },
            },
          }}
          disabled={props.disabled}
          value={props.value}
          rowsMax={props.multiline ? props.rows : 1}
          rows={props.multiline ? props.rows : 1}
          multiline={props.multiline}
          fullWidth
          variant="standard"
          placeholder={props.placeholder}
          onChange={(event) => {
            props.onChange(event.target.value);
          }}
        />
      </ThemeProvider>
    </Paper>
  );
};

export default FormTextfield;
