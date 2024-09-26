import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAasXBF5p-h5KIIr_ry8CWkiVd2AxroMg8",
  authDomain: "myblog-84be9.firebaseapp.com",
  projectId: "myblog-84be9",
  storageBucket: "myblog-84be9.appspot.com",
  messagingSenderId: "768233735429",
  appId: "1:768233735429:web:ab21ace5c8e4f2cf47a36c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logOutUser = () =>{
  signOut(auth);
  location.reload();
}

window.logOutUser = logOutUser; // Export to global scope


// Export the auth module and Firebase functions
export { auth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,db,logOutUser };
