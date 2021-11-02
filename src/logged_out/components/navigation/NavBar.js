import React, { memo, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Hidden,
  IconButton,
  withStyles
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import NavigationDrawer from "../../../shared/components/NavigationDrawer";
import sharedMenuItems from "../../../config/sharedMenuItems";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { AuthContext } from "../../../context/AuthContext";
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

  const { token } = useContext(AuthContext);

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
              <Hidden smDown>
                {sharedMenuItems.map((item) => {
                  return <DisplayMenuItem item={item} />;
                })}
              </Hidden>
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

              <Hidden smDown>
                {leftSideItems.map((item) => {
                  return <DisplayMenuItem item={item} />;
                })}
              </Hidden>
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
