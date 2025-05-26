import SecondaryButton from "../../components/Buttons/secondaryButton";
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { useEffect, useState } from "react";
import OrgCreate from "../../components/Resources/OrgCreate";
import { Autocomplete, IconButton, Typography, useTheme } from "@mui/material";
import TextFieldStyled from "../../components/TextFieldStyled";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import API_URL from "../../api/api";
import ConfirmDelete from '../../components/ConfirmDelete';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DataGridStyled from "../../components/DatagridStyled";
import substituteUrlParams from "../../api/util";
import EditIcon from '@mui/icons-material/Edit';
import OrgEdit from "../../components/Resources/OrgEdit";

const Organizations = () => {
  const [visible, setVisible] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [emps, setEmps] = useState([]);
  const [success, setSuccess] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [empDelete, setEmpDelete] = useState({});
  const [editVisible, setEditVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const theme = useTheme();

  const columns = [
    { field: 'EMP_ID', headerName: 'Employee ID', flex: 1, },
    { field: 'EMP_NAME', headerName: 'Name', flex: 2 },
    { field: 'PAY_RATE', headerName: 'Pay $/hr', flex: 2, renderCell: (params) => (<div>${parseFloat(params.row.PAY_RATE).toFixed(2)}</div>) },
    { field: 'ORG_NAME', headerName: 'Organization', flex: 2, renderCell: (params) => (params.row.ORG_NAME || "Unassigned") },
    {
      field: 'Delete',
      headerName: 'Remove',
      width: 100,
      renderCell: (params) => { return (<IconButton sx={{ color: 'error.main' }} onClick={() => { setEmpDelete(params.row); setConfirmDelete(true) }}><DeleteOutlinedIcon style={{ color: theme.palette.error.main }} /></IconButton>) }
    }
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosPrivate.get(API_URL.EMP_URL);
        setEmps(response.data);
      } catch (err) {
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else {
          setErrMsg('Failed to load employees');
        }
      }
    };

    const fetchOrgs = async () => {
      try {
        const response = await axiosPrivate.get(API_URL.ORG_URL);
        setOrgs([...response.data]);
        if (selectedOrg) {
          const match = response.data.find(o => Number(o.ORG_ID) === Number(selectedOrg.ORG_ID));
          setSelectedOrg(match ?? null);
          setInputValue(match?.ORG_NAME ?? "");
        }
      } catch (err) {
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else {
          setErrMsg('Failed to load employees');
        }
      }
    };
    fetchOrgs();
    fetchEmployees();
    setErrMsg("");
    setSuccess(false);
  }, [success]);

  const deleteEmp = async () => {
    try {
      setErrMsg("");
      console.log(substituteUrlParams(API_URL.ORG_MAN_URL.REMOVE, { "id": empDelete.EMP_ID }))
      const response = await axiosPrivate.post(substituteUrlParams(API_URL.ORG_MAN_URL.REMOVE, { "id": empDelete.EMP_ID }));
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else {
        setErrMsg('Failed to remove employee');
      }
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto space-y-[10px]">
      <div className="h-[70px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)] flex  justify-between">
        <div className="flex items-center justify-end space-x-[20px] pl-[10px]">
          <Autocomplete
            options={[...orgs, { ORG_ID: null, ORG_NAME: "Unassigned" }]}
            getOptionLabel={(option) => option.ORG_NAME}
            onChange={(event, newValue) => { setSelectedOrg(newValue); setInputValue(newValue?.ORG_NAME ?? ""); setErrMsg(""); }}
            popupIcon={<ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />}
            inputValue={inputValue}
            value={selectedOrg}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            sx={{ width: "200px" }}
            renderInput={(params) => (
              <TextFieldStyled
                {...params}
                label="Organizations"
                variant="outlined"
                sx={{ width: "200px", }}
              />
            )}
            isOptionEqualToValue={(option, value) => option.ORG_ID === value.ORG_ID}
          />
          <SecondaryButton
            variant="contained"
            onClick={() => setEditVisible(true)}
            disabled={!selectedOrg || selectedOrg?.ORG_ID === null}
          >
            <EditIcon />
            Edit Organization
          </SecondaryButton>
        </div>
        <div className="flex items-center justify-end space-x-[20px] pr-[10px]">
          <SecondaryButton
            variant="contained"
            onClick={() => setVisible(true)}
            disabled={orgs.length >= 5}
          >
            <AddIcon />
            Create
          </SecondaryButton>
          <SecondaryButton variant="contained">
            <FileDownloadIcon />
            Export
          </SecondaryButton>
          <div className="text-white flex items-center space-x-1">
            <span>{orgs.length}/5</span>
            <AccountTreeOutlinedIcon sx={{ color: "white" }} />
          </div>
        </div>
      </div>
      <Typography sx={{ color: "error.main" }}>{errMsg}</Typography>
      {selectedOrg === null || selectedOrg === undefined ?
        <Typography sx={{ color: "primary.contrastText" }}>No Organization Selected</Typography> :
        <DataGridStyled
          rows={(Array.isArray(emps) ? emps : []).filter(emp => { return Number(emp.ORG_ID) === Number(selectedOrg.ORG_ID) })}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.EMP_ID}
        />
      }
      <OrgCreate
        open={visible}
        onClose={() => setVisible(false)}
        onSuccess={() => setSuccess(true)}
        orgs={orgs}
        emps={emps}
      />
      <OrgEdit
        open={editVisible}
        onClose={() => setEditVisible(false)}
        onSuccess={() => setSuccess(true)}
        orgs={orgs}
        emps={emps}
        org={selectedOrg}
      />
      <ConfirmDelete open={confirmDelete} onClose={() => setConfirmDelete(false)} onSubmit={() => deleteEmp().then(setSuccess(true))} target={empDelete.EMP_NAME} />
    </div>
  );
};

export default Organizations;
