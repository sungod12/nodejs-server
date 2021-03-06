const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyDt_atiF8KQwRTZHZJcuU35MRfMa1WiE5s",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://pass-manager142-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDERID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

module.exports = { database, auth };
