//Firebase Stuff
import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDnqgqlbsVRT1eU00cOIhpc8cvY0IZhgfY",
  authDomain: "cliq-50ded.firebaseapp.com",
  databaseURL: "https://cliq-50ded.firebaseio.com",
  projectId: "cliq-50ded",
  storageBucket: "cliq-50ded.appspot.com",
  messagingSenderId: "292355636441"
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
