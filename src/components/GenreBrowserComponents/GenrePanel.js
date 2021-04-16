import React, { useEffect, useState } from "react";
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@material-ui/core";
import GenrePanelInfo from "./GenrePanelInfo";
import ProjectItem from "../ItemComponents/ProjectItem";
import { MusicNote } from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { compose } from "recompose";
import { withFirebase } from "../../firebase";
import { pushHistory } from "../../constants/utils";

const GenrePanelBase = (props) => {
  const [summaryHovered, setSummaryHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    const getDisplayProjects = async () => {
      let displayProjects = [];
      await props.firebase
        .firestoreGetGenrePopular("projects", props.genre, "likeCount", 5)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = doc.data();
            let id = doc.id;
            if (data.debutDate.seconds * 1000 < new Date().getTime()) {
              displayProjects = [
                ...displayProjects,
                { projectID: id, projectData: data },
              ];
            }
          });
        });
      setProjects(displayProjects);
    };

    if (projects === null) {
      getDisplayProjects();
    }
  });

  const disabled = !projects || !(projects.length > 0);
  const expanded = props.expanded.includes(props.panelNum);

  return (
    <Accordion
      style={{
        width: "100%",
        borderRadius: "0px",
        backgroundColor: "rgb(0,0,0,0)",
      }}
      expanded={expanded}
    >
      <Tooltip
        title={
          disabled
            ? "No projects have been created for this genre yet... Maybe yours could be the first?"
            : `${
                expanded ? "Hide" : "Show"
              } popular ${props.genre.toLocaleLowerCase()} projects`
        }
        placement="top"
        arrow
        open={summaryHovered && !buttonHovered}
      >
        <AccordionSummary
          onClick={() => props.handleChange(props.panelNum)}
          onMouseEnter={() => setSummaryHovered(true)}
          onMouseLeave={() => setSummaryHovered(false)}
          style={{
            padding: "0px",
            opacity: disabled ? 0.5 : 1,
            paddingLeft: "1.25vw",
            paddingRight: "1.25vw",
            height: "10vh",
            backgroundImage: `linear-gradient(to ${
              summaryHovered && !disabled ? "left" : "right"
            }, blueviolet, mediumvioletred  )`,
          }}
        >
          <GenrePanelInfo
            disabled={disabled}
            setHovered={setButtonHovered}
            onClick={props.buttonFunction}
            icon={() => <MusicNote style={{ color: "white" }} />}
            genre={props.genre}
          />
        </AccordionSummary>
      </Tooltip>
      {projects && projects.length > 0 && (
        <AccordionDetails
          style={{
            padding: "0px",
            backgroundImage: "linear-gradient(to left, indigo, purple)",
            width: "100%",
            paddingTop: "2.5vh",
          }}
        >
          <Grid
            container
            justify="flex-start"
            alignItems="center"
            style={{
              width: "100%",
              paddingRight: "1.25vw",
            }}
          >
            {projects.map((data, index) => {
              return (
                <Grid
                  item
                  style={{ marginBottom: "2.5vh", marginLeft: "1.25vw" }}
                >
                  <ProjectItem
                    {...props}
                    projectData={data.projectData}
                    index={index}
                    dims={"13.5vw"}
                    projectID={data.projectID}
                    hovered={hovered}
                    artistID={data.projectData.artistID}
                    setHovered={setHovered}
                    itemFunction={() => {
                      props.setCurrentProjectID(null)
                      props.setCurrentProjectData(null)
                      pushHistory(
                        routes.PROJECT,
                        `?aid=${data.projectData.artistID}&pid=${data.projectID}`
                      );
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </AccordionDetails>
      )}
    </Accordion>
  );
};

const GenrePanelComposed = compose(withFirebase)(GenrePanelBase);

export default function GenrePanel(props) {
  return <GenrePanelComposed {...props} />;
}
