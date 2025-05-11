import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import SecondaryButton from "../../components/Buttons/secondaryButton";
import DataGridStyled from "../../components/DatagridStyled";
import EmpCreate from '../../components/Resources/EmpCreate';
import { useState } from 'react';



const columns = [
    { field: 'EMP_ID', headerName: 'Employee ID', width: 70 },
    { field: 'EMP_NAME', headerName: 'Name', width: 130 },
    { field: 'PATE_RATE', headerName: 'Pay $/hr', width: 130 },
    {
      field: 'Delete',
      headerName: 'Delete',
      type: 'number',
      width: 90,
    },
  ];
  
  const rows = [
    { EMP_ID: 1, EMP_NAME: 'Snow', PATE_RATE: 'Jon', Delete: 35 },
    { EMP_ID: 2, EMP_NAME: 'Lannister', PATE_RATE: 'Cersei', Delete: 42 },
    { EMP_ID: 3, EMP_NAME: 'Stark', PATE_RATE: 'Arya', Delete: 16 },
  ];

const Employees = () => {
    const [visible,setVisible] = useState(false);
    return (
        <div className='space-y-[10px]'>
            <div className="h-[50px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)]">
                <div className="flex justify-end space-x-[20px] items-center h-full pr-[10px]">
                    <SecondaryButton variant="contained" onClick={() => setVisible(true)}><AddIcon />Create</SecondaryButton>
                    <SecondaryButton variant="contained"><FileDownloadIcon />Export</SecondaryButton>
                    <div className="text-white" >1/30 <PeopleAlt sx={{ color: "white" }} /></div>
                </div>
            </div>
            <DataGridStyled
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.EMP_ID}
            />
            <EmpCreate open={visible} onClose={() => setVisible(false)} />
        </div>
    )
}

export default Employees;