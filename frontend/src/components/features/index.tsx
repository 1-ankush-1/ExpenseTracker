import "../../styles/features/feature.css";
import React from "react";
import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { setLanguage } from "../../contexts/Translate/translate";

interface AdditionalFeaturesProps {
  language: string;
  ChangeLanguage: React.Dispatch<React.SetStateAction<string>>;
  darkMode: boolean;
  EnabledDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdditionalFeatures: React.FC<AdditionalFeaturesProps> = ({
  language,
  ChangeLanguage,
  darkMode,
  EnabledDarkMode,
}) => {
  const handleLangChange = (event: SelectChangeEvent<string>) => {
    const newLang = event.target.value;
    ChangeLanguage(newLang);
    setLanguage(newLang);
  };

  const changeTheme = () => EnabledDarkMode(!darkMode);

  return (
    <Box
      className="selectlanguageBox"
      sx={{
        right: { md: "60px", xs: "20px" },
      }}
    >
      <Select value={language} onChange={handleLangChange}>
        <MenuItem value="hi">भाषा</MenuItem>
        <MenuItem value="tam">மொழி</MenuItem>
        <MenuItem value="en">language</MenuItem>
      </Select>
      <Box className="themeMode">
        {darkMode ? (
          <LightModeIcon onClick={changeTheme} />
        ) : (
          <DarkModeIcon onClick={changeTheme} />
        )}
      </Box>
    </Box>
  );
};

export default AdditionalFeatures;
