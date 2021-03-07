export const newUserData = (email, username) => {
  return {
    email: email,
    userName: username,
    joinDate: new Date(),
    artistIDs: [],
    playlistIDs: [],
    savedPlaylistIDs: [],
    followedArtistIDs: [],
    bookmarkedProjectIDs: [],
    likedSongIDs: [],
  };
};

export const newPlaylistData = (userID, userName) => {
  return {
    userID: userID,
    userName: userName,
    themeLight: "",
    themeDark: "",
    playlistName: "",
    description: "",
    genres: [],
    debutDate: new Date(),
    saveCount: 0,
    songIDs: [],
    imageVersion: 0,
  };
};

export const newArtistData = (userID) => {
  return {
    name: "",
    themeLight: "",
    themeDark: "",
    biography: "",
    userID: userID,
    debutDate: null,
    projectIDs: [],
    playCount: 0,
    likeCount: 0,
    imageVersion: 0,
    followCount: 0,
    bookmarkCount: 0,
    genres: [],
  };
};

export const newProjectData = () => {
  return {
    title: "",
    artist: null,
    artistID: null,
    genres: [],
    debutDate: null,
    releaseType: "",
    themeLight: "",
    themeDark: "",
    songIDs: [],
    playCount: 0,
    likeCount: 0,
    bookmarkCount: 0,
    imageVersion: 0,
  };
};

export const newSongData = () => {
  return {
    artist: null,
    artistID: null,
    project: "",
    projectID: null,
    duration: 0,
    title: "",
    genres: [],
    debutDate: null,
    playCount: 0,
    likeCount: 0,
    saveCount: 0,
  };
};
