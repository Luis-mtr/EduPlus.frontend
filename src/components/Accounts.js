import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Accounts.css";
import NavBar from "./NavBar";
import config from "../config";

function Accounts() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [userTypes] = useState(["User", "Admin"]);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/account`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
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

    fetchUsers();
    fetchLanguages();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.userName.toLowerCase().includes(searchUsername.toLowerCase()) &&
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchUsername, searchEmail, users]);

  const getLanguageName = (languageId) => {
    const language = languages.find((lang) => lang.languageId === languageId);
    return language ? language.languageName : "Unknown";
  };

  const handleDelete = async (userId) => {
    if (window.confirm(`Are you sure you want to delete this user?`)) {
      try {
        await axios.delete(`${config.apiBaseUrl}api/account/delete/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleInputChange = (e, userId) => {
    const { name, value } = e.target;
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, [name]: value } : user
      )
    );
  };

  const handleUpdate = async (userId) => {
    const user = users.find((user) => user.id === userId);
    try {
      await axios.put(
        `${config.apiBaseUrl}api/account/update/${userId}`,
        {
          Username: user.userName,
          Email: user.email,
          LanguageId: user.languageId,
          Role: user.role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  return (
    <div className="page-content">
      <NavBar />
      <table className="accounts-table">
        <thead>
          <tr>
            <th>
              <input
                type="text"
                placeholder="Search Username"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Search Email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </th>
            <th>Native Language</th>
            <th>User Type</th>
            <th>Del.</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="text"
                  name="userName"
                  value={user.userName}
                  onChange={(e) => handleInputChange(e, user.id)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="email"
                  value={user.email}
                  onChange={(e) => handleInputChange(e, user.id)}
                />
              </td>
              <td>
                <select
                  name="languageId"
                  value={user.languageId}
                  onChange={(e) => handleInputChange(e, user.id)}
                >
                  {languages.map((language) => (
                    <option
                      key={language.languageId}
                      value={language.languageId}
                    >
                      {language.languageName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  name="role"
                  value={user.role}
                  onChange={(e) => handleInputChange(e, user.id)}
                >
                  {userTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(user.id)}
                >
                  X
                </button>
              </td>
              <td>
                <button
                  className="submit-button"
                  onClick={() => handleUpdate(user.id)}
                >
                  ✔
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Accounts;
