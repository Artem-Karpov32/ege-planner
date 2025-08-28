// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVl7_V1calMgOUx6WSqiNNPQYuH3cA7mU",
  authDomain: "ege-planner.firebaseapp.com",
  projectId: "ege-planner",
  storageBucket: "ege-planner.firebasestorage.app",
  messagingSenderId: "753169005869",
  appId: "1:753169005869:web:fdbe2678276c2c2efc67a4",
  measurementId: "G-6LWHYFY7LF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);