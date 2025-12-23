// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";


// const firebaseConfig = {
//   apiKey: "AIzaSyCvd55aGskGTg_gDd1uPwGCKSRRti38rPg",
//   authDomain: "fir-login-3ec2b.firebaseapp.com",
//   projectId: "fir-login-3ec2b",
//   storageBucket: "fir-login-3ec2b.firebasestorage.app",
//   messagingSenderId: "475219906958",
//   appId: "1:475219906958:web:e0a31a115b459fa75794df",
//   measurementId: "G-LJP8Q3QBT5"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();


import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();