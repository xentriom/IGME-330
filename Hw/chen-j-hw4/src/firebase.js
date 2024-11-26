import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, set, push, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

let app;

const setupUI = () => {
    document.querySelector("#button-park-counter").onclick = () => {
        
    };
}

const initApp = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyBN5ML1DZiiIlwwZ9p6wF45d0TEyQc0BTI",
        authDomain: "high-scores-56600.firebaseapp.com",
        projectId: "high-scores-56600",
        storageBucket: "high-scores-56600.firebasestorage.app",
        messagingSenderId: "307360192328",
        appId: "1:307360192328:web:5285f8e5fdcaf12e04857d"
    };

    app = initializeApp(firebaseConfig);
};

const loadData = () => {
    const db = getDatabase(app);
    const likesRef = ref(db, 'likes');

    onValue(likesRef, (snapshot) => {
        const data = snapshot.val();

        console.log(data);
        // TODO: add to ol
    });
};

export const updateLikeCount = (parkId, increment = true) => {
    const db = getDatabase(app);
    const likeRef = ref(db, `likes/${parkId}`);

    runTransaction(likeRef, (currentLikes) => {
        if (currentLikes === null) {
            return increment ? 1 : 0;
        }
        return increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    })
    .catch((error) => {
        console.error(`Failed to update like count: ${error}`);
    });
};

const init = () => {
    initApp();
    loadData();
};

init();