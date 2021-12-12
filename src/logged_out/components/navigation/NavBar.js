import React, { memo, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Hidden,
  IconButton,
  withStyles,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  ListItemIcon,
  Divider,
  Grid
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import NavigationDrawer from "../../../shared/components/NavigationDrawer";
import sharedMenuItems from "../../../config/sharedMenuItems";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { AuthContext } from "../../../context/AuthContext";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import MessagePopperButton from "./MessagePopperButton";
import useRecentChat from "../../../hooks/chat/useRecentChat";
import PersonIcon from "@material-ui/icons/Person";

const styles = (theme) => ({
  appBar: {
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.common.white
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between"
  },
  menuButtonText: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.h6.fontWeight
  },
  brandText: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400
  },
  noDecoration: {
    textDecoration: "none !important"
  },
  avatar: {
    width: 32,
    height: 32,
    marginLeft: -0.5,
    marginRight: 1
  }
});

function NavBar(props) {
  const {
    classes,
    openRegisterDialog,
    openLoginDialog,
    handleMobileDrawerOpen,
    handleMobileDrawerClose,
    mobileDrawerOpen,
    selectedTab
  } = props;

  const history = useHistory();

  const { token, user } = useContext(AuthContext);

  const [recentMessages, setRecentMessages] = useState([]);

  const { data, isSuccess: recentMessagesLoaded } = useRecentChat();

  useEffect(() => {
    if (recentMessagesLoaded && data?.length > 0) {
      setRecentMessages(data);
    }
  }, [data, recentMessagesLoaded]);

  function DisplayMenuItem({ item }) {
    if (item.link) {
      return (
        <Link
          key={item.name}
          to={item.link}
          className={classes.noDecoration}
          onClick={handleMobileDrawerClose}
        >
          <Button
            color="secondary"
            size="large"
            classes={{ text: classes.menuButtonText }}
          >
            {item.name}
          </Button>
        </Link>
      );
    }
    return (
      <Button
        color="secondary"
        size="large"
        onClick={item.onClick}
        classes={{ text: classes.menuButtonText }}
        key={item.name}
      >
        {item.name}
      </Button>
    );
  }

  function DisplayProfileMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
            <Avatar src={user?.profile_image?.image_thumbnail_url} />
            <KeyboardArrowDownIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          style={{
            marginTop: 40,
            marginLeft: -30,
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))"
          }}
          PaperProps={{
            elevation: 0
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Typography variant="h6" style={{ marginLeft: 10 }}>
            {user?.name}
          </Typography>
          <Divider style={{ marginBottom: 10 }} />
          {/* <MenuItem>
            <ListItemIcon>
              <PersonAddIcon fontSize="small" />
            </ListItemIcon>
            Add another account
          </MenuItem> */}
          <MenuItem
            onClick={() => {
              history.push("/user/user_profile");
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              history.push("/user/worker_profile");
            }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Worker Profile
          </MenuItem>
          <Link to="/logout" className={classes.noDecoration}>
            <MenuItem>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body1" color="textPrimary">
                Logout
              </Typography>
            </MenuItem>
          </Link>
        </Menu>
      </>
    );
  }

  function DisplayDropdownMenuItem({ item }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <Button
          id="demo-customized-button"
          aria-controls="demo-customized-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          //variant="contained"
          disableElevation
          onClick={handleClick}
          color="secondary"
        >
          {item.name} <KeyboardArrowDownIcon />
        </Button>
        <Menu
          MenuListProps={{
            "aria-labelledby": "demo-customized-button"
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          style={{
            marginTop: 40
          }}
        >
          {item?.dropdownItems?.map((dropdownItem) => (
            //return <DisplayMenuItem item={dropdownItem} />;
            <MenuItem onClick={handleClose} disableRipple>
              <Link
                key={dropdownItem.name}
                to={dropdownItem.link}
                className={classes.noDecoration}
                //onClick={handleMobileDrawerClose}
              >
                {dropdownItem.name}
              </Link>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  let menuItems = null;
  let leftSideItems = null;

  const authButtons = [
    {
      name: "Register",
      onClick: openRegisterDialog,
      icon: <HowToRegIcon className="text-white" />
    },
    {
      name: "Login",
      onClick: openLoginDialog,
      icon: <LockOpenIcon className="text-white" />
    }
  ];

  const loggedInMenuItems = [
    {
      name: "Dashboard",
      link: "/user/dashboard",
      icon: <DashboardIcon className="text-white" />
    },
    {
      name: "Logout",
      link: "/logout"
    }
  ];

  const dropdownMenuItems = [
    {
      name: "Buying Zone",
      dropdown: true,
      dropdownItems: [
        {
          name: "Create Job",
          link: "/user/jobs_posted/create"
        },
        {
          name: "Jobs Posted",
          link: "/user/jobs_posted"
        },
        {
          name: "Buying Orders",
          link: "/user/buying_orders"
        }
      ]
    },
    {
      name: "Selling Zone",
      dropdown: true,
      dropdownItems: [
        {
          name: "Bids Posted",
          link: "/user/bids"
        },
        {
          name: "Selling Orders",
          link: "/user/selling_orders"
        }
      ]
    }
  ];

  if (!token) {
    menuItems = sharedMenuItems.concat(authButtons);
    leftSideItems = authButtons;
  } else {
    menuItems = sharedMenuItems.concat(loggedInMenuItems);
    leftSideItems = loggedInMenuItems;
  }

  return (
    <div className={classes.root}>
      <>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <div>
              <Typography
                variant="h4"
                className={classes.brandText}
                display="inline"
                color="primary"
              >
                Mazdoor
              </Typography>
              <Typography
                variant="h4"
                className={classes.brandText}
                display="inline"
                color="secondary"
              >
                Bulao
              </Typography>
            </div>
            <div>
              <Hidden smDown>
                {sharedMenuItems?.map((item) => {
                  return <DisplayMenuItem item={item} />;
                })}
              </Hidden>
              {token && (
                <Hidden smDown>
                  {dropdownMenuItems?.map((item) => {
                    return <DisplayDropdownMenuItem item={item} />;
                  })}
                </Hidden>
              )}
            </div>
            <div>
              <Hidden mdUp>
                <IconButton
                  className={classes.menuButton}
                  onClick={handleMobileDrawerOpen}
                  aria-label="Open Navigation"
                >
                  <MenuIcon color="primary" />
                </IconButton>
              </Hidden>

              {token ? (
                <Hidden smDown>
                  <Grid container spacing={2}>
                    <Grid item>
                      <MessagePopperButton messages={recentMessages} />
                    </Grid>
                    <Grid item>
                      <DisplayProfileMenu />
                    </Grid>
                  </Grid>
                </Hidden>
              ) : (
                <Hidden smDown>
                  {leftSideItems?.map((item) => {
                    return <DisplayMenuItem item={item} />;
                  })}
                </Hidden>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <NavigationDrawer
          menuItems={menuItems}
          anchor="right"
          open={mobileDrawerOpen}
          selectedItem={selectedTab}
          onClose={handleMobileDrawerClose}
        />
      </>
    </div>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleMobileDrawerOpen: PropTypes.func,
  handleMobileDrawerClose: PropTypes.func,
  mobileDrawerOpen: PropTypes.bool,
  selectedTab: PropTypes.string,
  openRegisterDialog: PropTypes.func.isRequired,
  openLoginDialog: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(memo(NavBar));
