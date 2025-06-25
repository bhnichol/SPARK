import { styled, TextField } from "@mui/material";


const TextFieldStyled = styled(TextField)(({theme}) => ({
    '& .MuiInputLabel-root': {
        color: theme.palette.primary.contrastText, 
      },
      '& .MuiInputBase-input': {
        color: theme.palette.primary.contrastText, 
      },
      '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.background.contrastBg, 
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.background.boxOutline, 
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.background.boxOutline,
        },
      },
       '&.Mui-disabled': {
        color: 'primary.contrastText', 
      },
}))

export default TextFieldStyled;