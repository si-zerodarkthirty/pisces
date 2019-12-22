import Vue from 'vue'
import * as firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyAlxt5q5iHcC7hpIXWhyDIdGx-dzIm-2Ko",
  authDomain: "pisces-bcb66.firebaseapp.com",
  databaseURL: "https://pisces-bcb66.firebaseio.com",
  projectId: "pisces-bcb66",
  storageBucket: "pisces-bcb66.appspot.com",
  messagingSenderId: "279897135658",
  appId: "1:279897135658:web:e6500e5d313fabab1f4153",
  measurementId: "G-6K50PYL9NR"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);

let auth = firebaseApp.auth()
let db = firebaseApp.firestore()

export { auth, db }

import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin)