import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import ms from "./ms";
import ta from "./ta";
import zh from "./zh";

export const supportedLanguages = ["en", "zh", "ms", "ta"];
export const languageStorageKey = "appLanguage";

const getInitialLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    return supportedLanguages.includes(savedLanguage) ? savedLanguage : "en";
  } catch {
    return "en";
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    ms: { translation: ms },
    ta: { translation: ta },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

const updateDocumentLanguage = (language) => {
  document.documentElement.lang = language;
  document.title = i18n.t("common.shopName", { lng: language });
};

updateDocumentLanguage(i18n.resolvedLanguage || "en");
i18n.on("languageChanged", updateDocumentLanguage);

export default i18n;
