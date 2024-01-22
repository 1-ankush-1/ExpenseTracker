import "./App.css";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import i18next from "i18next";
import { ThemeProvider, Paper } from "@mui/material";
import darkTheme from "./assets/theme/dark";
import lightTheme from "./assets/theme/light";
import { I18nContext } from "./contexts/Translate/translate";
import AppRoutes from "./routes";
import AdditionalFeatures from "./components/features";

const App = () => {
  const [lang, setLang] = useState("en");
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  return (
    <ThemeProvider theme={isDarkModeEnabled ? darkTheme : lightTheme}>
      <I18nContext.Provider value={{ lang, t: i18next.t.bind(i18next) }}>
        <Paper>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <AdditionalFeatures
            language={lang}
            darkMode={isDarkModeEnabled}
            ChangeLanguage={setLang}
            EnabledDarkMode={setIsDarkModeEnabled}
          />
        </Paper>
      </I18nContext.Provider>
    </ThemeProvider>
  );
};

export default App;