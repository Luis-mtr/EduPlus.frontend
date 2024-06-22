import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Leaderboards.css";

function Leaderboards() {
  const [sessionLeaderboard, setSessionLeaderboard] = useState([]);
  const [totalLeaderboard, setTotalLeaderboard] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const sessionResponse = await axios.get(
          "http://localhost:5270/api/score/leaderboard",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSessionLeaderboard(sessionResponse.data.entries);

        const totalResponse = await axios.get(
          "http://localhost:5270/api/score/totalpoints/leaderboard",
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
    <div className="leaderboards-container">
      <div className="leaderboard">
        <h2>Best Learning Sessions</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Session Points</th>
            </tr>
          </thead>
          <tbody>
            {sessionLeaderboard.map((entry) => (
              <tr key={entry.currentUserPosition}>
                <td>{entry.currentUserPosition}</td>
                <td>{entry.userName}</td>
                <td>{entry.sessionPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="leaderboard">
        <h2>Total Score</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {totalLeaderboard.map((entry) => (
              <tr key={entry.currentUserPosition}>
                <td>{entry.currentUserPosition}</td>
                <td>{entry.userName}</td>
                <td>{entry.sessionPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboards;
