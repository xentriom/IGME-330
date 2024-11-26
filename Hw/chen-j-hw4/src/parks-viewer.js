import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

let app;

const initApp = () => {
    const firebaseConfig = {

    };
    app = initializeApp(firebaseConfig);
};

const loadData = () => {

};

const init = () => {
    initApp();
    loadData();
};

init();