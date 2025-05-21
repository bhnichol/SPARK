import { Button, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import DialogStyled from "./DialogStyled";
import CloseIcon from '@mui/icons-material/Close';

import { useState } from "react";

const ConfirmDelete = (props) => {
  const [errMsg, setErrMsg] = useState("");

  const handleClose = () => {
    setErrMsg("");
    props.onClose();
  };
  return (
    <DialogStyled open={props.open} onClose={props.onClose} fullWidth>
      <DialogTitle sx={{ color: 'primary.contrastText', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        Confirmation:
        <IconButton edge='end' onClick={() => handleClose()}>
          <CloseIcon sx={{ color: 'error.main' }} />
        </IconButton>
      </DialogTitle>
    
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}>
          <Typography color="error.main">{errMsg}</Typography>
          <Typography color="primary.contrastText">Please confirm that you want to delete: {props.target}</Typography>
        </DialogContent>
      <DialogActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: '15px' }}>
            <Button variant="contained" sx={{ bgcolor: 'error.main' }} onClick={() => handleClose()}>Cancel</Button>
          <Button variant="contained" color="success" onClick={() => {props.onSubmit(); handleClose();}}>Submit</Button>
      </DialogActions>
    </DialogStyled>
  )
}

export default ConfirmDelete;