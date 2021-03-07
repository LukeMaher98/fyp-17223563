import React, { useEffect } from "react";
import { Grid, Paper } from "@material-ui/core";
import { Radio } from "@material-ui/icons";
import * as routes from "../../constants/routes";
import { primaryGenres } from "../../constants/genres";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { replaceHistory } from "../../constants/utils";
import GenreDisplayPanel from "./GenreDisplayPanel";
import HeaderBar from "../MiscComponents/HeaderBar";
import SimpleIconButton from "../../components/MiscComponents/SimpleIconButton";
import {
  contentDisplayButtons,
  artistFilterButtons,
  projectFilterButtons,
  songFilterButtons,
} from "../../constants/buttons";

const GenreDisplayBase = (props) => {
  useEffect(() => {
    if (props.match.params.genre) {
      let check = false;
      primaryGenres.map((genre) => {
        if (genre.toLocaleLowerCase() === props.match.params.genre) {
          check = true;
          props.setCurrentGenre(genre);
        }
      });
      if (!check) {
        replaceHistory(`${routes.GENRE}/browser`);
      }
    }
  }, []);

  const getHeaderData = () => {
    let content = null;
    let buttons = null;

    switch (true) {
      case props.contentIndex === 0:
        content = `${props.currentGenre} Songs`;
        buttons = songFilterButtons(
          props.contentFilter,
          props.setContentFilter
        );
        break;
      case props.contentIndex === 1:
        content = `${props.currentGenre} Projects`;
        buttons = projectFilterButtons(
          props.contentFilter,
          props.setContentFilter
        );
        break;
      case props.contentIndex === 2:
        content = `${props.currentGenre} Artists`;
        buttons = artistFilterButtons(
          props.contentFilter,
          props.setContentFilter
        );
        break;
      case props.contentIndex === 3:
        content = `${props.currentGenre} Playlists`;
        break;
      default:
        break;
    }

    return { content: content, filterButtons: buttons };
  };

  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid
        item
        style={{ width: "100%", marginBottom: "2.5vh", height: "10vh" }}
      >
        <HeaderBar content={props.currentGenre} icon={Radio} />
      </Grid>
      <Grid item xs style={{ width: "100%" }}>
        <Grid container stye={{ height: "100%", width: "100%" }}>
          <Grid
            item
            style={{
              width: "5vw",
            }}
          >
            <Paper
              style={{
                width: "5vw",
                borderRadius: "0px",
                backgroundImage: "linear-gradient(to left, indigo, purple)",
              }}
              elevation={3}
            >
              <Grid
                container
                alignItems="center"
                justify="center"
                direction="column"
                style={{ height: "100%", width: "100%", paddingTop: "2.5vh" }}
              >
                {contentDisplayButtons(
                  props.contentIndex,
                  props.setContentIndex,
                  props.currentGenre && props.currentGenre.toLocaleLowerCase()
                ).map((data) => {
                  return (
                    <Grid item style={{ paddingBottom: "2.5vh" }}>
                      <SimpleIconButton
                        onClick={data.onClick}
                        condition={data.condition}
                        icon={data.icon}
                        placement={"left"}
                        tooltip={data.tooltip}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
          <Grid
            item
            xs
            style={{
              height: "62.5vh",
              marginBottom: "2.5vh",
              marginLeft: "1.25vw",
            }}
          >
            <GenreDisplayPanel {...props} headerData={getHeaderData} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const GenreDisplayComposed = compose(withFirebase)(GenreDisplayBase);

export default function GenreBrowser(props) {
  return <GenreDisplayComposed {...props} />;
}
