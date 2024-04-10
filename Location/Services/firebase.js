import * as firebase from "firebase";
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLnGTXh2RrR2x2GvgJURS8Qx1xArP6sxA",
  authDomain: "rolexp-91faa.firebaseapp.com",
  projectId: "rolexp-91faa",
  storageBucket: "rolexp-91faa.appspot.com",
  messagingSenderId: "768160097408",
  appId: "1:768160097408:web:d340c510e3dfdf39c2f265"
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export {auth, firestore};