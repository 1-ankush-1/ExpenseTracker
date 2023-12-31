import { createContext, useContext } from "react";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import english from "./languages/english.json";
import hindi from "./languages/hindi.json";
import tamil from "./languages/tamil.json";

/**
 * Initializes i18next with the specified configuration.
 * @param {string} lng - The language code to use.
 * @param {object} resources - The translation resources for different languages.
 * @returns {void}
 */
i18next.use(initReactI18next).init({
  lng: "en",
  resources: {
    en: {
      translation: english,
    },
    hi: {
      translation: hindi,
    },
    tam: {
      translation: tamil,
    },
  },
});

/**
 * Context for internationalization (i18n).
 * @property {string} lang - The current language.
 * @property {Function} t - The translation function.
 */
export const I18nContext = createContext({
  lang: "en",
  t: i18next.t.bind(i18next),
});

/**
 * Provides the i18n context to the specified component.
 * @param {object} props - The component props.
 * @returns {JSX.Element} The component JSX.
 */
export const useTranslation = () => {
  const { lang, t } = useContext(I18nContext);
  return { lang, t };
};

/**
 * Provides the i18n context to the specified component.
 * @param {object} props - The component props.
 * @returns {JSX.Element} The component JSX.
 */
export const setLanguage = (lang: string) => {
  i18next.changeLanguage(lang);
};
