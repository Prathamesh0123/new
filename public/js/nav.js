import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  logOutUser,
} from "./database.js";

let ul = document.querySelector(".links-container");

auth.onAuthStateChanged((user) => {
  if (user) {
    // user login
    ul.innerHTML = `
    <li class="link-item"><a href="/" class="link">home</a></li>
    <li class="link-item"><a href="/editor" class="link">editor</a></li>
    <li class="link-item"><a href="/admin" class="link">Dashboard</a></li>

    <li class="link-item"><a href="/admin" onclick="logOutUser()" class="link">logout</a></li>
    `;
  } else {
    // no one login
    ul.innerHTML = `
    <li class="link-item"><a href="/admin" class="link">Login</a></li>
    `;
  }
});
