import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBsv_-mOdZhKmecgbtdxUJ8ItSPvPBT1bw",
  authDomain: "firsttest-11ded.firebaseapp.com",
  projectId: "firsttest-11ded",
  storageBucket: "firsttest-11ded.appspot.com",
  messagingSenderId: "431919907848",
  appId: "1:431919907848:web:ce9766e08564f696133dbd",
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };