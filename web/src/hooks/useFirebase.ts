// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9IV71jOxRLjGUnV0jEFirU9cf2V099c4",
  authDomain: "sandglass-ccce4.firebaseapp.com",
  projectId: "sandglass-ccce4",
  storageBucket: "sandglass-ccce4.firebasestorage.app",
  messagingSenderId: "703398515772",
  appId: "1:703398515772:web:29adadfaac7717e2811f39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function useAuth(){
    return auth;
}

