import React, { useEffect, useState } from "react";
import { Grid, Paper } from "@material-ui/core";
import * as routes from "../../constants/routes";
import { primaryGenres } from "../../constants/genres";
import GenrePanel from "./GenrePanel";
import { withFirebase } from "../../firebase/context";
import { compose } from "recompose";
import { pushHistory } from "../../constants/utils";
import SearchBar from "../MiscComponents/SearchBar";
import SimpleIconButton from "../MiscComponents/SimpleIconButton";
import { Clear, ExpandLess, ExpandMore } from "@material-ui/icons";
import { useStyles } from "../../constants/styling"

const GenreBrowserBase = (props) => {
  const styles = useStyles()

  const [genreSearch, setGenreSearch] = useState("");
  const [expanded, setExpanded] = useState([]);
  const [allExpanded, setAllExpanded] = useState(true);

  useEffect(() => {
    expandAll();
  }, []);

  const expandAll = () => {
    let expandAll = [];
    for (let i = 0; i < primaryGenres.length; i++) {
      expandAll = [...expandAll, i];
    }
    setExpanded(expandAll);
  };

  const handleOpenGenre = (index) => {
    if (!expanded.includes(index)) {
      setExpanded([...expanded, index]);
    } else {
      let newExpanded = [];
      for (let i = 0; i < expanded.length; i++) {
        if (expanded[i] !== index) {
          newExpanded = [...newExpanded, expanded[i]];
        }
      }
      setExpanded(newExpanded);
    }
  };

  const goToGenrePage = (genre) => {
    props.setCurrentGenre(genre);
    pushHistory(`${routes.GENRE}/${genre.toLocaleLowerCase()}`);
  };

  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid
        item
        style={{ width: "100%", marginBottom: "2.5vh", height: "10vh" }}
      >
        <Grid container style={{ width: "100%", height: "100%" }}>
          <SearchBar
            value={genreSearch}
            setSearch={setGenreSearch}
            placeholder={"Search by genre..."}
            tooltip={"Filter displayed genre panels by name"}
          />
          <Grid
            item
            style={{
              height: "100%",
              width: "calc(10vh + 3.75vw)",
              marginLeft: "2.5vh",
            }}
          >
            <Paper
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "0px",
                backgroundImage:
                  "linear-gradient(to left, mediumvioletred, blueviolet)",
              }}
              elevation={3}
            >
              <Grid
                container
                alignItems="center"
                style={{ height: "100%", width: "100%" }}
              >
                <Grid item style={{ marginLeft: "1.25vw" }}>
                  <SimpleIconButton
                    onClick={() => setGenreSearch("")}
                    icon={Clear}
                    tooltip={"Clear search field"}
                  />
                </Grid>
                <Grid item style={{ marginLeft: "1.25vw" }}>
                  <SimpleIconButton
                    onClick={() => {
                      if (!allExpanded) {
                        expandAll();
                      } else {
                        setExpanded([]);
                      }
                      setAllExpanded(!allExpanded);
                    }}
                    icon={allExpanded ? ExpandLess : ExpandMore}
                    tooltip={allExpanded ? "Contract All" : "Expand All"}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid item style={{ width: "100%", height: "62.5vh" }}>
        <Paper
          elevation={3}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "0px",
            backgroundColor: "rgb(0,0,0,0.1)",
          }}
        >
          <Grid
            container
            direction="column"
            className={styles.scrollbars}
            style={{
              width: "100%",
              height: "100%",
              overflow: "auto",
            }}
            wrap="nowrap"
          >
            {primaryGenres.map((genre, index) => {
              if (
                genre
                  .toLocaleLowerCase()
                  .indexOf(genreSearch.toLocaleLowerCase()) !== -1
              ) {
                return (
                  <Grid item style={{ width: "100%", marginBottom: "2.5vh" }}>
                    <GenrePanel
                      {...props}
                      panelNum={index}
                      expanded={expanded}
                      handleChange={() => handleOpenGenre(index)}
                      genre={genre}
                      buttonFunction={() => goToGenrePage(genre)}
                    />
                  </Grid>
                );
              }
            })}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

const GenreBrowserComposed = compose(withFirebase)(GenreBrowserBase);

export default function GenreBrowser(props) {
  return <GenreBrowserComposed {...props} />;
}
