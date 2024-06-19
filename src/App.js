import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPage from "./components/AdminPage";
import UserPage from "./components/UserPage";
import Accounts from "./components/Accounts";
import Languages from "./components/Languages";
import Phrases from "./components/Phrases";

function App() {
  const { auth, role } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            auth && role === "Admin" ? <AdminPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/user"
          element={
            auth && role === "User" ? <UserPage /> : <Navigate to="/login" />
          }
        />
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
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
