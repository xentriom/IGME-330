import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, runTransaction } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

let app;

export const initApp = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCTLIOjE1iPut1ugATDnN2LW9J4Y0DQXlc",
        authDomain: "ny-buddy.firebaseapp.com",
        projectId: "ny-buddy",
        storageBucket: "ny-buddy.firebasestorage.app",
        messagingSenderId: "215633781841",
        appId: "1:215633781841:web:969f03a85d85d1289cc470"
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