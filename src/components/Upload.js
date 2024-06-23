import React, { useState } from "react";
import axios from "axios";
import "./Upload.css";
import NavBar from "./NavBar";
import config from "../config";

function Upload() {
  const [phrase, setPhrase] = useState("");
  const [words, setWords] = useState("");

  const handlePhraseChange = (e) => {
    setPhrase(e.target.value);
  };

  const handleWordsChange = (e) => {
    setWords(e.target.value);
  };

  const handleSubmit = async () => {
    const wordsList = words.split(",").map((word) => word.trim());

    const payload = {
      phraseText: phrase,
      words: wordsList,
    };

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}api/Phrase/bulk-add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Phrase and words added successfully");
      setPhrase("");
      setWords("");
    } catch (error) {
      console.error("Error adding phrase and words:", error);
      alert("Failed to add phrase and words");
    }
  };

  return (
    <div className="page-content">
      <NavBar />
      <div className="upload-container">
        <h1>Type in a new phrase</h1>
        <input
          type="text"
          placeholder="Phrase..."
          value={phrase}
          onChange={handlePhraseChange}
        />
        <div className="spacer"></div>
        <label>Type in the words in that phrase separated by comma:</label>
        <input
          type="text"
          placeholder="word1, word2, word3..."
          value={words}
          onChange={handleWordsChange}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default Upload;
