import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
import "firebase";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_API_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.firestore = app.firestore();
    this.googleProvider = new app.auth.GoogleAuthProvider();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doVerifyPasswordResetCode = (actionCode) =>
    this.auth.verifyPasswordResetCode(actionCode);

  doConfirmPasswordReset = (actionCode, password) =>
    this.auth.confirmPasswordReset(actionCode, password);

  firestoreSet = (collection, docId, doc) =>
    this.firestore
      .collection(collection)
      .doc(docId)
      .set({ ...doc });

  firestoreAdd = (collection, doc) =>
    this.firestore.collection(collection).add({ ...doc });

  firestoreDelete = (collection, docID) =>
    this.firestore.collection(collection).doc(docID).delete();

  firestoreAddUserArtistID = (docId, value) =>
    this.firestore
      .collection("users")
      .doc(docId)
      .update({ artistIDs: app.firestore.FieldValue.arrayUnion(value) });

  firestoreAddUserPlaylistID = (docId, value) =>
    this.firestore
      .collection("users")
      .doc(docId)
      .update({ playlistIDs: app.firestore.FieldValue.arrayUnion(value) });

  firestoreAddArtistProjectID = (docId, value) =>
    this.firestore
      .collection("artists")
      .doc(docId)
      .update({ projectIDs: app.firestore.FieldValue.arrayUnion(value) });

  firestoreAddArtistGenre = (docId, value) =>
    this.firestore
      .collection("artists")
      .doc(docId)
      .update({ genres: app.firestore.FieldValue.arrayUnion(value) });

  firestoreAddArtistDebutDate = (docId, value) =>
    this.firestore
      .collection("artists")
      .doc(docId)
      .update({ debutDate: value });

  firestoreAddProjectSongID = (docId, value) =>
    this.firestore
      .collection("projects")
      .doc(docId)
      .update({ songIDs: app.firestore.FieldValue.arrayUnion(value) });

  firestoreGetFlat = (collection) =>
    this.firestore.collection(collection).get();

  firestoreGetDoc = (collection, docID) =>
    this.firestore.collection(collection).doc(docID).get();

  firestoreGetGenrePopular = (collection, genre, filter, limit) =>
    this.firestore
      .collection(collection)
      .where("genres", "array-contains", genre)
      .orderBy(filter, "desc")
      .limit(limit)
      .get();

  firestoreGetGenreRising = (collection, genre, date, filter, limit) =>
    this.firestore
      .collection(collection)
      .where("genres", "array-contains", genre)
      .where("debutDate", ">=", date)
      .orderBy(filter, "desc")
      .limit(limit)
      .get();

  firestoreGetGenreRecent = (collection, genre, limit) =>
    this.firestore
      .collection(collection)
      .where("genres", "array-contains", genre)
      .orderBy("debutDate", "desc")
      .limit(limit)
      .get();

  firestoreLimitedGet = (collection, order, param, value, limit) =>
    this.firestore
      .collection(collection)
      .where(param, "==", value)
      .orderBy(order[0], order[1])
      .limit(limit)
      .get();
}

export default Firebase;
