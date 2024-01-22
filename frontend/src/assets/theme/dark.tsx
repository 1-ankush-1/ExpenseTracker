import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff9800", // Orange
    },
    secondary: {
      main: "#4caf50", // green
    },
    background: {
      default: "#121212", // Dark Gray
    },
  },
});

export default darkTheme;
