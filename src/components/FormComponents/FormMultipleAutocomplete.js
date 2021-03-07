import React from "react";
import { Paper, ThemeProvider, TextField, Chip, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Cancel } from "@material-ui/icons";

const FormMultipleAutocomplete = (props) => {
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
          multiple
          closeIcon={null}
          disabled={props.disabled}
          options={props.options}
          filterSelectedOptions
          getOptionLabel={(item) => item}
          value={props.value}
          onChange={(event, values) => {
            if (props.canAdd) {
              props.onChange(values);
            }
          }}
          renderTags={(value) =>
            value.map((option) => (
              <Chip
                variant="default"
                onDelete={(e) => {
                  e.stopPropagation();
                  props.onDelete(option);
                }}
                deleteIcon={
                  <Cancel style={{ width: "2.5vh", height: "2.5vh" }} />
                }
                label={option}
                style={{
                  color: "white",
                  backgroundColor: props.themeDark,
                  margin: "0.625vw",
                  height: "5vh",
                  maxWidth: "30%",
                  fontSize: "medium",
                }}
              />
            ))
          }
          renderInput={(params) => (
            <ThemeProvider theme={props.theme}>
              <TextField
                {...params}
                disabled={props.disabled}
                placeholder={props.placeholder}
                InputProps={{
                  ...params.InputProps,
                  style: {
                    height: props.inputSize,
                    width: "100%",
                  },
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
                            paddingBottom: props.spacing,
                          }}
                        />
                      </Tooltip>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: null,
                }}
              />
            </ThemeProvider>
          )}
        />
      </ThemeProvider>
    </Paper>
  );
};

export default FormMultipleAutocomplete;
