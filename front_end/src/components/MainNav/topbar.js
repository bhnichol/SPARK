import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Menu } from '@mui/material';
import useLogout from '../../hooks/useLogout';
import {navItems, accountItems} from './navItems'
import { useState } from 'react';




function TopBar() {

  const [accountOpen, setAccountOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const signOut = async () => {
    await logout();
    navigate('/login')

};
  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  // };
  const handleAccountToggle = (e) => {
    setAccountOpen(!accountOpen);
    setMenuPos(e.currentTarget);
  };

  // const drawer = (
  //   <Box onClick={handleDrawerToggle} sx={{ textalign: 'center' }}>
  //     <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
  //       SPARK
  //     </Typography>
  //     <Divider />
  //     <List>
  //       {navItems.map((item) => (
  //         <ListItem key={item.text} disablePadding sx={{p:'1px',
  //           '&:hover': {
  //           backgroundColor: 'primary.main', // Set hover background to theme primary color
  //           color: 'white', // Change text color on hover
  //         }
  //          }}>
  //           <ListItemButton component={Link} to={item.path}>
  //             {item.icon}
  //             <ListItemText primary={item.text} sx={{ paddingLeft: '10px', pr: '100px'}} />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //   </Box>
  // );

  const BarIcons = () => {
    return (
    <div className='flex flex-row items-center'> 
      { navItems.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <Link to={item.path}>
          <div className={`w-[50px] h-12 flex items-center justify-center text-white rounded hover:bg-[#1A1A1D]
             ${isActive ? 'border-[[var(--mui-primary-contrast)] border text-[var(--mui-primary-contrast)] '  :
                   'bg-[var(--mui-primary)] text-[var(--mui-primary-contrast)]'}
              `}>
          {item.icon}
          </div>
          </Link>
        )
      })
  
      }
    </div>
    )
  }

  const menu = (
    <Box>
      <List>
        {accountItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ '&:hover': {
            backgroundColor: 'primary.main', // Set hover background to theme primary color
            color: 'white', // Change text color on hover
          }
           }}>
            {item.text === 'Logout' ?
              <ListItemButton onClick={signOut}>
                <ListItemText primary={item.text} />
              </ListItemButton> :
              <ListItemButton component={Link} to={item.path}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            }

          </ListItem>
        ))}
      </List>
    </Box>
  );


  return (
    <Box sx={{ display: 'flex', justifyContent:'space-between' }}>
      <CssBaseline />
      <AppBar position="sticky" >
        <Toolbar sx={{ display: 'flex', justifyContent:'space-between' }}>
          <div className='flex h-full items-center'>
          <BarIcons/>
          
          <Typography
            variant="h6"
            component="div"
            sx={{display: {xs: 'none', sm:'none', md:'flex', paddingLeft:'100px'}}}
          >
            SPARK - {location.pathname}
          </Typography>
          </div>
          <IconButton
            color="inherit"
            aria-label="account-menu"
            edge="start"
            onClick={handleAccountToggle}
            textalign="right">
            <Avatar />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        variant='menu'
        id="menu"
        open={accountOpen}
        onClose={handleAccountToggle}
        anchorEl={menuPos}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          '& .MuiMenu-paper': {
            backgroundColor: 'background.default', // Use the theme's background color
            color: 'primary.contrastText'
          },
        }}>
        {menu}

        
      </Menu>
    </Box>
  );
}

export default TopBar;