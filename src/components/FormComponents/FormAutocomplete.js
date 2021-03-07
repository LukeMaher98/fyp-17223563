import React, { useState } from "react";
import { Paper, ThemeProvider, TextField, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const FormAutocomplete = (props) => {
  return (
    <Paper
      elevation={3}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "0px",
        backgroundImage: `linear-gradient(to left, ${props.themeDark}, ${props.themeLight})`,
      }}
    >
      <ThemeProvider theme={props.theme}>
        <Autocomplete
          options={props.options}
          getOptionLabel={(item) => item}
          value={props.value}
          disabled={props.disabled}
          onChange={(event, value) => {
            props.onChange(value);
          }}
          renderInput={(params) => (
            <ThemeProvider theme={props.theme}>
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  style: {
                    height: props.inputSize,
                    width: "100%",
                    paddingRight: "1.25vw",
                  },
                  endAdornment: null,
                  startAdornment: (
                    <>
                      <Tooltip
                        title={props.tooltip}
                        placement={props.placement ? props.placement : "top"}
                        arrow
                      >
                        <props.icon
                          style={{
                            color: props.themeDark,
                            marginLeft: "1.25vw",
                            marginRight: "1.25vw",
                          }}
                        />
                      </Tooltip>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
                placeholder={props.placeholder}
              />
            </ThemeProvider>
          )}
        />
      </ThemeProvider>
    </Paper>
  );
};

export default FormAutocomplete;
