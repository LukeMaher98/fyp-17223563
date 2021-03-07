import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
import "firebase";

const config = {
  apiKey: "AIzaSyARXBcPpGUha88VEw1Y7mCaYmDSkkyenYM",
  authDomain: "debut-d6f4b.firebaseapp.com",
  databaseURL: "https://debut-d6f4b.firebaseio.com",
  projectId: "debut-d6f4b",
  storageBucket: "debut-d6f4b.appspot.com",
  messagingSenderId: "364509827541",
  appId: "1:364509827541:web:d9d851eb73ed979f3ead5c",
  measurementId: "G-H0RRMZ8F9C",
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.firestore = app.firestore();
    this.googleProvider = new app.auth.GoogleAuthProvider();
  }

  // *** Firebase API ***

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

  firestoreSettings = (settings) => {
    this.firestore.settings({ ...settings });
  };

  //***// Collection Setters //***//

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

  //***// Collection Getters //***//

  // Whole Collection

  firestoreGetFlat = (collection) =>
    this.firestore.collection(collection).get();

  firestoreGet = (collection, order) =>
    this.firestore.collection(collection).orderBy(order, "desc").get();

  // Specific doc by ID

  firestoreGetDoc = (collection, docID) =>
    this.firestore.collection(collection).doc(docID).get();

  // Genre searches

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
      .orderBy("debutDate", "desc")
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

  // Search by 1 Parameter

  firestoreGet1 = (collection, param, value) =>
    this.firestore
      .collection(collection)
      .where(param, "==", value)
      .limit(1)
      .get();

  firestoreLimitedGet1 = (collection, order, param, value) =>
    this.firestore
      .collection(collection)
      .where(param, "==", value)
      .orderBy(order[0], order[1])
      .limit(1)
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
