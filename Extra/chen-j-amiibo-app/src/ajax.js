export const loadXHR = (url, callback) => {
    // set up the connection
    // when the data loads, invoke the callback function and pass it the `xhr` object
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            callback(xhr);
        } else if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log("The request failed!");
        }
    };
    xhr.send();
};