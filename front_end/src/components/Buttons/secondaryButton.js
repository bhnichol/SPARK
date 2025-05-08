import { Button, styled } from "@mui/material";

const SecondaryButton = styled(Button)(({theme}) => ({
backgroundColor: theme.palette.button.secondary,
'&:hover': {
    backgroundColor: theme.palette.button.secondaryHover
}
}));

export default SecondaryButton;