import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SearchDropdown from "../../components/SearchDropdown";
import SecondaryButton from "../../components/Buttons/secondaryButton";

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectSearch, setProjectSearch] = useState([]);
  return (
    <div className="m-[10px] space-y-[10px] flex flex-col h-full">
      <div className="h-[50px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)]">
        <div className="flex justify-end space-x-[20px] items-center h-full pr-[10px]">
          <SearchDropdown options={[{label:"option1" }]} value={selectedProject} onChange={setSelectedProject} />
          <SecondaryButton variant="contained" onClick={() => navigate("/projects/create")} disabled={projectSearch.length>=5 || location.pathname === "/projects/create"}><AddIcon />Create</SecondaryButton>
          <div className="text-white" >{projectSearch.length}/5 <MenuBookOutlinedIcon sx={{ color: "white" }} /></div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
export default Projects;