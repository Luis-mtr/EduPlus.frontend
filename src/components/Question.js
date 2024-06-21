import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Question.css";
import { AuthContext } from "../context/AuthContext";

function Question() {
  const { selectedLanguageId } = useParams();
  const { auth } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    if (auth) {
      fetchQuestion();
    }
  }, [auth, selectedLanguageId]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5270/api/questionphrase/${selectedLanguageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setQuestion(response.data);
      setSelectedAnswer("");
      setIsCorrect(null);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = async () => {
    if (!question) return;

    const isAnswerCorrect = selectedAnswer === question.selectedLanguageText;
    const endpoint = question.isPhrase
      ? `http://localhost:5270/api/phraseLanguageUser/update`
      : `http://localhost:5270/api/wordLanguageUser/update`;

    const idParam = question.isPhrase ? "phraseId" : "wordId";
    const params = new URLSearchParams({
      selectedLanguageId: selectedLanguageId,
      [idParam]: question.phraseId,
      isCorrect: isAnswerCorrect,
    }).toString();

    try {
      await axios.post(`${endpoint}?${params}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setIsCorrect(isAnswerCorrect);

      // Show result for 2 seconds, then fetch a new question
      setTimeout(() => {
        fetchQuestion();
      }, 2000);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleSkip = () => {
    fetchQuestion();
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  if (isCorrect !== null) {
    return (
      <div className="result-container">
        <div className={`result ${isCorrect ? "correct" : "incorrect"}`}>
          {isCorrect ? "Correct!" : "Wrong!"}
        </div>
        {!isCorrect && (
          <div className="correct-answer">
            {question.nativeLanguageText} = {question.selectedLanguageText}
          </div>
        )}
      </div>
    );
  }

  const choices = [question.selectedLanguageText, ...question.otherPhrases];

  return (
    <div className="question-container">
      <h2>{question.nativeLanguageText}</h2>
      <div className="answers">
        {choices.map((choice, index) => (
          <button
            key={index}
            className={`answer-button ${
              selectedAnswer === choice ? "selected" : ""
            }`}
            onClick={() => handleAnswerSelect(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      <div className="actions">
        <button onClick={handleSubmit} className="submit-button">
          Submit
        </button>
        <button onClick={handleSkip} className="skip-button">
          Skip
        </button>
      </div>
    </div>
  );
}

export default Question;
