import { Button, darken, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, styled, Typography } from "@mui/material";
import DialogStyled from "../DialogStyled";
import CloseIcon from '@mui/icons-material/Close';
import SecondaryButton from "../Buttons/secondaryButton";
import TextFieldStyled from "../TextFieldStyled";
import { useRef, useState } from "react";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useDispatch } from "react-redux";
import { createEmployee } from "../../redux/features/empSlice";

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

const EmpCreate = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [emps, setEmps] = useState([]);
  const nameRef = useRef();
  const orgRef = useRef();
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

  const removeEmp = (selectedEmp) => {
    if (selectedEmp !== "") {
      setEmps(emps.filter((emp, index) => index !== selectedEmp))
    }
  }

  const submitEmp = async () => {
    setErrMsg('');
    try {
        await dispatch(createEmployee({empData: emps, axios: axiosPrivate})).unwrap()
        handleClose();
    } catch (err) {
      if (!err?.response) { setErrMsg('No Server Response') }
      else if (err.response?.status === 400) {
        setErrMsg('Employee details missing');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized Access');
      }
      else {
        setErrMsg('Employees failed to be created.')
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
        Create Employees
        <IconButton edge='end' onClick={() => handleClose()}>
          <CloseIcon sx={{ color: 'error.main' }} />
        </IconButton>
      </DialogTitle>
      <div className="grid grid-cols-2 gap-4">
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}>
          <TextFieldStyled slotProps={{ htmlInput: { maxLength: 50 } }} inputRef={nameRef} label="Name" />
          <TextFieldStyled inputRef={payRef} type="number" label="Pay Rate ($/hr)" />
          <TextFieldStyled inputRef={orgRef} label="Organization" />
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
        <SecondaryButton variant="contained" onClick={() => addEmp()}>Add</SecondaryButton>
        <div className=" flex flex-row gap-[10px]">
          {/* <SecondaryButton variant="contained" disabled={selectedEmp === "" || selectedEmp === null} onClick={() => removeEmp()}>Remove</SecondaryButton> */}
          <Button variant="contained" color="success" onClick={() => submitEmp()}>Submit</Button>
        </div>

      </DialogActions>
    </DialogStyled>
  )
}

export default EmpCreate;