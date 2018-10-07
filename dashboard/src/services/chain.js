import firebase from 'firebase';
import config from "../config";

firebase.initializeApp({
  databaseURL: config.firebase,
});
export const database = firebase.database();
