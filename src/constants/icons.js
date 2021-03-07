import React from "react";
import {
  Album,
  Event,
  List,
  HourglassEmpty,
  Person,
  FilterNone,
  PlayArrow,
  ThumbUpAlt,
  Today,
  People,
  Bookmark,
  MusicNote,
  Mic,
  QueueMusic,
} from "@material-ui/icons";

export const albumIcons = [
  () => <Album style={{ color: "white" }} />,
  () => <Event style={{ color: "white" }} />,
  () => <List style={{ color: "white" }} />,
  () => <HourglassEmpty style={{ color: "white" }} />,
];

export const artistIcons = [
  Person,
  FilterNone,
  PlayArrow,
  ThumbUpAlt,
  People,
];

export const projectIcons = [
  Album,
  Today,
  PlayArrow,
  ThumbUpAlt,
  Bookmark,
];

export const contentIcons = [
  MusicNote,
  Album,
  Mic,
  QueueMusic,
];
