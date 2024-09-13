// Global variables to store babble data
let word1 = [];
let word2 = [];
let word3 = [];

/**
 * Load babble data from a JSON file
 * @returns {Promise<void>} A Promise that resolves when the babble data is loaded
 */
export const loadBabble = () => {
    return new Promise((resolve, reject) => {
        const url = './data/babble-data.json';
        const xhr = new XMLHttpRequest();

        try {
            xhr.onload = (e) => {
                const text = e.target.responseText;
                const babble = JSON.parse(text);

                // Store babble and resolve the Promise
                babbleLoaded(babble);
                resolve();
            };

            xhr.open("GET", url, true);
            xhr.send();
        } catch (error) {
            // Reject Promise with error
            reject(error);
        }
    });
};

/**
 * Store babble data in global variables
 * @param {Object} babble - Babble data 
 */
const babbleLoaded = (babble) => {
    word1 = babble.word1;
    word2 = babble.word2;
    word3 = babble.word3;
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
 * Get a random element from an array
 * @param {Array} array - Array of elements
 * @returns {string} Random element from the array
 */
export const randomElement = (array) => array[Math.floor(Math.random() * array.length)];