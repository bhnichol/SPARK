import { createTheme } from "@mui/material";

export const AppTheme = createTheme({
  palette: {
    primary: {
      main: "#6A1E55",
      contrastText: "#FFFFFF",
    },
    error: {
      main: '#cc0000'
    },
    background: {
      default: "#1A1A1D",
      contrastBg: "#2E2E31",
      boxOutline: "#333A45"
    },
    button: {
      secondary: "#3B4252",
      secondaryHover: "#323846"
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active  {
          box-shadow: 0 0 0 1000px #2E2E31 inset !important;
          -webkit-text-fill-color: #FFFFFF !important;
          color: #FFFFFF !important;
          caret-color: #FFFFFF !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `,
    }
  }
});
