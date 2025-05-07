import { createTheme } from "@mui/material";



export const AppTheme = createTheme({
    palette: {
      primary: {
        main: "#6A1E55",
        contrastText: "#FFFFFF",
      },
      error:{
        main: '#cc0000'
      },
      background: {
        default: "#1A1A1D",
        contrastBg: "#2E2E31",
        boxOutline: "#333A45"
      }
    },
  });