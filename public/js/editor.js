import { db , onAuthStateChanged,auth} from './database.js';
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const blogTitleField = document.querySelector('.title');
const articleFeild = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
});

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
          .then(data => {
              if (uploadType == "image") {
                  addImage(data, file.name);
              } else {
                  bannerPath = `${location.origin}/${data}`;
                  banner.style.backgroundImage = `url("${bannerPath}")`;
              }
          });
    } else {
        alert("upload Image only");
    }
};

const addImage = (imagepath, alt) => {
    let curPos = articleFeild.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleFeild.value = articleFeild.value.slice(0, curPos) + textToInsert + articleFeild.value.slice(curPos);
};

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', async () => {
    if (articleFeild.value.length && blogTitleField.value.length) {
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for (let i = 0; i < 4; i++) {
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        let docName = `${blogTitle}-${id}`;
        let date = new Date();

        try {
            const docRef = doc(collection(db, "blogs"), docName);
            await setDoc(docRef, {
                title: blogTitleField.value,
                article: articleFeild.value,
                bannerImage: bannerPath,
                publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
                author: auth.currentUser.email.split("@")[0] 
            });
            // Optionally update the UI with the new blog or redirect
            location.href = `/${docName}`;
        } catch (err) {
            console.error(err);
        }
    }
});


auth.onAuthStateChanged((user)=>{
    if(!user){
        location.replace("/admin"); //  this will redirect to admin if no one is login
    }
})
