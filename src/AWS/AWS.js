import aws_sdk from "aws-sdk";
import { setUploadProgress } from "../actions/ArtistManagementActions";

const config = {
  accessKeyId: null,
  secretAccessKey: null,
  apiVersion: "2006-03-01",
};

class AWS {
  constructor() {
    aws_sdk.config.update({
      region: "eu-west-1",
      httpOptions: {
        timeout: 100000000000000000000000000000000000000000000000,
        connectTimeout: 100000000000000000000000000000000000000000000000,
      },
    });
    this.s3 = new aws_sdk.S3({ ...config });
  }

  // *** AWS API ***

  uploadFile = (data, projectID, songID, type, artistID) => {
    const params = {
      Bucket: "debut-image-files",
      Key: `${artistID}/${projectID}/${songID}/${type}`,
      ACL: "public-read",
      Body: data,
    };

    this.s3.putObject(params, function (err, data) {
      if (err) {
        alert("File failed to upload");
        throw err;
      } else {
        alert("File uploaded successfully");
      }
    });
  };

  uploadProjectCover = (data, artistID, projectID) =>
    this.s3
      .putObject({
        Bucket: "debut-image-files",
        Key: `projectCovers/${artistID}/${projectID}`,
        ACL: "public-read",
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
        ACL: "public-read",
        Body: data,
      })
      .on("httpUploadProgress", ({ loaded, total }) => {
        setUploadProgress(Math.round((100 * loaded) / total));
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
        ACL: "public-read",
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
        ACL: "public-read",
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
