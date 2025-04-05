import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDFHikwrgSvKwx2MHDqCnEj7gFrFBua9Qk",
    authDomain: "gmu-rmp.firebaseapp.com",
    projectId: "gmu-rmp",
    storageBucket: "gmu-rmp.firebasestorage.app",
    messagingSenderId: "1010648701387",
    appId: "1:1010648701387:web:b61e84535b0a542ccd3e4e",
    measurementId: "G-3BELTEJD0H"
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
