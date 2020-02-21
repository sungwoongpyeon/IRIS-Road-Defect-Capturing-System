import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import app from '../config/firebase';
import logo from '../assets/logo.png';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  profile: {
    display: 'inline',
  },
  logo:{
    width: 150,
    height: 90
  }
}));

export default function Header() {
  const classes = useStyles();
  const [auth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {

    const menuOption = event.currentTarget.textContent;
    if (menuOption === "Log out") {
      //logout event
      app.auth().signOut();
    } else if (menuOption === "Profile") {
      //profile method goes here
    }

    setAnchorEl(null);
  };

  const GetUserProfile = () => {
    var user = app.auth().currentUser;
    var userEmail;

    if (user != null) {
      user.providerData.forEach(function (profile) {
        userEmail = profile.email;
      });
    }
    return userEmail;
  }

  return (
    <div className={classes.root}>

      <AppBar position="static">
        <Toolbar>
          <div className={classes.title}>
            <img className={classes.logo} src={logo} alt="iris logo"/>
          </div>
          
          {auth && (
            <div>
              {
                <GetUserProfile className={classes.profile}/>
              }
              <IconButton
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
                open={open}
                onClose={handleClose}
              >
                {/* <MenuItem onClick={handleClose}></MenuItem> */}
                <MenuItem onClick={handleClose}>Log out</MenuItem>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}