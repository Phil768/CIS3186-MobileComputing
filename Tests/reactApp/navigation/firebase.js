// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsv_-mOdZhKmecgbtdxUJ8ItSPvPBT1bw",
  authDomain: "firsttest-11ded.firebaseapp.com",
  projectId: "firsttest-11ded",
  storageBucket: "firsttest-11ded.appspot.com",
  messagingSenderId: "431919907848",
  appId: "1:431919907848:web:ce9766e08564f696133dbd",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
export { auth, db };
