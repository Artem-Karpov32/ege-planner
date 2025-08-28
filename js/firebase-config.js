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
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();
const db = firebase.firestore();