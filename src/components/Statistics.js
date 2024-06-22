import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Statistics.css";

function Statistics() {
  const { auth } = useContext(AuthContext);
  const [statistics, setStatistics] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [allLanguagesStats, setAllLanguagesStats] = useState(null);
  const [overallStats, setOverallStats] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5270/api/languages",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const stats = await Promise.all(
          languages.map(async (language) => {
            const response = await axios.get(
              `http://localhost:5270/api/score/statistics/${language.languageId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return {
              ...response.data,
              languageName: language.languageName,
            };
          })
        );

        const filteredStats = stats.filter((stat) => stat.totalCountAsked > 0);
        setStatistics(filteredStats);

        // Calculate all languages stats
        if (filteredStats.length > 0) {
          const totalAnswersGiven = filteredStats.reduce(
            (sum, stat) => sum + stat.totalCountAsked,
            0
          );
          const totalCorrectAnswers = filteredStats.reduce(
            (sum, stat) => sum + stat.totalCountRight,
            0
          );
          const averageScore =
            filteredStats.reduce((sum, stat) => sum + stat.averageScore, 0) /
            filteredStats.length;

          setAllLanguagesStats({
            totalCountAsked: totalAnswersGiven,
            totalCountRight: totalCorrectAnswers,
            averageScore: averageScore.toFixed(2),
          });
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    const fetchOverallStats = async () => {
      try {
        const response = await axios.get("http://localhost:5270/api/score", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOverallStats(response.data);
      } catch (error) {
        console.error("Error fetching overall statistics:", error);
      }
    };

    if (languages.length > 0) {
      fetchStatistics();
      fetchOverallStats();
    }
  }, [languages]);

  return (
    <div className="page-content">
      <div className="statistics-container">
        <h2>Statistics</h2>
        {overallStats && (
          <div className="overall-stats">
            <strong>Highest Session Score:</strong> {overallStats.sessionPoints}
            <br />
            <strong>Total Points:</strong> {overallStats.addPoints}
          </div>
        )}
        {allLanguagesStats && (
          <div className="all-languages-stats">
            <strong>All Languages</strong>
            <ul>
              <li>Total Answers Given: {allLanguagesStats.totalCountAsked}</li>
              <li>
                Total Correct Answers: {allLanguagesStats.totalCountRight}
              </li>
              <li>Average Score: {allLanguagesStats.averageScore}%</li>
            </ul>
          </div>
        )}
        {statistics.length > 0 ? (
          <ul>
            {statistics.map((stat, index) => (
              <li key={index}>
                <strong>{stat.languageName}</strong>
                <ul>
                  <li>Total Answers Given: {stat.totalCountAsked}</li>
                  <li>Total Correct Answers: {stat.totalCountRight}</li>
                  <li>Average Score: {stat.averageScore}%</li>
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No statistics available.</p>
        )}
      </div>
    </div>
  );
}

export default Statistics;
