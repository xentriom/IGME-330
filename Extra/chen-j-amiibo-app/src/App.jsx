import { useEffect, useState, useMemo } from "react";
import { loadXHR } from "./ajax";
import { readFromLocalStorage, writeToLocalStorage } from "./storage";
import { Header } from "./Header";
import AmiiboSearchUI from "./AmiiboSearchUI";
import AmiiboList from "./AmiiboList";
import Footer from "./Footer";
import './App.css'

// app "globals" and utils
const baseurl = "https://www.amiiboapi.com/api/amiibo/?name=";

const App = () => {
  const savedTerm = useMemo(() => readFromLocalStorage("term") || "", []);
  const [term, setSearchTerm] = useState(savedTerm);
  const [results, setResults] = useState([]);

  useEffect(() => {
    writeToLocalStorage("term", term);
  }, [term]);

  const searchAmiibo = (name) => {
    loadXHR(`${baseurl}${name}`, (xhr) => parseAmiiboResult(xhr));
  };

  const parseAmiiboResult = (xhr) => {
    // get the `.responseText` string
    const responseText = xhr.responseText;

    // declare a json variable
    let json;

    // try to parse the string into a json object
    try {
      json = JSON.parse(responseText);
    } catch (error) {
      console.log("There was an error parsing JSON", error);
      setResults([]);
      return;
    }

    if (json.amiibo) {
      setResults(json.amiibo);
    } else {
      setResults([]);
    }
  };

  return <>
    <Header />
    <hr />
    <main>
      <AmiiboSearchUI
        term={term}
        setTerm={setSearchTerm}
        searchAmiibo={searchAmiibo}
      />
      <AmiiboList array={results} />
    </main>
    <hr />
    <Footer
      name="Ace Coder"
      year={new Date().getFullYear()}
    />
  </>;
};

export default App;