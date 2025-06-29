import { Autocomplete, Button, darken, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, styled, Tooltip, Typography } from "@mui/material";
import DialogStyled from "../DialogStyled";
import CloseIcon from '@mui/icons-material/Close';
import SecondaryButton from "../Buttons/secondaryButton";
import TextFieldStyled from "../TextFieldStyled";
import { useEffect, useState } from "react";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ConfirmDelete from "../ConfirmDelete";
import { useDispatch } from "react-redux";
import { editOrg, deleteOrg as deleteOrgThunk } from "../../redux/features/orgSlice";

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

const OrgEdit = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [emps, setEmps] = useState([]);
  const [name, setName] = useState(null);
  const [empSelect, setEmpSelect] = useState(null)
  const [parent, setParent] = useState(null);
  const [empInputValue, setEmpInputValue] = useState("");
  const [parentInputValue, setParentInputValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);


  useEffect(() => {
    if (props.org) {
      setName(props.org.ORG_NAME);
      setParent(props.orgs.find(org => Number(org.ORG_ID) === Number(props.org.PARENT_ORG)) ?? null);
      setEmps((Array.isArray(props.emps) ? props.emps : []).filter(emp =>  Number(emp.ORG_ID) === Number(props.org.ORG_ID)));
    }
   
  }, [props.org, props.emps, props.open]);

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
    if (name === null || name === "") {
      setErrMsg('Please add a name');
    }
    else {
      try {
        await dispatch(editOrg({ employees: emps, ORG_NAME: name, PARENT_ORG: parent?.ORG_ID || null, orgid: props.org.ORG_ID ?? null, axios: axiosPrivate })).unwrap();

        handleClose();
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

  const deleteOrg = async () => {
    setErrMsg('');
     if (!props.org) {
      setErrMsg('Please select a organization');
    }
    else {
      try {
        await dispatch(deleteOrgThunk({orgid:props.org.ORG_ID, axios: axiosPrivate})).unwrap();

        handleClose();
      } catch (err) {
        console.log(err);
        if (!err?.response) { setErrMsg('No Server Response') }
        else if (err.response?.status === 400) {
          setErrMsg('Org details missing');
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized Access');
        }
        else {
          setErrMsg('Org failed to be deleted.');
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
        Edit Organization: {props.org?.ORG_NAME}
        <IconButton edge='end' onClick={() => handleClose()}>
          <CloseIcon sx={{ color: 'error.main' }} />
        </IconButton>
      </DialogTitle>
      <div className="grid grid-cols-2 gap-4">
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}>
          <TextFieldStyled slotProps={{ htmlInput: { maxLength: 50 } }} value={name} onChange={(e) => setName(e.target.value)} label="Name" />
          <Autocomplete
            options={(Array.isArray(props.orgs) ? props.orgs : []).filter(org => org.PARENT_ORG !== props.org?.PARENT_ORG ?? null)}
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
            options={(Array.isArray(props.emps) ? props.emps : []).filter(emp => !emps.some(a => a.EMP_ID === emp.EMP_ID))}
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
                  {Number(emp.ORG_ID) !== Number(props.org?.ORG_ID ?? null) && emp.ORG_ID !== null ? <Tooltip title={"This person is already in an organization: " + emp.ORG_NAME}><WarningAmberIcon sx={{ color: "warning.main" }} /></Tooltip> : <></>}
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
          <Button variant="contained" sx={{backgroundColor:"error.main"}} onClick={() => setConfirmDelete(true)}>Delete Organization</Button>
          <Button variant="contained" color="success" onClick={() => submitOrg()}>Submit</Button>
        </div>

      </DialogActions>
      <ConfirmDelete open={confirmDelete} onClose={() => setConfirmDelete(false)} onSubmit={() => deleteOrg()} target={props.org?.ORG_NAME ?? ""}/>
    </DialogStyled>
  )
}

export default OrgEdit;