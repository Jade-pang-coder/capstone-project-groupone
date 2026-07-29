import { useTranslation } from "react-i18next";
import { languageStorageKey } from "../i18n";
import "./LanguageSelector.css";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const languages = [
    { code: "en", label: t("language.english") },
    { code: "zh", label: t("language.chinese") },
    { code: "ms", label: t("language.malay") },
    { code: "ta", label: t("language.tamil") },
  ];

  const handleLanguageChange = async (event) => {
    const language = event.target.value;
    await i18n.changeLanguage(language);
    try {
      localStorage.setItem(languageStorageKey, language);
    } catch {
      // Language switching still works when storage is unavailable.
    }
  };

  return (
    <div className="language-selector">
      <span className="language-selector__icon" aria-hidden="true">
        🌐
      </span>
      <label className="sr-only" htmlFor="app-language">
        {t("language.select")}
      </label>
      <select
        id="app-language"
        value={i18n.resolvedLanguage || "en"}
        onChange={handleLanguageChange}
        className="language-select"
        aria-label={t("language.select")}
        title={t("language.select")}
      >
        {languages.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
