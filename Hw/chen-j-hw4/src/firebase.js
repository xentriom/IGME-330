import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

const parks = {
    "p79": "Letchworth State Park",
    "p20": "Hamlin Beach State Park",
    "p180": "Brookhaven State Park",
    "p35": "Allan H. Treman State Marine Park",
    "p118": "Stony Brook State Park",
    "p142": "Watkins Glen State Park",
    "p62": "Taughannock Falls State Park",
    "p84": "Selkirk Shores State Park",
    "p43": "Chimney Bluffs State Park",
    "p200": "Shirley Chisholm State Park",
    "p112": "Saratoga Spa State Park"
};
let app;

const setupUI = () => {
    // add event listener to button
    document.querySelector("#button-park-counter").onclick = () => {
        const parkId = document.querySelector("#input-park-id").value;
        const toDecrement = document.querySelector("#checkbox-count-type").checked;

        if (!parks[parkId]) {
            alert("Invalid park ID");
            return;
        }

        updateLikeCount(parkId, !toDecrement);
        loadData();
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
    const likesRef = ref(db, 'park');
    const list = document.querySelector("#park-list");

    onValue(likesRef, (snapshot) => {
        const data = snapshot.val();
        list.innerHTML = "";

        const items = Object.entries(data)
            .map(([key, value]) => {
                const parkName = parks[key] || "Unknown Park";
                return `<li class="list-item"><strong>${parkName}</strong> (${key}) - Likes: ${value}</li>`;
            })
            .join("")
            .trim();

        list.innerHTML = items;
    });
};

export const updateLikeCount = (parkId, increment = true) => {
    const db = getDatabase(app);
    const likeRef = ref(db, `park/${parkId}`);

    runTransaction(likeRef, (currentLikes) => {
        if (currentLikes === null) {
            return increment ? 1 : 0;
        }
        return increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    });
};

const init = () => {
    try {
        initApp();
        setupUI();
        loadData();
    } catch { }
};

init();