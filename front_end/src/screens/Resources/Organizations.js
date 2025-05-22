import SecondaryButton from "../../components/Buttons/secondaryButton";
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { useState } from "react";
import OrgCreate from "../../components/Resources/OrgCreate";

const Organizations = () => {
  const [visible, setVisible] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const [success, setSuccess] = useState(false);
  return (
    <div className='space-y-[10px]'>
      <div className="h-[50px] rounded border border-[2px] border-[var(--mui-background-outline)] bg-[var(--mui-background-contrast)]">
        <div className="flex justify-end space-x-[20px] items-center h-full pr-[10px]">
          <SecondaryButton variant="contained" onClick={() => setVisible(true)} disabled={orgs.length >= 5}><AddIcon />Create</SecondaryButton>
          <SecondaryButton variant="contained"><FileDownloadIcon />Export</SecondaryButton>
          <div className="text-white" >{orgs.length}/5 <AccountTreeOutlinedIcon sx={{ color: "white" }} /></div>
        </div>
      </div>
      <OrgCreate open={visible} onClose={() => setVisible(false)} onSuccess={() => setSuccess(true)}/>
    </div>
  )
}

export default Organizations;