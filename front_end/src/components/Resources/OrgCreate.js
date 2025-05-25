import { Autocomplete, Button, darken, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, styled, Tooltip, Typography } from "@mui/material";
import DialogStyled from "../DialogStyled";
import CloseIcon from '@mui/icons-material/Close';
import SecondaryButton from "../Buttons/secondaryButton";
import TextFieldStyled from "../TextFieldStyled";
import { useRef, useState } from "react";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import API_URL from "../../api/api";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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
  const [name,setName] = useState("");
  const [empSelect, setEmpSelect] = useState(null)
  const [parent, setParent] = useState(null);
  const [empInputValue, setEmpInputValue] = useState("");
  const [parentInputValue, setParentInputValue] = useState("");

  const addEmp = () => {
    if (empSelect !== null) {
      setEmps([...emps, empSelect]);
      setEmpSelect(null);
      setEmpInputValue("");
      setErrMsg("");
    }
  }

  const removeEmp = (selectedEmp) => {
    if (selectedEmp !== "") {
      setEmps(emps.filter((emp, index) => index !== selectedEmp))
    }
  }

  const submitOrg = async () => {
    setErrMsg('');
    if(name === null || name === "") {
      setErrMsg('Please add a name');
    }
    else {
    try {
      const response = await axiosPrivate.post(API_URL.ORG_URL,
        JSON.stringify({ employees: emps, ORG_NAME: name, PARENT_ORG: parent?.ORG_ID || null})
      )

      handleClose();
      props.onSuccess();
    } catch (err) {
      console.log(err);
      if (!err?.response) { setErrMsg('No Server Response') }
      else if (err.response?.status === 400) {
        setErrMsg('Org details missing');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized Access');
      }
      else {
        setErrMsg('Org failed to be created.');
      }
    }
  }
  }

  const handleClose = () => {
    setEmps([]);
    setErrMsg("");
    setEmpInputValue("");
    setParentInputValue("");
    setEmpSelect(null);
    setParent(null);
    setName("");
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
          <TextFieldStyled slotProps={{ htmlInput: { maxLength: 50 } }} value={name} onChange={(e) => setName(e.target.value)} label="Name" />
          <Autocomplete
            options={props.orgs}
            getOptionLabel={(option) => option.ORG_NAME}
            onChange={(event, newValue) => setParent(newValue)}
            inputValue={parentInputValue}
            onInputChange={(event, newInputValue) => setParentInputValue(newInputValue)}
            popupIcon={<ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />}
            value={parent}
            renderInput={(params) => (
              <TextFieldStyled
                {...params}
                label="Parent Organization"
                variant="outlined"
              />
            )}
            isOptionEqualToValue={(option, value) => option.ORG_ID === value.ORG_ID}
          />
          <Autocomplete
            options={props.emps.filter(emp => !emps.some(a => a.EMP_ID === emp.EMP_ID))}
            getOptionLabel={(option) => option.EMP_NAME}
            onChange={(event, newValue) => setEmpSelect(newValue)}
            inputValue={empInputValue}
            onInputChange={(event, newInputValue) => setEmpInputValue(newInputValue)}
            popupIcon={<ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />}
            value={empSelect}
            renderInput={(params) => (
              <TextFieldStyled
                {...params}
                label="Member to Add"
                variant="outlined"
              />
            )}
            isOptionEqualToValue={(option, value) => option.EMP_NAME === value.EMP_NAME}
          />
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
                  {emp.ORG_ID !== null ? <Tooltip title={"This person is already in an organization: " + emp.ORG_NAME}><WarningAmberIcon sx={{color: "warning.main"}}/></Tooltip> : <></>}
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
          <Button variant="contained" color="success" onClick={() => submitOrg()}>Submit</Button>
        </div>

      </DialogActions>
    </DialogStyled>
  )
}

export default OrgCreate;