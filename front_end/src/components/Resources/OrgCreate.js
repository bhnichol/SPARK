import { Button, darken, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, List, ListItem, MenuItem, styled, Typography } from "@mui/material";
import DialogStyled from "../DialogStyled";
import CloseIcon from '@mui/icons-material/Close';
import SecondaryButton from "../Buttons/secondaryButton";
import TextFieldStyled from "../TextFieldStyled";
import { useRef, useState } from "react";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import API_URL from "../../api/api";
import SelectStyled from "../SelectStyled";

const StyledList = styled(List)(({ theme }) => ({
  maxHeight: '200px',
  minHeight: '200px',
  overflowY: 'auto',
  border: '2px solid ' + theme.palette.background.boxOutline,
  borderRadius: '2px',
  padding: 0,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: darken(theme.palette.background.contrastBg, 0.1),
    cursor: 'pointer',
  },
  backgroundColor: theme.palette.background.contrastBg,
  color: theme.palette.primary.contrastText,
}));

const OrgCreate = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const [errMsg, setErrMsg] = useState("");
  const [emps, setEmps] = useState([]);
  const nameRef = useRef();
  const [empSelect, setEmpSelect] = useState({})
  const [parent, setParent] = useState({});

  const addEmp = () => {

  }

  const removeEmp = (selectedEmp) => {
    if (selectedEmp !== "") {
      setEmps(emps.filter((emp, index) => index !== selectedEmp))
    }
  }

  const submitEmp = async () => {
    setErrMsg('');
    try {
      const response = await axiosPrivate.post(API_URL.EMP_URL,
        JSON.stringify({ employees: emps })
      )

      handleClose();
      props.onSuccess();
    } catch (err) {
      if (!err?.response) { setErrMsg('No Server Response') }
      else if (err.response?.status === 400) {
        setErrMsg('Employee details missing');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized Access');
      }
      else {
        setErrMsg('Employees failed to be created.');
      }
    }
  }

  const handleClose = () => {
    setEmps([]);
    setErrMsg("");
    props.onClose();
  };
  return (
    <DialogStyled open={props.open} onClose={props.onClose} fullWidth>
      <DialogTitle sx={{ color: 'primary.contrastText', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        Create Organization
        <IconButton edge='end' onClick={() => handleClose()}>
          <CloseIcon sx={{ color: 'error.main' }} />
        </IconButton>
      </DialogTitle>
      <div className="grid grid-cols-2 gap-4">
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}>
          <TextFieldStyled slotProps={{ htmlInput: { maxLength: 50 } }} inputRef={nameRef} label="Name" />
          <FormControl>
            <InputLabel sx={{color:"primary.contrastText"}}>Parent Organization</InputLabel>
            <SelectStyled variant="outlined"  value={parent} onChange={(e) => setParent(e.target.value)} label="Parent Organization"><MenuItem  value="Test">Test</MenuItem></SelectStyled>
          </FormControl>
          <FormControl>
            <InputLabel sx={{color:"primary.contrastText"}}>Employee to Add</InputLabel>
            <SelectStyled variant="outlined" value={empSelect} onChange={(e) => setEmpSelect(e.target.value)} label="Employee to Add"/>
          </FormControl>
          <Typography color="error.main">{errMsg}</Typography>
        </DialogContent>
        <DialogContent>
          <StyledList >{emps.map((emp, index) => {
            return (
              <StyledListItem key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div className="max-w-[50%] overflow-hidden text-ellipsis whitespace-nowrap">
                  {emp.EMP_NAME}
                </div>
                <div>
                  ${parseFloat(emp.PAY_RATE).toFixed(2)} / hr
                  <IconButton children={<DeleteOutlinedIcon sx={{ color: "error.main" }} />} onClick={() => removeEmp(index)} />
                </div>
              </StyledListItem>
            )
          })}</StyledList>
        </DialogContent>
      </div>
      <DialogActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: '15px' }}>
        <SecondaryButton variant="contained" onClick={() => addEmp()}>Add Member</SecondaryButton>
        <div className=" flex flex-row gap-[10px]">
          {/* <SecondaryButton variant="contained" disabled={selectedEmp === "" || selectedEmp === null} onClick={() => removeEmp()}>Remove</SecondaryButton> */}
          <Button variant="contained" color="success" onClick={() => submitEmp()}>Submit</Button>
        </div>

      </DialogActions>
    </DialogStyled>
  )
}

export default OrgCreate;