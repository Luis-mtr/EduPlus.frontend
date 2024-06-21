import React from "react";
import "./Statistics.css";

function Statistics() {
  return (
    <div className="page-content">
      <div className="statistics-container">
        <h2>Statistics</h2>
        <ul>
          <li>Total Users: 1,234</li>
          <li>Active Users: 567</li>
          <li>Languages Available: 12</li>
          <li>Phrases Added: 4,321</li>
          <li>Words Learned: 9,876</li>
          <li>Most Popular Language: Spanish</li>
        </ul>
      </div>
    </div>
  );
}

export default Statistics;
