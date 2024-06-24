import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import config from "../config";

function Leaderboards() {
  const [sessionLeaderboard, setSessionLeaderboard] = useState([]);
  const [totalLeaderboard, setTotalLeaderboard] = useState([]);
  const { auth } = useContext(AuthContext);
  const { isSidebarOpen } = useSidebar(); // Use sidebar context

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const sessionResponse = await axios.get(
          `${config.apiBaseUrl}api/score/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSessionLeaderboard(sessionResponse.data.entries);

        const totalResponse = await axios.get(
          `${config.apiBaseUrl}api/score/totalpoints/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTotalLeaderboard(totalResponse.data.entries);
      } catch (error) {
        console.error("Error fetching leaderboards:", error);
      }
    };

    if (auth) {
      fetchLeaderboards();
    }
  }, [auth]);

  return (
    <div
      className={`mt-20 p-5 flex flex-col items-center ${
        isSidebarOpen ? "ml-56" : "mx-auto"
      } transition-all duration-300 w-full`}
    >
      <div className="flex flex-col lg:flex-row justify-around w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="w-full lg:w-1/2 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-5 text-center">
            Best Learning Sessions
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 p-3 text-left">Rank</th>
                <th className="border-b-2 p-3 text-left">Username</th>
                <th className="border-b-2 p-3 text-left">Session Points</th>
              </tr>
            </thead>
            <tbody>
              {sessionLeaderboard.map((entry) => (
                <tr
                  key={entry.currentUserPosition}
                  className="odd:bg-gray-100 hover:bg-gray-200"
                >
                  <td className="border-b p-3">{entry.currentUserPosition}</td>
                  <td className="border-b p-3">{entry.userName}</td>
                  <td className="border-b p-3">{entry.sessionPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full lg:w-1/2 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-5 text-center">Total Score</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 p-3 text-left">Rank</th>
                <th className="border-b-2 p-3 text-left">Username</th>
                <th className="border-b-2 p-3 text-left">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {totalLeaderboard.map((entry) => (
                <tr
                  key={entry.currentUserPosition}
                  className="odd:bg-gray-100 hover:bg-gray-200"
                >
                  <td className="border-b p-3">{entry.currentUserPosition}</td>
                  <td className="border-b p-3">{entry.userName}</td>
                  <td className="border-b p-3">{entry.sessionPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboards;
