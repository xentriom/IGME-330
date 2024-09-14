/**
 * Get a random element from an array
 * @param {Array} array - Array of elements
 * @returns {string} Random element from the array
 */
export const randomElement = (array) => array[Math.floor(Math.random() * array.length)];