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
import ConfirmDelete from '../../components/ConfirmDelete';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, deleteEmployee } from '../../redux/features/empSlice';







const Employees = () => {
    const [visible, setVisible] = useState(false);
    const emps = useSelector((state) => state.employees.list);
    const [errMsg, setErrMsg] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const [success, setSuccess] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [empDelete, setEmpDelete] = useState({});
    const dispatch = useDispatch();
    const theme = useTheme();
    const columns = [
        { field: 'EMP_ID', headerName: 'Employee ID', flex: 1, },
        { field: 'EMP_NAME', headerName: 'Name', flex: 2 },
        { field: 'PAY_RATE', headerName: 'Pay $/hr', flex: 2, renderCell: (params) => (<div>${parseFloat(params.row.PAY_RATE).toFixed(2)}</div>) },
        {
            field: 'Delete',
            headerName: 'Delete',
            width: 100,
            renderCell: (params) => { return (<IconButton sx={{ color: 'error.main' }} onClick={() => { setEmpDelete(params.row); setConfirmDelete(true) }}><DeleteOutlinedIcon style={{ color: theme.palette.error.main }} /></IconButton>) }
        }
    ];


    useEffect(() => {
        dispatch(fetchEmployees(axiosPrivate));
        console.log(emps);
    }, [dispatch]);

    const deleteEmp = async () => {
        try {
            setErrMsg("");
            await dispatch(deleteEmployee({ EMP_ID: empDelete.EMP_ID, axios: axiosPrivate })).unwrap();
        }
        catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Failed to delete employee');
            }
        }
    }

    return (
        <div className='space-y-[10px]'>
            <div className="h-[70px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)]">
                <div className="flex justify-end space-x-[20px] items-center h-full pr-[10px]">
                    <SecondaryButton variant="contained" onClick={() => setVisible(true)} disabled={emps.length >= 10}><AddIcon />Create</SecondaryButton>
                    <SecondaryButton variant="contained"><FileDownloadIcon />Export</SecondaryButton>
                    <div className="text-white" >{emps.length}/10 <PeopleAlt sx={{ color: "white" }} /></div>
                </div>
            </div>
            <Typography sx={{ color: "error.main" }}>{errMsg}</Typography>
            <DataGridStyled
                rows={emps}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.EMP_ID}
            />
            <EmpCreate open={visible} onClose={() => setVisible(false)} onSuccess={() => console.log("Created emps")} />
            <ConfirmDelete open={confirmDelete} onClose={() => setConfirmDelete(false)} onSubmit={() => deleteEmp()} target={empDelete.EMP_NAME} />
        </div>
    )
}

export default Employees;