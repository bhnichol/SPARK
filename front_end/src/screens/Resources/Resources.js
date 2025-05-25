import { Button } from "@mui/material";
import { Outlet, useLocation, useNavigate} from "react-router-dom";

const Resources = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="m-[10px] space-y-[10px] flex flex-col h-full">
      <div className="h-[50px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)]">
        <div className="flex justify-end space-x-[20px] items-center h-full pr-[10px]">
          <Button variant="contained" sx={{ border: location.pathname === "/resources/emp" ? "solid 1px" : ""}} onClick={() => { navigate("/resources/emp") }}>Employees</Button>
          <Button variant="contained" sx={{ border: location.pathname === "/resources/org" ? "solid 1px" : ""}} onClick={() => { navigate("/resources/org") }}>Organization</Button>
          <Button variant="contained" sx={{ border: location.pathname === "/resources/nonlabor" ? "solid 1px" : ""}} onClick={() => { navigate("/resources/nonlabor")  }}>Non-Labor</Button>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
export default Resources;