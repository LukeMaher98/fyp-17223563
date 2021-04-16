import React from "react";
import { Grid } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";
import IconInfo from "../MiscComponents/IconInfo";
import TextIconButton from "../MiscComponents/TextIconButton";

const GenrePanelInfo = (props) => {
  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-between"
      alignItems="center"
      style={{ width: "100%", overflow: "auto", overflowY: "hidden" }}
    >
      <IconInfo
        icon={props.icon}
        data={props.genre}
        justify={"flex-start"}
        variant={"h6"}
        xs={true}
      />
      <Grid item style={{ marginLeft: "1.25vw", height: "5vh", width: "25%" }}>
        <TextIconButton
          {...props}
          tooltip={`Go to the ${props.genre.toLocaleLowerCase()} genre page`}
          icon={ArrowForward}
          text={`Go to ${props.genre}`}
          onClick={props.onClick}
          condition={false}
          onMouseEnter={() => props.setHovered(true)}
          onMouseLeave={() => props.setHovered(null)}
          stretch
        />
      </Grid>
    </Grid>
  );
};

export default GenrePanelInfo;
