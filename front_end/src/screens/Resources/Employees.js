import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import SecondaryButton from "../../components/Buttons/secondaryButton";
import { DataGrid } from '@mui/x-data-grid';


const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Stark', firstName: 'Arya', age: 16 },
  ];

const Employees = () => {
    return (
        <div>
            <div className="h-[50px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)]">
                <div className="flex justify-end space-x-[20px] items-center h-full pr-[10px]">
                    <SecondaryButton variant="contained" ><AddIcon />Create</SecondaryButton>
                    <SecondaryButton variant="contained"><FileDownloadIcon />Export</SecondaryButton>
                    <div className="text-white" >1/30 <PeopleAlt sx={{ color: "white" }} /></div>
                </div>
            </div>
            <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
            />
        </div>
    )
}

export default Employees;