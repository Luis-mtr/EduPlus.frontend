import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Question.css";
import { AuthContext } from "../context/AuthContext";

function Question() {
  const { selectedLanguageId } = useParams();
  const { auth, setTotalPoints } = useContext(AuthContext); // Use setTotalPoints from context
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [combo, setCombo] = useState(1);
  const [score, setScore] = useState(0);
  const [lastTwoQuestions, setLastTwoQuestions] = useState([]);

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
      const newQuestion = response.data;

      // Check if the new question is one of the last two questions
      if (lastTwoQuestions.some((q) => q.phraseId === newQuestion.phraseId)) {
        // If it is, fetch a new question
        fetchQuestion();
      } else {
        setQuestion(newQuestion);
        setLastTwoQuestions((prevQuestions) => {
          const updatedQuestions = [...prevQuestions, newQuestion];
          return updatedQuestions.length > 2
            ? updatedQuestions.slice(1)
            : updatedQuestions;
        });
        setSelectedAnswer("");
        setIsCorrect(null);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const updateScore = async (sessionPoints, addPoints) => {
    try {
      await axios.post(
        "http://localhost:5270/api/score/Update",
        {
          sessionPoints: sessionPoints,
          addPoints: addPoints,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating score:", error);
    }
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

      if (isAnswerCorrect) {
        const newScore = score + combo;
        const comboValue = combo;
        setScore(newScore);
        setCombo((prevCombo) => (prevCombo < 128 ? prevCombo * 2 : prevCombo));
        updateScore(newScore, comboValue);
        setTotalPoints((prevTotalPoints) => prevTotalPoints + comboValue); // Update the total points in the context
      } else {
        setCombo(1);
      }

      // Show result for 2 seconds, then fetch a new question
      setTimeout(() => {
        fetchQuestion();
      }, 2000);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleSkip = () => {
    setCombo(1);
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
      <div className="game-stats">
        <div className="stat-item combo">Combo: x{combo}</div>
        <div className="stat-item score">Score: {score}</div>
      </div>
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
