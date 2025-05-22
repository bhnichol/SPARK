import { styled, Select, darken } from "@mui/material";


const SelectStyled = styled(Select)(({ theme }) => ({
    backgroundColor: theme.palette.background.contrastBg,
    color: theme.palette.primary.contrastText,
    '& .MuiSelect-icon': {
        color: theme.palette.primary.contrastText,
    },
    '&:hover': {
        backgroundColor: darken(theme.palette.background.contrastBg, 0.1),
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.background.boxOutline,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.background.boxOutline,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.background.boxOutline,
    },
}))

export default SelectStyled;