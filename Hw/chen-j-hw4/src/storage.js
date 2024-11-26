const storeName = 'nys-state-buddy';
const initData = { "id": "p142" };

const loadJSONFromLocalStorage = () => {
    // get json
    let string = localStorage.getItem(storeName);

    // set json and get it again
    if (!string) {
        localStorage.setItem(storeName, JSON.stringify(initData))
        string = localStorage.getItem(storeName);
    };

    let json;
    try {
        json = JSON.parse(string);
        if (!json) throw new Error('json is null!');
    } 
    catch (error) {
        console.log(`ERROR: ${error} with string: ${string}`);
        json = {};
    }

    return json;
};

export const writeToLocalStorage = (key, value) => {
    const json = loadJSONFromLocalStorage();
    json[key] = value;
    localStorage.setItem(storeName, JSON.stringify(json));
}

export const readFromLocalStorage = (key) => {
    const json = loadJSONFromLocalStorage();
    return json[key];
}