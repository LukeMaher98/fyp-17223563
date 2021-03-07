import React, { useState } from "react";
import { Button, Paper, Tooltip } from "@material-ui/core";

const FormImage = (props) => {
  const [hovered, setHovered] = useState(null);

  return (
    <Tooltip title={props.tooltip} placement={"top"} arrow>
      <Paper
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(null)}
        elevation={3}
        style={{
          borderRadius: "0px",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${props.imageUrl})`,
          backgroundSize: "100% 100%",
          opacity: hovered ? 0.5 : 1
        }}
      >
        <Button component="label" style={{ width: "100%", height: "100%" }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(event) =>
              props.onChange(Array.from(event.target.files)[0])
            }
          />
        </Button>
      </Paper>
    </Tooltip>
  );
};

export default FormImage;
