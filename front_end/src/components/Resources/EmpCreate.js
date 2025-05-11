import { Button, darken, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, styled, Typography } from "@mui/material";
import DialogStyled from "../DialogStyled";
import CloseIcon from '@mui/icons-material/Close';
import SecondaryButton from "../Buttons/secondaryButton";
import TextFieldStyled from "../TextFieldStyled";
import { useRef, useState } from "react";

const StyledList = styled(List)(({ theme }) => ({
  maxHeight: '200px',
  minHeight: '200px',
  overflowY: 'auto',
  border: '2px solid ' + theme.palette.background.boxOutline,
  borderRadius: '2px',
  padding: 0,
}));

const StyledListItem = styled(ListItem)(({ theme, isSelected }) => ({
  '&:hover': {
    backgroundColor: isSelected ? darken(theme.palette.primary.main, 0.1) : darken(theme.palette.background.contrastBg, 0.1),
    cursor: 'pointer',
  },
  backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.background.contrastBg,
  color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.contrastText,
}));

const EmpCreate = (props) => {
  const [errMsg, setErrMsg] = useState("");
  const [emps, setEmps] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const nameRef = useRef();
  const payRef = useRef();
  const addEmp = () => {
    if (nameRef.current.value !== "" && payRef.current.value !== "") {
      setEmps([...emps, { EMP_NAME: nameRef.current.value, PAY_RATE: payRef.current.value }])
      nameRef.current.value = '';
      payRef.current.value = '';
      setErrMsg("");
    }
    else {
      setErrMsg("Please fill in all fields");
    }
  }

  const removeEmp = () => {
    if (selectedEmp !== "") {
      setEmps(emps.filter((emp, index) => index !== selectedEmp))
      setSelectedEmp("");
    }
  }

  const submitEmp = () => {

  }

  const handleClose = () => {
    setEmps([]);
    setErrMsg("");
    setSelectedEmp("");
    props.onClose();
  };
  return (
    <DialogStyled open={props.open} onClose={props.onClose} fullWidth>
      <DialogTitle sx={{ color: 'primary.contrastText', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        Create Employees
        <IconButton edge='end' onClick={() => handleClose()}>
          <CloseIcon sx={{ color: 'error.main' }} />
        </IconButton>
      </DialogTitle>
      <div className="grid grid-cols-2 gap-4">
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}>
          <TextFieldStyled slotProps = { {htmlInput:{ maxLength: 50 }}} inputRef={nameRef} label="Name" sx={{ color: 'primary.contrastText' }} />
          <TextFieldStyled inputRef={payRef} type="number" label="Pay Rate ($/hr)" />
          <Typography color="error.main">{errMsg}</Typography>
        </DialogContent>
        <DialogContent>
          <StyledList >{emps.map((emp, index) => {
            return (
              <StyledListItem sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} isSelected={index === selectedEmp} onClick={() => { selectedEmp === index ? setSelectedEmp("") : setSelectedEmp(index) }}>
                <div>
                  {emp.EMP_NAME}
                </div>
                <div>
                  ${parseFloat(emp.PAY_RATE).toFixed(2)} / hr
                </div>
              </StyledListItem>
            )
          })}</StyledList>
        </DialogContent>
      </div>
      <DialogActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: '15px' }}>
        <SecondaryButton variant="contained" onClick={() => addEmp()}>Add</SecondaryButton>
        <div className=" flex flex-row gap-[10px]">
          <SecondaryButton variant="contained" disabled={selectedEmp === "" || selectedEmp === null} onClick={() => removeEmp()}>Remove</SecondaryButton>
          <Button variant="contained" color="success" onClick={() => submitEmp()}>Submit</Button>
        </div>

      </DialogActions>
    </DialogStyled>
  )
}

export default EmpCreate;