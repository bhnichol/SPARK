import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import SecondaryButton from "../../components/Buttons/secondaryButton";
import DataGridStyled from "../../components/DatagridStyled";
import EmpCreate from '../../components/Resources/EmpCreate';
import { useState } from 'react';
import { useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { IconButton, Typography, useTheme } from '@mui/material';
import API_URL from '../../api/api';
import ConfirmDelete from '../../components/ConfirmDelete';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';







const Employees = () => {
    const [visible, setVisible] = useState(false);
    const [emps, setEmps] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const [success, setSuccess] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [empDelete, setEmpDelete] = useState({});
    const theme = useTheme();
    const columns = [
    { field: 'EMP_ID', headerName: 'Employee ID', flex: 1, },
    { field: 'EMP_NAME', headerName: 'Name', flex: 2 },
    { field: 'PAY_RATE', headerName: 'Pay $/hr', flex: 2, renderCell: (params) => (<div>${parseFloat(params.row.PAY_RATE).toFixed(2)}</div>) },
    {
        field: 'Delete',
        headerName: 'Delete',
        width: 100,
        renderCell: (params) => {return (<IconButton sx={{ color: 'error.main' }} onClick={() => {setEmpDelete(params.row); setConfirmDelete(true)}}><DeleteOutlinedIcon style={{ color: theme.palette.error.main }} /></IconButton>)}}
];

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
        fetchEmployees();
        setSuccess(false);
    }, [success]);

    const deleteEmp = async () => {
            try {
                setErrMsg("");
                const response = await axiosPrivate.delete(API_URL.EMP_URL,
                    {data:{empid:empDelete.EMP_ID}}
                );
                setSuccess(true);
            } catch (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else {
                    setErrMsg('Failed to delete employee');
                }
            }
    }

    return (
        <div className='space-y-[10px]'>
            <div className="h-[50px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)]">
                <div className="flex justify-end space-x-[20px] items-center h-full pr-[10px]">
                    <SecondaryButton variant="contained" onClick={() => setVisible(true)}><AddIcon />Create</SecondaryButton>
                    <SecondaryButton variant="contained"><FileDownloadIcon />Export</SecondaryButton>
                    <div className="text-white" >1/30 <PeopleAlt sx={{ color: "white" }} /></div>
                </div>
            </div>
            <Typography sx={{color: "error.main"}}>{errMsg}</Typography>
            <DataGridStyled
                rows={emps}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.EMP_ID}
            />
            <EmpCreate open={visible} onClose={() => setVisible(false)} onSuccess={() => setSuccess(true)} />
            <ConfirmDelete open={confirmDelete} onClose={() => setConfirmDelete(false)} onSubmit={() => deleteEmp().then(setSuccess(true))} target={empDelete.EMP_NAME}/>
        </div>
    )
}

export default Employees;