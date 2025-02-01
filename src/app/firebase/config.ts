// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5wyY442fe_XRy7yyFIV5wVlRqrrYqf4s",
  authDomain: "todo-auth-ce0e2.firebaseapp.com",
  projectId: "todo-auth-ce0e2",
  storageBucket: "todo-auth-ce0e2.firebasestorage.app",
  messagingSenderId: "280017960380",
  appId: "1:280017960380:web:804bc3c88fcd5ef0bdbfb9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
export {app,auth}