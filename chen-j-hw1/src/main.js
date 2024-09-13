import { loadBabble, generateTechno } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Load and display initial babble
    await loadBabble();
    displayTechno(generateTechno(1));

    // Add event listeners to buttons
    document.querySelector("#base-button").addEventListener("click", () => displayTechno(generateTechno(1)));
    document.querySelector("#extra-button").addEventListener("click", () => displayTechno(generateTechno(5)));
});

/**
 * Display techno babble text in the output div
 * @param {string} babble - Techno babble text
 */
const displayTechno = (babble) => document.querySelector("#output").innerHTML = `<pre>${babble}</pre>`;