import {
  Album,
  AllInbox,
  AllInclusive,
  ArtTrack,
  Bookmark,
  Group,
  Mic,
  MusicNote,
  NewReleases,
  PlayArrow,
  QueueMusic,
  ThumbUpAlt,
  TrendingUp,
} from "@material-ui/icons";
import { pushHistory } from "./utils";
import * as routes from "./routes";

export const homeButtons = (condition) => [
  {
    text: "Release Feed",
    onClick: () => pushHistory(`${routes.HOME}/feed`),
    icon: ArtTrack,
    condition: condition === 0,
    tooltip: "Recommendations and releases from your followed artists"
  },
  {
    text: "My Library",
    onClick: () => pushHistory(`${routes.HOME}/library`),
    icon: AllInbox,
    condition: condition === 1,
    tooltip: "Your library of saved songs, projects artists and playlists"
  },
  {
    text: "My Playlists",
    onClick: () => pushHistory(`${routes.HOME}/playlists`),
    icon: QueueMusic,
    condition: condition === 2,
    tooltip: "Create and manage your personal playlists"
  },
];

export const contentDisplayButtons = (condition, onClick, tooltip) => [
  {
    onClick: () => onClick(0),
    icon: MusicNote,
    condition: condition === 0,
    tooltip: `Display ${tooltip} songs`,
  },
  {
    onClick: () => onClick(1),
    icon: Album,
    condition: condition === 1,
    tooltip: `Display ${tooltip} projects`,
  },
  {
    onClick: () => onClick(2),
    icon: Mic,
    condition: condition === 2,
    tooltip: `Display ${tooltip} artists`,
  },
  {
    onClick: () => onClick(3),
    icon: QueueMusic,
    condition: condition === 3,
    tooltip: `Display ${tooltip} playlists`,
  },
];

export const songFilterButtons = (condition, onClick) => [
  {
    onClick: () => onClick(0),
    icon: PlayArrow,
    condition: condition === 0,
    tooltip: "Filter by plays",
  },
  {
    onClick: () => onClick(1),
    icon: ThumbUpAlt,
    condition: condition === 1,
    tooltip: "Filter by likes",
  },
];

export const projectFilterButtons = (condition, onClick) => [
  {
    onClick: () => onClick(0),
    icon: PlayArrow,
    condition: condition === 0,
    tooltip: "Filter by plays",
  },
  {
    onClick: () => onClick(1),
    icon: ThumbUpAlt,
    condition: condition === 1,
    tooltip: "Filter by likes",
  },
  {
    onClick: () => onClick(2),
    icon: Bookmark,
    condition: condition === 2,
    tooltip: "Filter by bookmarks",
  },
];

export const artistFilterButtons = (condition, onClick) => [
  {
    onClick: () => onClick(0),
    icon: PlayArrow,
    condition: condition === 0,
    tooltip: "Filter by plays",
  },
  {
    onClick: () => onClick(1),
    icon: ThumbUpAlt,
    condition: condition === 1,
    tooltip: "Filter by likes",
  },
  {
    onClick: () => onClick(2),
    icon: Bookmark,
    condition: condition === 2,
    tooltip: "Filter by bookmarks",
  },
  {
    onClick: () => onClick(3),
    icon: Group,
    condition: condition === 3,
    tooltip: "Filter by follows",
  },
];

export const timeframeButtons = (condition, onClick) => [
  {
    onClick: () => onClick(0),
    icon: AllInclusive,
    condition: condition === 0,
    tooltip: "Filter by all-time popularity"
  },
  {
    onClick: () => onClick(1),
    icon: TrendingUp,
    condition: condition === 1,
    tooltip: "Filter by trending"
  },
  {
    onClick: () => onClick(2),
    icon: NewReleases,
    condition: condition === 2,
    tooltip: "Filter by most recent"
  },
];
