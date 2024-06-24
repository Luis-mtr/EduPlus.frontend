import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Accounts from "./components/Accounts";
import Languages from "./components/Languages";
import Phrases from "./components/Phrases";
import Words from "./components/Words";
import Upload from "./components/Upload";
import Statistics from "./components/Statistics";
import Question from "./components/Question";
import Sidebar from "./components/Sidebar";
import Leaderboards from "./components/Leaderboards"; // Import Leaderboards component
import "./App.css";
import "./tailwind.css";

const MainContent = () => {
  const { auth, role } = useContext(AuthContext);

  return (
    <div
      className={`main-content ${
        auth && role === "User" ? "with-sidebar" : ""
      }`}
    >
      {auth && role === "User" && <Sidebar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/accounts"
          element={
            auth && role === "Admin" ? <Accounts /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/languages"
          element={
            auth && role === "Admin" ? <Languages /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/phrases"
          element={
            auth && role === "Admin" ? <Phrases /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/words"
          element={
            auth && role === "Admin" ? <Words /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/upload"
          element={
            auth && role === "Admin" ? <Upload /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/statistics"
          element={
            auth && role === "User" ? <Statistics /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/question/:selectedLanguageId"
          element={
            auth && role === "User" ? <Question /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/leaderboards"
          element={
            auth && role === "User" ? (
              <Leaderboards />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <SidebarProvider>
      <Router>
        <MainContent />
      </Router>
    </SidebarProvider>
  );
}

export default App;
