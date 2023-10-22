import React, { useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from '@mui/material/Link';

import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';

import InstrumentSearch from '../components/instrument-search';




const drawerWidth = 240;
const defaultTheme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/viizz29">
          Bijoy Paitandi
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


export default function PageTemplate(props) {
  const [open, setOpen] = React.useState(false);

  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [renderChildren, setRenderChildren] = React.useState(false);
  const [accountInfo, setAccountInfo] = React.useState({});
  
  const theme = useTheme();
  
  useEffect(() => {

    // Component mounted
    //setAuth(true);
    const tkn = localStorage.getItem('token');
    //console.log("token: " + tkn);
    if(tkn)
    {
          
        fetch("/api/account-info", {
          method: 'GET',
          headers: {
            'x-access-token': tkn,
          },
        })
          .then(res => res.json())
          .then(
            (result) => {
              console.log(result);
              if(result.code != 200){
                localStorage.removeItem('token');
                localStorage.removeItem('data');
              }
              else{
                result.token = tkn;
                setAccountInfo(result.data);
                localStorage.setItem('data', JSON.stringify(result.data));
                setAuth(true);
                setRenderChildren(true);
              }
              
            },
            (error) => {
              console.log(error);
            }
          )
    }
    else
    {
      setRenderChildren(true);
    }

    return () => {
      
      // Component unmounted
    
    };
  }, []);
    
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    window.open("/", "_self");
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}
          onClick={() => (window.open("/", "_self"))}
          >
            {process.env.REACT_APP_NAME}
          </Typography>

          {auth && <InstrumentSearch/>}

          {!auth && (
            <div><Button color="inherit"
            onClick={() => (window.open("/signup", "_self"))}
            >Signup</Button>
            
          <Button color="inherit"
          onClick={() => (window.open("/login", "_self"))}
          >Login</Button>
          </div>)}
          {auth && (
            <div>
               Welcome, {accountInfo.firstName}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
       
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {auth && (
          <List>
          <ListItem disablePadding onClick={() => (window.open("/", "_self"))}>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon /> 
                  </ListItemIcon>
                  <ListItemText primary='Home' />
                </ListItemButton>
              </ListItem>
              
            <ListItem disablePadding onClick={() => (window.open("/about", "_self"))}>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary='About' />
              </ListItemButton>
            </ListItem>
        </List>
        
        )}
        <Divider />
        
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth={false}
          sx={{
            padding: '10px',
            minWidth: '90vw',
            minHeight: '90vh',
            marginBottom: '1vh',      
          }}
          >

          { renderChildren ?  props.children : "Loading .." }
          
          </Container>
        </ThemeProvider>
        <Copyright/>
      </Main>
    </Box>
  );
}