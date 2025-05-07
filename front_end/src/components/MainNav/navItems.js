import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import PeopleAlt from '@mui/icons-material/PeopleAlt';

const navItems = [{ text: 'Home', path: '/', icon: <HouseOutlinedIcon/> },
    { text: 'Projects', path: '/project', icon: <MenuBookOutlinedIcon /> },
    { text: 'Resources', path: '/resources', icon: <PeopleAlt /> },
    { text: 'Reports', path: '/reports', icon: <MenuBookOutlinedIcon /> },
    { text: 'Configuration', path: '/config', icon: <AccountTreeOutlinedIcon /> }
    ];
const accountItems = [{ text: 'Profile', path: 'profile' }, { text: 'My Account', path: 'account' }, { text: 'About/Contact', path: 'about' }, { text: 'Logout', path: 'login' }];

export {navItems, accountItems};