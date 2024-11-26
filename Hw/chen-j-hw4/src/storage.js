const storeName = 'nys-state-buddy';
const initData = [ "p142" ];

const loadJSONFromLocalStorage = () => {
    // get data
    let string = localStorage.getItem(storeName);

    // set data and get it again
    if (!string) {
        localStorage.setItem(storeName, JSON.stringify(initData));
        string = localStorage.getItem(storeName);
    }

    let json;
    try {
        json = JSON.parse(string);
        if (!Array.isArray(json)) throw new Error('Stored data is not an array');
    } 
    catch (error) {
        console.log(`ERROR: ${error} with string: ${string}`);
        json = [...initData];
    }

    return json;
};

// add the value to the array
export const writeToLocalStorage = (value) => {
    const json = loadJSONFromLocalStorage();

    if (!json.includes(value)) {
        json.push(value);
    }

    localStorage.setItem(storeName, JSON.stringify(json));
};

// remove the value from the array
export const removeFromLocalStorage = (value) => {
    const json = loadJSONFromLocalStorage();
    const updatedJson = json.filter(item => item !== value);

    localStorage.setItem(storeName, JSON.stringify(updatedJson));
};

// just return the array
export const readFromLocalStorage = () => {
    return loadJSONFromLocalStorage();
};