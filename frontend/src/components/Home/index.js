import React from "react";
import "../../styles/home.css";

const index = () => {
  return (
    <div className="home">
      <div className="Q1">
        <p>
          <strong>Q-1</strong> Email client app like Outlook.
        </p>
        <a href="/email">
          <button className="btn-Q">Go to Question 1</button>
        </a>
      </div>
      <div className="Q2">
        <p>
          <strong>Q-2</strong> Problem Statement: Interactive Data Visualization
          Dashboard
        </p>
        <a href="/dashboard">
          <button className="btn-Q">Go to Question 2</button>
        </a>
      </div>
    </div>
  );
};

export default index;
