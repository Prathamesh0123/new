import { db } from './database.js';
import { collection, getDocs, query } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const blogSection = document.querySelector('.blogs-section');

// Create a query against the "blogs" collection
const q = query(collection(db, "blogs"));

getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        if (doc.id !== decodeURI(location.pathname.split("/").pop())) {
            createBlog(doc);
        }
    });
}).catch((error) => {
    console.error("Error fetching documents: ", error);
});

const createBlog = (doc) => {
    let data = doc.data();
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${data.article.substring(0, 200) + '...'}</p>
        <a href="/${doc.id}" class="btn dark">read</a>
    </div>
    `;
};
