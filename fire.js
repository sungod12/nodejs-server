import firebase from "firebase";
import "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDt_atiF8KQwRTZHZJcuU35MRfMa1WiE5s",
    authDomain: "pass-manager142.firebaseapp.com",
    databaseURL: "https://pass-manager142-default-rtdb.firebaseio.com",
    projectId: "pass-manager142",
    storageBucket: "pass-manager142.appspot.com",
    messagingSenderId: "748600489580",
    appId: "1:748600489580:web:0bc3f00926c2dea7fdca49",
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);