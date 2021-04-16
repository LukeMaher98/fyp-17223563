import { startOfMonth } from "../constants/utils";

const getPopularGenreSongs = async (firebase, genre, filter) => {
  let displaySongs = [];
  await firebase
    .firestoreGetGenrePopular("songs", genre, filter, 60)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let id = doc.id;
        if (data.debutDate.seconds * 1000 < new Date().getTime()) {
          displaySongs = [...displaySongs, { songID: id, songData: data }];
        }
      });
    });
  return displaySongs;
};

const getRisingGenreSongs = async (firebase, genre, filter) => {
  let displaySongs = [];
  await firebase
    .firestoreGetGenreRising("songs", genre, startOfMonth(), filter, 60)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let id = doc.id;
        if (data.debutDate.seconds * 1000 < new Date().getTime()) {
          displaySongs = [...displaySongs, { songID: id, songData: data }];
        }
      });
    });
  return displaySongs;
};

const getRecentGenreSongs = async (firebase, genre) => {
  let displaySongs = [];
  await firebase
    .firestoreGetGenreRecent("songs", genre, 60)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let id = doc.id;
        if (data.debutDate.seconds * 1000 < new Date().getTime()) {
          displaySongs = [...displaySongs, { songID: id, songData: data }];
        }
      });
    });
  return displaySongs;
};

const getPopularGenreProjects = async (firebase, genre, filter) => {
  let displayProjects = [];
  await firebase
    .firestoreGetGenrePopular("projects", genre, filter, 60)
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
  return displayProjects;
};

const getRisingGenreProjects = async (firebase, genre, filter) => {
  let displayProjects = [];
  await firebase
    .firestoreGetGenreRising("projects", genre, startOfMonth(), filter, 60)
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
  return displayProjects;
};

const getRecentGenreProjects = async (firebase, genre) => {
  let displayProjects = [];
  await firebase
    .firestoreGetGenreRecent("projects", genre, 60)
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
  return displayProjects;
};

const getPopularGenreArtists = async (firebase, genre, filter) => {
  let displayArtists = [];
  await firebase
    .firestoreGetGenrePopular("artists", genre, filter, 60)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let id = doc.id;
        displayArtists = [
          ...displayArtists,
          { artistID: id, artistData: data },
        ];
      });
    });
  return displayArtists;
};

const getRisingGenreArtists = async (firebase, genre, filter) => {
  let displayArtists = [];
  await firebase
    .firestoreGetGenreRising("artists", genre, startOfMonth(), filter, 60)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let id = doc.id;
        displayArtists = [
          ...displayArtists,
          { artistID: id, artistData: data },
        ];
      });
    });
  return displayArtists;
};

const getRecentGenreArtists = async (firebase, genre) => {
  let displayArtists = [];
  await firebase
    .firestoreGetGenreRecent("artists", genre, 60)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let id = doc.id;
        displayArtists = [
          ...displayArtists,
          { artistID: id, artistData: data },
        ];
      });
    });
  return displayArtists;
};

const getPopularGenrePlaylists = async (firebase, genre, filter) => {
  let displayPlaylists = [];
  await firebase
    .firestoreGetGenrePopular("playlists", genre, filter, 60)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let id = doc.id;
        displayPlaylists = [
          ...displayPlaylists,
          { playlistID: id, playlistData: data },
        ];
      });
    });
  return displayPlaylists;
};

const getRisingGenrePlaylists = async (firebase, genre, filter) => {
  let displayPlaylists = [];
  await firebase
    .firestoreGetGenreRising("playlists", genre, startOfMonth(), filter, 60)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let id = doc.id;
        displayPlaylists = [
          ...displayPlaylists,
          { playlistID: id, playlistData: data },
        ];
      });
    });
  return displayPlaylists;
};

const getRecentGenrePlaylists = async (firebase, genre) => {
  let displayPlaylists = [];
  await firebase
    .firestoreGetGenreRecent("playlists", genre, 60)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let id = doc.id;
        displayPlaylists = [
          ...displayPlaylists,
          { playlistID: id, playlistData: data },
        ];
      });
    });
  return displayPlaylists;
};

export const getSongFunction = (index) => {
  const playlistFunctions = [
    getPopularGenreSongs,
    getRisingGenreSongs,
    getRecentGenreSongs,
  ];
  return playlistFunctions[index];
};

export const getArtistFunction = (index) => {
  const artistFunctions = [
    getPopularGenreArtists,
    getRisingGenreArtists,
    getRecentGenreArtists,
  ];
  return artistFunctions[index];
};

export const getProjectFunction = (index) => {
  const projectFunctions = [
    getPopularGenreProjects,
    getRisingGenreProjects,
    getRecentGenreProjects,
  ];
  return projectFunctions[index];
};

export const getPlaylistFunction = (index) => {
  const playlistFunctions = [
    getPopularGenrePlaylists,
    getRisingGenrePlaylists,
    getRecentGenrePlaylists,
  ];
  return playlistFunctions[index];
};