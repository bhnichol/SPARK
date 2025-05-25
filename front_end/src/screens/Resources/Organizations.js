import SecondaryButton from "../../components/Buttons/secondaryButton";
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { useEffect, useState } from "react";
import OrgCreate from "../../components/Resources/OrgCreate";
import { Autocomplete, Typography } from "@mui/material";
import TextFieldStyled from "../../components/TextFieldStyled";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import API_URL from "../../api/api";

const Organizations = () => {
  const [visible, setVisible] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [emps, setEmps] = useState([]);
  const [success, setSuccess] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const axiosPrivate = useAxiosPrivate();

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
  }, [success]);

  return (
    <div className="flex flex-col flex-1 overflow-auto space-y-[10px]">
      <div className="h-[70px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)] flex  justify-between">
        <div className="flex items-center justify-end space-x-[20px] pl-[10px]">
            <Autocomplete
              options={[...orgs, {ORG_ID: null, ORG_NAME: "Unassigned"}]}
              getOptionLabel={(option) => option.ORG_NAME}
              onChange={(event, newValue) => setSelectedOrg(newValue)}
              popupIcon={<ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />}

              sx={{width:"200px"}}
              renderInput={(params) => (
                <TextFieldStyled
                  {...params}
                  label="Organizations"
                  variant="outlined"
                  sx={{width:"200px", }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.ORG_ID === value.ORG_ID}
            />

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
      
      {selectedOrg === null ?
        <Typography>No Organization Selected</Typography> :
        <></>
      }
      <OrgCreate
        open={visible}
        onClose={() => setVisible(false)}
        onSuccess={() => setSuccess(true)}
        orgs={orgs}
        emps={emps}
      />
    </div>
  );
};

export default Organizations;
