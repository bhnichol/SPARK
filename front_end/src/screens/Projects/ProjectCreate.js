import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, darken, IconButton, List, ListItem, styled, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SecondaryButton from "../../components/Buttons/secondaryButton";
import TextFieldStyled from "../../components/TextFieldStyled";
import { useSelector } from "react-redux";
import WbsTree from "../../components/Projects/WbsTree";

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

const ProjectCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [groups, setGroups] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [pdt, setPdt] = useState([]);
  const emps = useSelector((state) => state.employees.list);
  const [emp, setEmp] = useState(null);
  const [position, setPosition] = useState(null);
  const positions = useSelector((state) => state.roles?.list) ?? [];

  const removeEmp = (selectedEmp) => {
    if (selectedEmp !== "") {
      setPdt(pdt.filter((emp, index) => index !== selectedEmp))
    }
  }
  const addEmp = (selectedEmp) => {
    if (selectedEmp) {
      setPdt([...pdt, selectedEmp]);
      setEmp(null);
      setPosition(null);
    }
  }
  return (
    <div className="space-y-[10px] flex flex-col h-full">
      <Accordion sx={{ backgroundColor: 'background.default', border: `1px solid ${theme.palette.background.contrastBg}` }} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.contrastText' }} />} >
          <div className="m-[10px] p-[20px]">
            <Typography fontSize={20} sx={{ color: "primary.contrastText" }}>General Information</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="m-[10px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <TextFieldStyled label="Title" variant="outlined" slotProps={{
              inputLabel: {
                shrink: true,
              }
            }}
              className="md:col-span-2 lg:col-span-2"
            />
            <TextFieldStyled label={"Create Date"} value={new Date().toISOString().split('T')[0]} variant="outlined" disabled
              slotProps={{
                inputLabel: {
                  shrink: true,
                  sx: {
                    color: 'white',
                    '&.Mui-disabled': {
                      color: 'white',
                    },
                  },
                },
              }}
            />
            <Autocomplete
              options={[...groups, "Test", "Demo"]}
              getOptionLabel={(option) => option}
              popupIcon={<ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />}

              renderInput={(params) => (
                <TextFieldStyled
                  {...params}
                  label="Group"
                  variant="outlined"

                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
            />
            <Autocomplete
              options={[...subtypes, "Test", "Demo"]}
              getOptionLabel={(option) => option}
              popupIcon={<ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />}

              renderInput={(params) => (
                <TextFieldStyled
                  {...params}
                  label="Subtype"
                  variant="outlined"

                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
            />
            <TextFieldStyled label="Start Date" variant="outlined" type="date"
              slotProps={{
                inputLabel: {
                  shrink: true,
                }
              }} />
            <TextFieldStyled
              label="General Notes"
              variant="outlined"
              multiline
              minRows={4}
              className="md:col-span-2 lg:col-span-3"
            />
          </div>
        </AccordionDetails>
      </Accordion>


      {/* Project Team Section */}
      <Accordion sx={{ backgroundColor: 'background.default', border: `1px solid ${theme.palette.background.contrastBg}` }} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.contrastText' }} />}>
          <div className="m-[10px] p-[20px]">
            <Typography fontSize={20} sx={{ color: "primary.contrastText" }}>Project Team</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="m-[10px] grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-[10px]">
              <Autocomplete
                options={(Array.isArray(emps) ? emps : []).filter(emp => !pdt.some(a => a.EMP_ID === emp.EMP_ID))}
                getOptionLabel={(option) => option.EMP_NAME}
                popupIcon={<ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />}
                onChange={(event, newValue) => setEmp(newValue)}
                value={emp}
                renderInput={(params) => (
                  <TextFieldStyled
                    {...params}
                    label="Member to Add"
                    variant="outlined"
                  />
                )}
                isOptionEqualToValue={(option, value) => option.EMP_ID === value.EMP_ID}
              />
              <Autocomplete
                options={(Array.isArray(positions) ? [...positions, { TITLE: "Project Manager", POS_ID: -1 }, { TITLE: "Technical Lead", POS_ID: -2 }] : [])}
                getOptionLabel={(option) => option.TITLE}
                onChange={(event, newValue) => setPosition(newValue)}
                popupIcon={<ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />}
                value={position}
                renderInput={(params) => (
                  <TextFieldStyled
                    {...params}
                    label="Position/Role"
                    variant="outlined"
                  />
                )}
                isOptionEqualToValue={(option, value) => option.TITLE === value.TITLE}
              />
              <SecondaryButton variant="contained" onClick={() => addEmp({ ...emp, ...position })}>Add</SecondaryButton>
            </div>
            <div>
              <StyledList >{pdt.map((emp, index) => {
                return (
                  <StyledListItem key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div className="max-w-[50%] overflow-hidden text-ellipsis whitespace-nowrap">
                      {emp.EMP_NAME}
                    </div>
                    <div>
                      {emp.TITLE}
                      <IconButton children={<DeleteOutlinedIcon sx={{ color: "error.main" }} />} onClick={() => removeEmp(index)} />
                    </div>
                  </StyledListItem>
                )
              })}</StyledList>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* WBS */}

      <Accordion sx={{ backgroundColor: 'background.default', border: `1px solid ${theme.palette.background.contrastBg}` }} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.contrastText' }} />}>
          <div className="m-[10px] p-[20px]">
            <Typography fontSize={20} sx={{ color: "primary.contrastText" }}>Work Breakdown Structure</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <WbsTree/>
        </AccordionDetails>
      </Accordion>

    </div>
  )
}
export default ProjectCreate;