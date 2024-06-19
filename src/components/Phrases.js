import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Phrases.css";
import NavBar from "./NavBar";

function Phrases() {
  const [languages, setLanguages] = useState([]);
  const [phrases, setPhrases] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [phraseLanguages, setPhraseLanguages] = useState({});

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
        setSelectedLanguage(response.data[0]?.languageId || null);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    const fetchPhrases = async () => {
      try {
        const response = await axios.get("http://localhost:5270/api/phrase", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPhrases(response.data);
      } catch (error) {
        console.error("Error fetching phrases:", error);
      }
    };

    fetchLanguages();
    fetchPhrases();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      const fetchPhraseLanguages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5270/api/phraselanguage`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const phraseLangMap = {};
          response.data.forEach((pl) => {
            phraseLangMap[`${pl.phraseId}_${pl.languageId}`] = pl;
          });
          setPhraseLanguages(phraseLangMap);
        } catch (error) {
          console.error("Error fetching phrase languages:", error);
        }
      };

      fetchPhraseLanguages();
    }
  }, [selectedLanguage]);

  const handleInputChange = (e, phraseId) => {
    const { name, value } = e.target;
    setPhraseLanguages((prevState) => ({
      ...prevState,
      [`${phraseId}_${selectedLanguage}`]: {
        ...prevState[`${phraseId}_${selectedLanguage}`],
        [name]: value,
      },
    }));
  };

  /*
const handleSave = async (phraseId) => {
const key = ${phraseId}_${selectedLanguage};
const phraseLang = phraseLanguages[key];
try {
if (phraseLang && phraseLang.phraseInLanguage) {
await axios.put(
http://localhost:5270/api/phraselanguage/${phraseId}/${selectedLanguage},
{
phraseId: phraseId,
languageId: selectedLanguage,
phraseLanguage: phraseLang.phraseInLanguage,
},
{
headers: {
Authorization: Bearer ${localStorage.getItem("token")},
},
}
);
alert("Phrase updated successfully");
} else {
await axios.post(
"http://localhost:5270/api/phraselanguage",
{
phraseId: phraseId,
languageId: selectedLanguage,
phraseLanguage: phraseLang?.phraseInLanguage || "",
},
{
headers: {
Authorization: Bearer ${localStorage.getItem("token")},
},
}
);
alert("Phrase created successfully");
}
} catch (error) {
console.error("Error saving phrase:", error);
alert("Failed to save phrase");
}
};
*/

  const handleSave = async (phraseId) => {
    const key = `${phraseId}_${selectedLanguage}`;
    const phraseLang = phraseLanguages[key];
    try {
      if (phraseLang && phraseLang.phraseInLanguage) {
        if (phraseLang.id) {
          // Update existing phrase language
          await axios.put(
            `http://localhost:5270/api/phraselanguage/${phraseId}/${selectedLanguage}`,
            {
              phraseId: phraseId,
              languageId: selectedLanguage,
              phraseLanguage: phraseLang.phraseInLanguage,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          alert("Phrase updated successfully");
        } else {
          // Create new phrase language
          await axios.post(
            "http://localhost:5270/api/phraselanguage",
            {
              phraseId: phraseId,
              languageId: selectedLanguage,
              phraseLanguage: phraseLang.phraseInLanguage,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          alert("Phrase created successfully");
        }
      } else {
        alert("Phrase in language cannot be empty");
      }
    } catch (error) {
      console.error("Error saving phrase:", error);
      alert("Failed to save phrase");
    }
  };

  const handleDelete = async (phraseId) => {
    try {
      await axios.delete(
        `http://localhost:5270/api/phraselanguage/${phraseId}/${selectedLanguage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPhraseLanguages((prev) => {
        const newState = { ...prev };
        delete newState[`${phraseId}_${selectedLanguage}`];
        return newState;
      });
      alert("Phrase deleted successfully");
    } catch (error) {
      console.error("Error deleting phrase:", error);
      alert("Failed to delete phrase");
    }
  };

  const getPhraseInLanguage = (phraseId) => {
    const key = `${phraseId}_${selectedLanguage}`;
    return phraseLanguages[key]?.phraseInLanguage || "";
  };

  return (
    <div className="page-content">
      <NavBar />
      <div className="language-selector">
        <label htmlFor="language-select">Select a language:</label>
        <select
          id="language-select"
          value={selectedLanguage || ""}
          onChange={(e) => setSelectedLanguage(parseInt(e.target.value))}
        >
          {languages.map((language) => (
            <option key={language.languageId} value={language.languageId}>
              {language.languageName}
            </option>
          ))}
        </select>
      </div>
      <table className="phrases-table">
        <thead>
          <tr>
            <th>Phrase</th>
            <th>Phrase in Language</th>
            <th>Submit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {phrases.map((phrase) => (
            <tr key={phrase.phraseId}>
              <td>
                <input type="text" value={phrase.phraseText} readOnly />
              </td>
              <td className="input-cell">
                <input
                  type="text"
                  name="phraseInLanguage"
                  value={getPhraseInLanguage(phrase.phraseId)}
                  onChange={(e) => handleInputChange(e, phrase.phraseId)}
                />
              </td>
              <td>
                <button
                  className="submit-button"
                  onClick={() => handleSave(phrase.phraseId)}
                >
                  ✔
                </button>
              </td>
              <td>
                {phraseLanguages[`${phrase.phraseId}_${selectedLanguage}`] && (
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(phrase.phraseId)}
                  >
                    X
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Phrases;
