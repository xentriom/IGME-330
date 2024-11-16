const AmiiboSearchUI = ({ term, setTerm, searchAmiibo }) => {
    return (
      <div>
        <button onClick={() => searchAmiibo(term)}>Search</button>
        <label>
          Name:
          <input
            type="text"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />
        </label>
      </div>
    );
  };
  
  export default AmiiboSearchUI;
  