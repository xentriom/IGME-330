import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, runTransaction } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

let app;

export const initApp = () => {
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

export const retrieveParkData = () => {
    const db = getDatabase(app);
    const likesRef = ref(db, 'park');

    return likesRef;
};

export const updateLikeCount = (parkId, increment = true) => {
    const db = getDatabase(app);
    const likeRef = ref(db, `park/${parkId}`);

    // https://modularfirebase.web.app/reference/database.runtransaction
    // runTransaction is a better set so i used it instead of set from your demo
    runTransaction(likeRef, (currentLikes) => {
        if (currentLikes === null) {
            return increment ? 1 : 0;
        }
        return increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    });
};