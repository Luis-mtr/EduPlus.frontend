import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import config from "../config";

function Statistics() {
  const { auth, nativeLanguageId } = useContext(AuthContext);
  const { isSidebarOpen } = useSidebar(); // Use sidebar context
  const [statistics, setStatistics] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [allLanguagesStats, setAllLanguagesStats] = useState(null);
  const [overallStats, setOverallStats] = useState(null);
  const [labels, setLabels] = useState({});

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const labelIds = [24, 27, 22, 28, 29, 30, 31];
        const labelPromises = labelIds.map((id) =>
          axios.get(
            `${config.apiBaseUrl}api/wordlanguage/${id}/${nativeLanguageId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        );
        const labelResponses = await Promise.all(labelPromises);
        const newLabels = {};
        labelResponses.forEach((response, index) => {
          newLabels[labelIds[index]] = response.data; // Assuming response.data is the string
        });
        setLabels(newLabels);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/languages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    if (auth && nativeLanguageId) {
      fetchLabels();
      fetchLanguages();
    }
  }, [auth, nativeLanguageId]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const stats = await Promise.all(
          languages.map(async (language) => {
            const response = await axios.get(
              `${config.apiBaseUrl}api/score/statistics/${language.languageId}`,
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
        const response = await axios.get(`${config.apiBaseUrl}api/score`, {
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
    <div
      className={`mt-20 p-5 flex flex-col items-center ${
        isSidebarOpen ? "ml-56" : "mx-auto"
      } transition-all duration-300`}
    >
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-5">
          {labels[24] || "Statistics"}
        </h2>
        {overallStats && (
          <div className="mb-5 text-lg">
            <strong>{labels[27] || "Highest Session Score"}:</strong>{" "}
            {overallStats.sessionPoints}
            <br />
            <strong>{labels[22] || "Total Points"}:</strong>{" "}
            {overallStats.addPoints}
          </div>
        )}
        {allLanguagesStats && (
          <div className="mb-5 text-lg">
            <strong>{labels[28] || "All Languages"}</strong>
            <ul className="list-none p-0">
              <li>
                {labels[29] || "Total Answers Given"}:{" "}
                {allLanguagesStats.totalCountAsked}
              </li>
              <li>
                {labels[30] || "Total Correct Answers"}:{" "}
                {allLanguagesStats.totalCountRight}
              </li>
              <li>
                {labels[31] || "Average Score"}:{" "}
                {Math.round(allLanguagesStats.averageScore)}%
              </li>
            </ul>
          </div>
        )}
        {statistics.length > 0 ? (
          <ul className="list-none p-0">
            {statistics.map((stat, index) => (
              <li key={index} className="mb-4">
                <strong className="text-xl">{stat.languageName}</strong>
                <ul className="list-none mt-2">
                  <li>
                    {labels[29] || "Total Answers Given"}:{" "}
                    {stat.totalCountAsked}
                  </li>
                  <li>
                    {labels[30] || "Total Correct Answers"}:{" "}
                    {stat.totalCountRight}
                  </li>
                  <li>
                    {labels[31] || "Average Score"}:{" "}
                    {Math.round(stat.averageScore)}%
                  </li>
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
