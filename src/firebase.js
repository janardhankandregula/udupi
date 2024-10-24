// Import the functions you need from the SDKs you need

// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByPzvcwWQsvI5Qb5dCMvUYV2xZHs1j7-c",
  authDomain: "database-test-5041a.firebaseapp.com",
  projectId: "database-test-5041a",
  storageBucket: "database-test-5041a.appspot.com",
  messagingSenderId: "274600622054",
  appId: "1:274600622054:web:e55c6844ad673023c48827",
  measurementId: "G-2N502P4206",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
