import * as firebase from 'firebase'
require('firebase/firestore')
window.addEventListener = (x) => x;
var firebaseConfig = {
  apiKey: "AIzaSyBukljmm5OqzHnyleGd1d3FpEwr8qQpSus",
  authDomain: "wily-app-e0147.firebaseapp.com",
  databaseURL: "https://wily-app-e0147.firebaseio.com",
  projectId: "wily-app-e0147",
  storageBucket: "wily-app-e0147.appspot.com",
  messagingSenderId: "493793988494",
  appId: "1:493793988494:web:d33b2153f3c0622ec75edf"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()