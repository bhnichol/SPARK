import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import SearchDropdown from "../../components/SearchDropdown";
import SecondaryButton from "../../components/Buttons/secondaryButton";

const ProjectCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectSearch, setProjectSearch] = useState([]);
  return (

      <div className="h-[50px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)]">
        <div className="flex justify-end space-x-[20px] items-center h-full pr-[10px]">
          
          
        </div>
      </div>

  )
}
export default ProjectCreate;