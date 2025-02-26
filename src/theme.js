import { createTheme } from "@mui/material/styles";

// ✅ 라이트 테마 (White)
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4CAF50",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
    },
  },
});

// ✅ 다크 테마 (Black)
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4CAF50",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#ffffff",
      secondary: "#BBBBBB",
    },
  },
});

export { lightTheme, darkTheme };
