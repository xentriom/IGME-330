import { onValue } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import * as firebase from "./firebase.js";

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

const setupUI = () => {
    // add event listener to button
    document.querySelector("#button-park-counter").onclick = () => {
        const parkId = document.querySelector("#input-park-id").value;
        const toDecrement = document.querySelector("#checkbox-count-type").checked;

        // ensure valid park id
        if (!parks[parkId]) {
            alert("Invalid park ID");
            return;
        }

        firebase.updateLikeCount(parkId, !toDecrement);
        loadData();
    };
};

const loadData = () => {
    const likesRef = firebase.retrieveParkData("park");
    const list = document.querySelector("#park-list");

    onValue(likesRef, (snapshot) => {
        const data = snapshot.val();
        list.innerHTML = "";

        // create list items
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

const init = () => {
    firebase.initApp();
    setupUI();
    loadData();
};

init();