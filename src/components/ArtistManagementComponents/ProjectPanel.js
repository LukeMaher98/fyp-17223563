import React, { useState } from "react";
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@material-ui/core";
import ProjectPanelInfo from "./ProjectPanelInfo";
import ProjectItem from "../ItemComponents/ProjectItem";

const ProjectPanel = (props) => {
  const [summaryHovered, setSummaryHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  const progressBar = () => {
    const progressPerCent =
      (props.uploadProgress + 1 / props.uploadCount) * 100;

    if (progressPerCent === 100) {
      return `linear-gradient(to right, ${props.artistData.themeDark}, ${props.artistData.themeLight})`;
    }

    return `linear-gradient(to right, ${props.artistData.themeDark}, ${
      props.artistData.themeLight
    }, rgb(0,0,0,0) ${Math.floor(progressPerCent)}%)`;
  };

  return (
    <Accordion
      style={{
        borderRadius: "0px",
        backgroundColor: "rgb(255,255,255,0.0)",
      }}
      expanded={props.expanded}
    >
      <Tooltip
        title={
          props.lock
            ? "//"
            : `${props.expanded ? "Hide" : "Show"} ${
                props.artistData.name
              }'s projects`
        }
        placement="top"
        arrow
        open={summaryHovered && !buttonHovered}
      >
        <AccordionSummary
          disabled={props.locked}
          onClick={
            !buttonHovered ? () => props.handleChange(props.index) : null
          }
          onMouseEnter={() => setSummaryHovered(true)}
          onMouseLeave={() => setSummaryHovered(false)}
          style={{
            padding: "0px",
            paddingTop: props.expanded ? "2.5vh" : null,
            paddingBottom: props.expanded ? "2.5vh" : null,
            borderRadius: "0px",
            height: "10vh",
            backgroundImage: props.locked
              ? progressBar()
              : summaryHovered
              ? `linear-gradient(to right, ${props.artistData.lightDark}, ${props.artistData.themeLight})`
              : `linear-gradient(to right, ${props.artistData.themeLight}, ${props.artistData.themeDark})`,
          }}
        >
          <ProjectPanelInfo
            {...props}
            active={summaryHovered || props.expanded}
            setHovered={setButtonHovered}
            artist={props.artistData.name}
            artistID={props.userArtistIDs[props.index]}
          />
        </AccordionSummary>
      </Tooltip>
      <AccordionDetails
        style={{
          backgroundImage: `linear-gradient(to right, ${props.artistData.themeLight}, ${props.artistData.themeDark})`,
          width: "100%",
          overflow: "auto",
          padding: "0px",
          paddingTop:
            props.artistProjectIDs && props.artistProjectIDs.length > 0
              ? "2.5vh"
              : null,
        }}
      >
        <Grid
          container
          justify="flex-start"
          alignItems="center"
          style={{
            overflow: "auto",
            paddingRight: "1.25vw",
          }}
          wrap="nowrap"
        >
          {props.expanded &&
            props.artistProjectData &&
            props.artistProjectIDs &&
            props.artistProjectData.map((data, index) => {
              return (
                <Grid
                  item
                  style={{ marginLeft: "1.25vw", marginBottom: "2.5vh" }}
                >
                  <ProjectItem
                    {...props}
                    projectData={data}
                    index={index}
                    artistID={props.userArtistIDs[props.currentArtistIndex]}
                    projectID={props.artistProjectIDs[index]}
                    hovered={props.hoveredAlbum}
                    setHovered={props.setHoveredAlbum}
                    itemFunction={props.itemFunction}
                  />
                </Grid>
              );
            })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default ProjectPanel;
