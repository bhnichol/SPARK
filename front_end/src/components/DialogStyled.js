import { Dialog, styled } from "@mui/material";

const DialogStyled = styled(Dialog)(({theme}) => ({
'& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.default,
     maxWidth: 'none',
     [theme.breakpoints.up('sm')]: {
      width: '70%',
    },
    [theme.breakpoints.up('md')]: {
      width: '60%', // increase to test
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%', // increase here too
    },
}

}));

export default DialogStyled;