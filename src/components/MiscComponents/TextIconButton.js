import React, { useState } from "react";
import { Button, Grid, Paper, Tooltip, Typography } from "@material-ui/core";

export default function TextIconButton(props) {
  const [hovered, setHovered] = useState(null);

  let invert = (props.condition || hovered) && !props.disabled;

  return (
    <label htmlFor={props.input && props.label ? props.label : null}>
      <Paper
        elevation={3}
        style={{
          height: "100%",
          width: props.width ? props.width : "100%",
          opacity: props.disabled ? 0.5 : 1,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(null)}
      >
        <Tooltip
          title={props.tooltip}
          placement={props.placement ? props.placement : "top"}
          arrow
          disableHoverListener={!props.tooltip}
          disableFocusListener={!props.tooltip}
          disableTouchListener={!props.tooltip}
        >
          <Button
            disableTouchRipple
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            disabled={props.input || props.disabled}
            startIcon={
              <props.icon
                style={{
                  color: invert ? "teal" : "turquoise",
                  height: "2.5vh",
                  width: "2.5vh",
                }}
              />
            }
            style={{
              height: "100%",
              width: props.stretch ? "100%" : null,
              padding: "0px",
              paddingLeft: "1.25vw",
              paddingRight: "1.25vw",
              borderRadius: "0px",
              backgroundColor: invert ? "turquoise" : "teal",
              color: "white",
            }}
          >
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ width: "100%", height: "100%" }}
            >
              <Typography variant="s1" style={{ overflow: "auto" }} noWrap>
                {props.text}
              </Typography>
            </Grid>
          </Button>
        </Tooltip>
      </Paper>
    </label>
  );
}
