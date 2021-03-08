import aws_sdk from "aws-sdk";

const config = {
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  apiVersion: "2006-03-01",
};

class AWS {
  constructor() {
    aws_sdk.config.update({
      region: "eu-west-1",
    });
    this.s3 = new aws_sdk.S3({ ...config });
  }

  // *** AWS API ***

  uploadProjectCover = (data, artistID, projectID) =>
    this.s3
      .putObject({
        Bucket: "debut-image-files",
        Key: `projectCovers/${artistID}/${projectID}`,
        ACL: "public-read-write",
        Body: data,
      })
      .promise();

  deleteProjectCover = (artistID, projectID) =>
    this.s3
      .deleteObject({
        Bucket: "debut-image-files",
        Key: `projectCovers/${artistID}/${projectID}`,
      })
      .promise();

  uploadProjectSong = (data, artistID, projectID, songID) =>
    this.s3
      .putObject({
        Bucket: "debut-audio-files",
        Key: `artistSongs/${artistID}/${projectID}/${songID}`,
        ACL: "public-read-write",
        Body: data,
      })
      .promise();

  deleteProjectSong = (artistID, projectID, songID) =>
    this.s3
      .deleteObject({
        Bucket: "debut-audio-files",
        Key: `artistSongs/${artistID}/${projectID}/${songID}`,
      })
      .promise();

  uploadArtistImage = (data, artistID) =>
    this.s3
      .putObject({
        Bucket: "debut-image-files",
        Key: `artistImages/${artistID}`,
        ACL: "public-read-write",
        Body: data,
      })
      .promise();

  deleteArtistImage = (file) =>
    this.s3
      .deleteObject({
        Bucket: "debut-image-files",
        Key: `artistImages/${file}`,
      })
      .promise();

  uploadPlaylistImage = (data, playlistID) =>
    this.s3
      .putObject({
        Bucket: "debut-image-files",
        Key: `playlistImages/${playlistID}`,
        ACL: "public-read-write",
        Body: data,
      })
      .promise();

  deletePlaylistImage = (file) =>
    this.s3
      .deleteObject({
        Bucket: "debut-image-files",
        Key: `playlistImages/${file}`,
      })
      .promise();
}

export default AWS;
