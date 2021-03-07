import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { Paper, ThemeProvider, Tooltip } from "@material-ui/core";
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

const FormDateTimePicker = (props) => {
  const [date, setDate] = useState(new Date(props.value.seconds * 1000));

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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            style={{ borderRadius: "0px", padding: "0px" }}
            autoOk
            fullWidth
            disableToolbar
            inputVariant="filled"
            variant="dialog"
            butt
            ampm={false}
            animateYearScrolling
            format="HH:mm dd/MM/yyyy"
            emptyLabel={""}
            placeholder={props.placeholder}
            value={props.value ? date : null}
            InputProps={{
              style: {
                backgroundColor: "rgb(0,0,0,0)",
                borderRadius: "0px",
              },
              startAdornment: (
                <Tooltip
                  title={props.tooltip}
                  placement={props.placement ? props.placement : "top"}
                  arrow
                >
                  <props.icon
                    style={{
                      color: props.themeDark,
                      marginLeft: "0.625vw",
                    }}
                  />
                </Tooltip>
              ),
              endAdornment: null,
              inputProps: {
                style: {
                  marginLeft: "1.25vw",
                  paddingBottom: props.spacing,
                },
              },
            }}
            onChange={(event) => {
              props.onChange(event);
              setDate(event);
            }}
          />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </Paper>
  );
};

export default FormDateTimePicker;
