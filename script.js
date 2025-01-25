// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAVRzQ3iLoEFAcTgL_k0fx5jwcJbjhp9rM",
  authDomain: "friendshipchallenge-8531a.firebaseapp.com",
  projectId: "friendshipchallenge-8531a",
  storageBucket: "friendshipchallenge-8531a.appspot.com",
  messagingSenderId: "1008748777139",
  appId: "1:1008748777139:web:cd1ea8bef7262efbd7eac6",
  measurementId: "G-QGSZW1BLW8",
};
firebase.initializeApp(firebaseConfig);

var fileText = document.querySelector(".fileText");
var fileItem;
var fileName;

function getFile(e){
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    fileText.innerHTML = fileName;
}

function uploadImage(){
    let storageRef = firebase.storage().ref("images/"+fileName);
    let uploadTask = storageRef.put(fileItem);

    uploadTask.on("state_changed", (snapshot) =>{
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
    }, (error)=>{
        console.log(error.message);
    }, () =>{
        uploadTask.snapshot.ref.getDownloadURL().then(url => {
            console.log("File available at", url);
        });
    });
}