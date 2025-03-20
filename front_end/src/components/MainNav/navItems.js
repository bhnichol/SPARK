import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';

const navItems = [{ text: 'Home', path: '/', icon: <HouseOutlinedIcon/> },
    { text: 'Products', path: 'plan', icon: <MenuBookOutlinedIcon /> },
    { text: 'Organizations', path: 'course', icon: <PeopleAlt /> },
    { text: 'Reports', path: 'employee', icon: <MenuBookOutlinedIcon /> },
    { text: 'Configuration', path: 'org', icon: <AccountTreeOutlinedIcon /> }
    ];
const accountItems = [{ text: 'Profile', path: 'profile' }, { text: 'My Account', path: 'account' }, { text: 'About/Contact', path: 'about' }, { text: 'Logout', path: 'login' }];

export {navItems, accountItems};