import React, { useEffect, useState } from "react";
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tooltip,
} from "@material-ui/core";
import ProjectItem from "../ItemComponents/ProjectItem";
import ArtistItem from "../ItemComponents/ArtistItem";
import PlaylistItem from "../ItemComponents/PlaylistItem";
import SongItem from "../ItemComponents/SongItem";
import * as routes from "../../constants/routes";
import { pushHistory } from "../../constants/utils";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { timeframeButtons } from "../../constants/buttons";
import { contentIcons } from "../../constants/icons";
import {
  getArtistFunction,
  getProjectFunction,
  getPlaylistFunction,
  getSongFunction,
} from "../../firebase/contentFunctions";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { FilterList, Timer } from "@material-ui/icons";
import { useStyles } from "../../constants/styling";

const GenreDisplayPanelBase = (props) => {
  const styles = useStyles();

  const [hoveredAlbum, setHoveredAlbum] = useState(null);
  const [displayData, setDisplayData] = useState(null);
  const [currentContentFilter, setCurrentContentFilter] = useState(0);
  const [currentContentTimeframe, setCurrentContentTimeframe] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  const getContentFilter = () => {
    switch (true) {
      case currentContentFilter === 0:
        return "playCount";
      case currentContentFilter === 1:
        return "likeCount";
      case currentContentFilter === 2:
        return "bookmarkCount";
      case currentContentFilter === 3:
        return "followCount";
      default:
        return null;
    }
  };

  const playSong = (index) => {
    props.setCurrentSongIndex(null);
    let playerSongIDs = [];
    let playerSongData = [];
    displayData.map((couple) => {
      playerSongIDs = [...playerSongIDs, couple.songID];
      playerSongData = [...playerSongData, couple.songData];
    });
    props.setPlayerSongIDs([...playerSongIDs]);
    props.setPlayerSongData([...playerSongData]);
    props.setCurrentSongIndex(index ? index : null);
  };

  const PanelIcon = props.contentIndex
    ? contentIcons[props.contentIndex]
    : contentIcons[0];

  useEffect(() => {
    if (currentContentIndex !== props.contentIndex) {
      setCurrentContentIndex(props.contentIndex);
      props.setContentTimeframe(0);
      props.setContentFilter(0);
      setDisplayData(null);
    }

    if (currentContentFilter !== props.contentFilter) {
      setCurrentContentFilter(props.contentFilter);
      setDisplayData(null);
    }

    if (currentContentTimeframe !== props.contentTimeframe) {
      setCurrentContentTimeframe(props.contentTimeframe);
      setDisplayData(null);
    }

    if (!displayData && props.currentGenre) {
      if (currentContentIndex === 0) {
        getSongFunction(currentContentTimeframe)(
          props.firebase,
          props.currentGenre,
          getContentFilter()
        ).then((data) => {
          setDisplayData(data);
        });
      } else if (currentContentIndex === 1) {
        getProjectFunction(currentContentTimeframe)(
          props.firebase,
          props.currentGenre,
          getContentFilter()
        ).then((data) => {
          setDisplayData(data);
        });
      } else if (currentContentIndex === 2) {
        getArtistFunction(currentContentTimeframe)(
          props.firebase,
          props.currentGenre,
          getContentFilter()
        ).then((data) => {
          setDisplayData(data);
        });
      } else if (currentContentIndex === 3) {
        getPlaylistFunction(currentContentTimeframe)(
          props.firebase,
          props.currentGenre,
          "saveCount"
        ).then((data) => {
          setDisplayData(data);
        });
      }
    }
  });

  return (
    <Accordion
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        backgroundColor: "rgb(0,0,0,0)",
      }}
      expanded={true}
    >
      <AccordionSummary
        style={{
          backgroundImage: `linear-gradient(to right, mediumvioletred, blueviolet )`,
          cursor: "default",
          padding: "0px",
          height: "10vh",
        }}
      >
        <Grid
          container
          alignItems="center"
          justify="space-between"
          style={{
            width: "100%",
            height: "100%",
            paddingRight: "1.25vw",
          }}
        >
          <Grid item style={{ width: "10vh", height: "10vh" }}>
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "indigo",
              }}
            >
              <PanelIcon style={{ color: "white" }} />
            </Grid>
          </Grid>
          <Grid item xs style={{ marginLeft: "1.25vw" }}>
            <Typography
              variant={"h5"}
              style={{ color: "white", fontWeight: "bold" }}
            >
              {props.headerData().content}
            </Typography>
          </Grid>
          {currentContentIndex !== 3 && (
            <Grid item style={{ marginLeft: "1.25vw" }}>
              <Tooltip title={"Attribute filters"} placement={"top"} arrow>
                <FilterList style={{ color: "white" }} />
              </Tooltip>
            </Grid>
          )}
          {props.headerData().filterButtons && (
            <Grid item>
              <Grid container>
                {props.headerData().filterButtons.map((data) => {
                  return (
                    <Grid item style={{ marginLeft: "1.25vw" }}>
                      <SimpleIconButton
                        onClick={data.onClick}
                        condition={data.condition}
                        icon={data.icon}
                        tooltip={data.tooltip}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          )}
          <Grid item style={{ marginLeft: "2.5vw" }}>
            <Tooltip title={"Timeframe filters"} placement={"top"} arrow>
              <Timer style={{ color: "white" }} />
            </Tooltip>
          </Grid>
          <Grid item>
            <Grid container>
              {timeframeButtons(
                props.contentTimeframe,
                props.setContentTimeframe
              ).map((data) => {
                return (
                  <Grid item style={{ marginLeft: "1.25vw" }}>
                    <SimpleIconButton
                      onClick={data.onClick}
                      condition={data.condition}
                      icon={data.icon}
                      tooltip={data.tooltip}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails
        style={{
          padding: "0px",
          backgroundImage: `linear-gradient(to right, rgb(199,21,133, 0.5), rgb(138,43,226, 0.5))`,
          width: "100%",
          height: "52.5vh",
        }}
      >
        <Grid
          className={styles.scrollbars}
          container
          justify="flex-start"
          alignItems="flex-start"
          style={{
            height: "100%",
            width: "100%",
            paddingTop: "2.5vh",
            overflow: "auto",
          }}
        >
          {displayData &&
            displayData.map((data, index) => {
              return (
                <Grid
                  item
                  style={{
                    marginLeft: "1.25vw",
                    marginBottom: "2.5vh",
                  }}
                >
                  {currentContentIndex === 0 && data.songData && (
                    <SongItem
                      songData={data.songData}
                      index={index}
                      hovered={hoveredAlbum}
                      songID={data.songID}
                      setHovered={setHoveredAlbum}
                      itemFunction={() => playSong(index)}
                    />
                  )}
                  {currentContentIndex === 1 && data.projectData && (
                    <ProjectItem
                      {...props}
                      projectData={data.projectData}
                      index={index}
                      projectID={data.projectID}
                      hovered={hoveredAlbum}
                      artistID={data.projectData.artistID}
                      setHovered={setHoveredAlbum}
                      itemFunction={() => {
                        props.setCurrentProjectID(null);
                        props.setCurrentProjectData(null);
                        pushHistory(
                          routes.PROJECT,
                          `?aid=${data.projectData.artistID}&pid=${data.projectID}`
                        );
                        props.setContentIndex(0);
                      }}
                    />
                  )}
                  {currentContentIndex === 2 && data.artistData && (
                    <ArtistItem
                      {...props}
                      artistData={data.artistData}
                      index={index}
                      artistID={data.artistID}
                      hovered={hoveredAlbum}
                      setHovered={setHoveredAlbum}
                      itemFunction={() => {
                        props.setCurrentArtistID(null);
                        props.setCurrentArtistData(null);
                        pushHistory(
                          routes.ARTIST_DISPLAY,
                          `?aid=${data.artistID}`
                        );
                        props.setContentIndex(0);
                      }}
                    />
                  )}
                  {currentContentIndex === 3 && data.playlistData && (
                    <PlaylistItem
                      {...props}
                      playlistData={data.playlistData}
                      index={index}
                      playlistID={data.playlistID}
                      hovered={hoveredAlbum}
                      setHovered={setHoveredAlbum}
                      itemFunction={() => {
                        props.setCurrentPlaylistID(null);
                        props.setCurrentPlaylistData(null);
                        pushHistory(routes.PLAYLIST, `?pid=${data.playlistID}`);
                        props.setContentIndex(0);
                      }}
                    />
                  )}
                </Grid>
              );
            })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

const GenreDisplayPanelComposed = compose(withFirebase)(GenreDisplayPanelBase);

export default function GenreDisplayPanel(props) {
  return <GenreDisplayPanelComposed {...props} />;
}
