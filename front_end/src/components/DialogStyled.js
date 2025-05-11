import { Dialog, styled } from "@mui/material";

const DialogStyled = styled(Dialog)(({theme}) => ({
'& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.default,
     width: {
                  xs: '90%',
                  sm: '70%',
                  md: '50%',
                },

}

}));

export default DialogStyled;