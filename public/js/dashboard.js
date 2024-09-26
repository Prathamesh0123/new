import { db, auth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from './database.js';
import { collection, query, where, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const loginButton = document.getElementById('login-button');
const loginContainer = document.getElementById('login-container');
const navbar = document.querySelector('.navbar');
const blogsSection = document.querySelector('.blogs-section');
const heading = document.querySelector('.headding');

// Function to handle UI visibility based on login state
function updateUIForUser(user) {
    if (user) {
        loginContainer.style.display = 'none';
        navbar.style.display = 'flex'; // Ensure the navbar is displayed
        blogsSection.style.display = 'block';
        heading.style.display = 'block';

        // Fetch and display blogs written by the logged-in user
        getUserWrittenBlogs(auth);
    } else {
        loginContainer.style.display = 'flex';
        navbar.style.display = 'none';
        blogsSection.style.display = 'none';
        heading.style.display = 'none';
    }
}

// Initialize UI based on auth state
onAuthStateChanged(auth, user => {
    console.log(user ? 'User is logged in:' : 'No user logged in.', user);
    updateUIForUser(user);
});

loginButton.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(result => {
        console.log('User signed in:', result.user);
        updateUIForUser(result.user); // Update UI after sign-in
    }).catch(error => {
        console.error('Error during sign-in:', error);
    });
});

// Fetch and display blogs written by the logged-in user
const getUserWrittenBlogs = (auth) => {
    const userEmail = auth.currentUser.email.split('@')[0];
    const blogsQuery = query(collection(db, "blogs"), where("author", "==", userEmail));

    getDocs(blogsQuery).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            createBlog(doc);
        });
    }).catch((error) => {
        console.error("Error loading blogs:", error);
    });
};

// Function to create and append a blog card
const createBlog = (doc) => {
    const data = doc.data();
    blogsSection.innerHTML += `
        <div class="blog-card" id="blog-${doc.id}">
            <img src="${data.bannerImage}" class="blog-image" alt="">
            <h1 class="blog-title">${data.title.substring(0, 100)}...</h1>
            <p class="blog-overview">${data.article.substring(0, 200)}...</p>
            <a href="/${doc.id}" class="btn dark">Read</a>
            <a href="/${doc.id}/editor" class="btn grey">edit</a>
            <a href="#" onclick="deleteBlog('${doc.id}')" class="btn danger">delete</a>
        </div>
    `;
};

// Function to delete a blog
const deleteBlog = async (id) => {
    const confirmation = confirm("Are you sure you want to delete this blog?");
    if (confirmation) {
        try {
            await deleteDoc(doc(db, "blogs", id));
            document.getElementById(`blog-${id}`).remove();
            alert("Blog deleted successfully.");
            // location.reload();
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete the blog. Please try again.");
        }
    }
};

// Make deleteBlog globally accessible
window.deleteBlog = deleteBlog;
