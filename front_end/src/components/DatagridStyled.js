import { styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const DataGridStyled = styled(DataGrid)(({theme}) => ({
    '& .MuiDataGrid-cell': {
    color: theme.palette.primary.contrastText,
  },
  '& .MuiDataGrid-columnHeader': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.background.contrastBg
  },
  backgroundColor: theme.palette.background.contrastBg,
  '& .MuiDataGrid-footerContainer': {
    color: theme.palette.primary.contrastText, 
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.background.contrastBg , 
  },
  '& .MuiDataGrid-columnHeaders div[role="row"]': {
    backgroundColor: theme.palette.background.contrastBg
 },
 '& .MuiTablePagination-root': {
  color: theme.palette.primary.contrastText, 
},
'& .MuiSelect-select': {
  color: theme.palette.primary.contrastText, 
},
'& .MuiSvgIcon-root': {
  color: theme.palette.primary.contrastText, 
},
  border: '2px solid ' + theme.palette.background.boxOutline,
  borderRadius: 2,
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
}));

export default DataGridStyled;