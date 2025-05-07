import { useTheme } from '@mui/material/styles';

const ThemedWrapper = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        '--mui-primary': theme.palette.primary.main,
        '--mui-primary-contrast': theme.palette.primary.contrastText,
        '--mui-hover': theme.palette.action.hover,
        '--mui-background-default': theme.palette.background.default,
        '--mui-background-contrast': theme.palette.background.contrastBg,
        '--mui-background-outline': theme.palette.background.boxOutline
      }}
    >
      {children}
    </div>
  );
  
}
export default ThemedWrapper;