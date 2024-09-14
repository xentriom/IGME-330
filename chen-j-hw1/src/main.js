import { randomElement } from "./utils.js";

// Global variables to store babble data
let word1 = [];
let word2 = [];
let word3 = [];

// Load babble when DOM content is loaded
document.addEventListener("DOMContentLoaded", async () => loadBabble());

/**
 * Load babble data from a JSON file and call babbleLoaded when stored
 */
export const loadBabble = () => {
    const url = './data/babble-data.json';
    const xhr = new XMLHttpRequest();

    try {
        xhr.onload = (e) => {
            const text = e.target.responseText;
            const babble = JSON.parse(text);

            // Store babble data
            word1 = babble.word1;
            word2 = babble.word2;
            word3 = babble.word3;

            // Call babbleLoaded
            babbleLoaded();
        };

        xhr.open("GET", url, true);
        xhr.send();
    } catch (error) {
        console.error(error);
    }
};

/**
 * Display initial techno babble text, add event listeners to buttons
 */
const babbleLoaded = () => {
    displayTechno(generateTechno(1));

    // Add event listeners to buttons
    document.querySelector("#base-button").addEventListener("click", () => displayTechno(generateTechno(1)));
    document.querySelector("#extra-button").addEventListener("click", () => displayTechno(generateTechno(5)));
};

/**
 * Generate techno babble text
 * @param {number} num - Number of techno babble lines to generate
 * @returns {string} Techno babble text
 */
export const generateTechno = (num) => {
    let babble = "";

    for (let i = 0; i < num; i++) {
        const w1 = randomElement(word1);
        const w2 = randomElement(word2);
        const w3 = randomElement(word3);

        babble += `${w1} ${w2} ${w3}\n`;
    }

    // Trim whitespace and return
    return babble.trim();
};

/**
 * Display techno babble text in the output div
 * @param {string} babble - Techno babble text
 */
const displayTechno = (babble) => document.querySelector("#output").innerHTML = `<pre>${babble}</pre>`;