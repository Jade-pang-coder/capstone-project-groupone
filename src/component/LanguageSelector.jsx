import { useState } from "react";
import "./LanguageSelector.css";

const LanguageSelector = ({ onLanguageChange }) => {
  const [language, setLanguage] = useState("en");

  const languages = {
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    onLanguageChange && onLanguageChange(lang);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language">Language:</label>
      <select
        id="language"
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="language-select"
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
