import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, darken, IconButton, List, ListItem, styled, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SecondaryButton from "../../components/Buttons/secondaryButton";
import TextFieldStyled from "../../components/TextFieldStyled";
import { useDispatch, useSelector } from "react-redux";
import WbsTree, { countTotalNodes } from "../../components/Projects/WbsTree";
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import { createProject as createProjectThunk } from "../../redux/features/projectSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate"

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
  const theme = useTheme();
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [group, setGroup] = useState(null);
  const [subtype, setSubtype] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [groups, setGroups] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [pdt, setPdt] = useState([]);
  const emps = useSelector((state) => state.employees.list);
  const [emp, setEmp] = useState(null);
  const [position, setPosition] = useState(null);
  const positions = useSelector((state) => state.roles?.list) ?? [];
  const [wbs, setWbs] = useState([{ id: crypto.randomUUID(), title: '', children: [], start_date: "", end_date: "" }]);

  const flatWbs = (items, parentId = null) => {
    const results = [];
    items.forEach((item) => {
      results.push({
        TITLE: item.title, START_DATE: item.start_date, END_DATE: item.end_date, PARENT_WBS: parentId, ID: item.id
      });
      if (item.children && item.children.length > 0) {
        results.push(...flatWbs(item.children, item.id));
      }
    });
    return results;
  }

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

  const createProject = async () => {
    try {
      await dispatch(createProjectThunk({pdt:pdt,wbs:flatWbs(wbs), title:title, notes:notes, group:group?.GROUP_ID ?? null, subtype:subtype?.SUBTYPE_ID ?? null, start_date:startDate, axios:axiosPrivate })).unwrap();
    } catch (err) {
      if (!err?.response) { setErrMsg('No Server Response') }
      else if (err.response?.status === 400) {
        setErrMsg('Project details missing');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized Access');
      }
      else {
        setErrMsg('Project failed to be created.');
      }
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
              },
              htmlInput: { maxLength: 100 }
            }}
              className="md:col-span-2 lg:col-span-2"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
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
              options={[...groups, { TITLE: "Test", GROUP_ID: -1 }, { TITLE: "Demo", GROUP_ID: -2 }]}
              getOptionLabel={(option) => option.TITLE}
              popupIcon={<ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />}
              onChange={(e, v) => setGroup(v)}
              value={group}
              renderInput={(params) => (
                <TextFieldStyled
                  {...params}
                  label="Group"
                  variant="outlined"

                />
              )}
              isOptionEqualToValue={(option, value) => option.GROUP_ID === value.GROUP_ID}
            />
            <Autocomplete
              options={[...subtypes, { TITLE: "Test", SUBTYPE_ID: -1 }, { TITLE: "Demo", SUBTYPE_ID: -2 }]}
              getOptionLabel={(option) => option.TITLE}
              popupIcon={<ArrowDropDownIcon sx={{ color: 'primary.contrastText' }} />}
              onChange={(e, v) => setSubtype(v)}
              value={subtype}
              renderInput={(params) => (
                <TextFieldStyled
                  {...params}
                  label="Subtype"
                  variant="outlined"

                />
              )}
              isOptionEqualToValue={(option, value) => option.SUBTYPE_ID === value.SUBTYPE_ID}
            />
            <TextFieldStyled label="Start Date" variant="outlined" type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                }
              }} />
            <TextFieldStyled
              label="General Notes"
              variant="outlined"
              value={notes}
              onChange={(e) => { setNotes(e.target.value); }}
              multiline
              minRows={4}
              className="md:col-span-2 lg:col-span-3"
              helperText={`${notes?.length ?? 0}/2000 characters`}
              slotProps={{ htmlInput: { maxLength: 2000 } }}
              sx={{
                '& .MuiFormHelperText-root': {
                  color: 'primary.contrastText',
                }
              }}
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
                getOptionLabel={(option) => option.EMP_NAME ?? ""}
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
                options={(Array.isArray(positions) ? [...positions, { TITLE: "Project Manager", POSITION_ID: -1 }, { TITLE: "Technical Lead", POSITION_ID: -2 }] : [])}
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
                isOptionEqualToValue={(option, value) => option.POSITION_ID === value.POSITION_ID}
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
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'primary.contrastText' }} />}
          sx={{
            width: '100%',
            paddingX: 2,               // Optional: Adjust horizontal padding
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography fontSize={20} sx={{ color: "primary.contrastText" }}>
              Work Breakdown Structure
            </Typography>
            <Typography sx={{ color: "primary.contrastText", display: 'flex', alignItems: 'center', gap: 1 }}>
              {countTotalNodes(wbs)}/30 <FormatListNumberedOutlinedIcon />
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <WbsTree wbs={wbs} setWbs={setWbs} />
        </AccordionDetails>
      </Accordion>
      {errMsg !== "" && errMsg && <Typography color="error.main">{errMsg}</Typography>}
      <Button variant="contained" color='success' sx={{ width: "100px", alignSelf: "center" }} onClick={() => createProject()}>Submit</Button>
    </div>
  )
}
export default ProjectCreate;