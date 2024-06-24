import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import config from "../config";
import { useSidebar } from "../context/SidebarContext";

// Helper function to shuffle an array
const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

function Question() {
  const { selectedLanguageId } = useParams();
  const { auth, setTotalPoints } = useContext(AuthContext); // Use setTotalPoints from context
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [combo, setCombo] = useState(1);
  const [score, setScore] = useState(0);
  const [lastTwoQuestions, setLastTwoQuestions] = useState([]);
  const [choices, setChoices] = useState([]);
  const { isSidebarOpen } = useSidebar(); // Use sidebar context

  useEffect(() => {
    if (auth) {
      fetchQuestion();
    }
  }, [auth, selectedLanguageId]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}api/questionphrase/${selectedLanguageId}`,
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
        setChoices(
          shuffle([
            newQuestion.selectedLanguageText,
            ...newQuestion.otherPhrases,
          ])
        );
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
        `${config.apiBaseUrl}api/score/Update`,
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
      ? `${config.apiBaseUrl}api/phraseLanguageUser/update`
      : `${config.apiBaseUrl}api/wordLanguageUser/update`;

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
      <div className="flex flex-col items-center text-center p-5 mt-20">
        <div
          className={`text-4xl font-bold ${
            isCorrect ? "text-green-500" : "text-red-500"
          }`}
        >
          {isCorrect ? "Correct!" : "Wrong!"}
        </div>
        {!isCorrect && (
          <div className="mt-2 text-2xl text-black">
            {question.nativeLanguageText} = {question.selectedLanguageText}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center text-center p-5 mt-20 ${
        isSidebarOpen ? "ml-56" : "mx-auto"
      }`}
    >
      <h2 className="text-3xl mb-5">{question.nativeLanguageText}</h2>
      <div className="flex justify-around w-full max-w-xs mb-5 text-lg">
        <div className="text-blue-500 font-bold text-xl p-3 rounded bg-gray-200">
          Combo: x{combo}
        </div>
        <div className="text-green-500 font-bold text-xl p-3 rounded bg-gray-200">
          Score: {score}
        </div>
      </div>
      <div className="flex flex-col mt-5 w-full max-w-sm">
        {choices.map((choice, index) => (
          <button
            key={index}
            className={`my-2 py-2 px-4 text-lg border-2 rounded transition-colors w-full ${
              selectedAnswer === choice
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
            onClick={() => handleAnswerSelect(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-xs mt-5">
        <button
          onClick={handleSubmit}
          className="flex-1 py-2 px-4 text-lg text-white bg-green-500 rounded hover:bg-green-600 mx-1"
        >
          Submit
        </button>
        <button
          onClick={handleSkip}
          className="flex-1 py-2 px-4 text-lg text-white bg-yellow-500 rounded hover:bg-yellow-600 mx-1"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

export default Question;
