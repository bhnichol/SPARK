import { Button } from "@mui/material";
import { useState } from "react";

const Employees = () => {
  return (
    <div className="h-[50px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)]"></div>
  )
}

const Nonlabor = () => {

}

const Organizations = () => {

}

const Resources = () => {
  const [screenState, setScreenState] = useState("emp");
  return (
    <div className="m-[10px] space-y-[10px]">
      <div className="h-[50px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)]">
        <div className="flex justify-end space-x-[20px] items-center h-full pr-[10px]">
          <Button variant="contained" sx={{ border: screenState === "emp" ? "solid 1px" : ""}} onClick={() => { setScreenState("emp") }}>Employees</Button>
          <Button variant="contained" sx={{ border: screenState === "org" ? "solid 1px" : ""}} onClick={() => { setScreenState("org") }}>Organization</Button>
          <Button variant="contained" sx={{ border: screenState === "nonlabor" ? "solid 1px" : ""}} onClick={() => { setScreenState("nonlabor") }}>Non-Labor</Button>
        </div>
      </div>
      {screenState === "emp" ?
        <Employees />
        : screenState === "nonlabor" ?
          <Nonlabor />
          :
          <Organizations />}
    </div>
  )
}
export default Resources;