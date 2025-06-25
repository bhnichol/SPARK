import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchDropdown from "../../components/SearchDropdown";
import SecondaryButton from "../../components/Buttons/secondaryButton";
import TextFieldStyled from "../../components/TextFieldStyled";

const ProjectCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [groups, setGroups] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
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
      <Accordion sx={{ backgroundColor: 'background.default', border: `1px solid ${theme.palette.background.contrastBg}` }} defaultExpanded>
        <AccordionSummary  expandIcon={<ExpandMoreIcon sx={{ color: 'primary.contrastText' }} />}>
      <div className="m-[10px] p-[20px]">
        <Typography fontSize={20} sx={{ color: "primary.contrastText" }}>Project Team</Typography>
      </div>
      </AccordionSummary>
      <AccordionDetails>

      </AccordionDetails>
      </Accordion>

    </div>
  )
}
export default ProjectCreate;