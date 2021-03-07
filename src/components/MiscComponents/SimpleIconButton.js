import React, { useState } from "react";
import { IconButton, Tooltip } from "@material-ui/core";

export default function SimpleIconButton(props) {
  const [hovered, setHovered] = useState(null);

  let invert = !props.disabled && ((props.icon && props.condition) || hovered);

  return (
    <Tooltip
      title={props.tooltip}
      placement={props.placement ? props.placement : "top"}
      arrow
      open={hovered && !props.disabled}
    >
      <IconButton
        disabled={props.disabled}
        onClick={props.onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(null)}
        variant="contained"
        style={{
          opacity: props.disabled ? 0.5 : 1,
          width: "5vh",
          height: "5vh",
          backgroundColor: invert ? "turquoise" : "teal",
          color: invert ? "teal" : "turquoise",
          borderRadius: "0px",
        }}
      >
        <props.icon />
      </IconButton>
    </Tooltip>
  );
}
