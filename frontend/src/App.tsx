import "./App.css";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import i18next from "i18next";
import { Select, MenuItem, Box, ThemeProvider, Paper } from "@mui/material";
import { I18nContext, setLanguage } from "./contexts/Translate/translate";
import AppRoutes from "./routes";
import darkTheme from "./assets/theme/dark";
import lightTheme from "./assets/theme/light";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const App = () => {
  const [lang, setLang] = useState("en");
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  const handleLangChange = (event: any) => {
    const newLang = event.target.value;
    setLang(newLang);
    setLanguage(newLang);
  };

  const changeTheme = () => setIsDarkModeEnabled(!isDarkModeEnabled);
  console.log(isDarkModeEnabled);

  return (
    <ThemeProvider theme={isDarkModeEnabled ? darkTheme : lightTheme}>
      <Paper>
        <I18nContext.Provider value={{ lang, t: i18next.t.bind(i18next) }}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <Box
            className="selectlanguageBox"
            sx={{
              right: { md: "60px", xs: "20px" },
            }}
          >
            <Select value={lang} onChange={handleLangChange}>
              <MenuItem value="hi">भाषा</MenuItem>
              <MenuItem value="tam">மொழி</MenuItem>
              <MenuItem value="en">LANG</MenuItem>
            </Select>
            <Box className="themeMode">
              {isDarkModeEnabled ? (
                <LightModeIcon onClick={changeTheme} />
              ) : (
                <DarkModeIcon onClick={changeTheme} />
              )}
            </Box>
          </Box>
        </I18nContext.Provider>
      </Paper>
    </ThemeProvider>
  );
};

export default App;
