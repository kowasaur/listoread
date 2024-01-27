import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyAOME21OHL--AeH35Sgonr_F4md7TKkz0s",
    authDomain: "listoread.firebaseapp.com",
    projectId: "listoread",
    storageBucket: "listoread.appspot.com",
    messagingSenderId: "434308976599",
    appId: "1:434308976599:web:9f4a8675b4734924354592",
});

export const googleAuthProvider = new GoogleAuthProvider();
