import React, {
  Fragment,
  useRef,
  useCallback,
  useState,
  useContext
} from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Drawer,
  List,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  Tooltip,
  Box,
  withStyles,
  isWidthUp,
  withWidth,
  Button
} from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import BidsIcon from "@material-ui/icons/AccountTreeTwoTone";
import JobsPostedIcon from "@material-ui/icons/DeckSharp";
import CreateJobIcon from "@material-ui/icons/NewReleasesOutlined";
import ChatIcon from "@material-ui/icons/Chat";
import NavigationDrawer from "../../../shared/components/NavigationDrawer";
import { AuthContext } from "../../../context/AuthContext";
import { Person } from "@material-ui/icons";
import Menu from "@material-ui/icons/Menu";

const styles = (theme) => ({
  drawerPaper: {
    height: "100%vh",
    whiteSpace: "nowrap",
    border: 0,
    width: theme.spacing(30),
    //overflowX: "hidden",
    marginTop: theme.spacing(8),
    // [theme.breakpoints.up("sm")]: {
    //   width: theme.spacing(9)
    // },
    backgroundColor: theme.palette.common.black,
    paddingBottom: 80
  },
  menuLink: {
    textDecoration: "none",
    color: theme.palette.text.primary
  },
  justifyCenter: {
    justifyContent: "center"
  },
  permanentDrawerListItem: {
    justifyContent: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
});

function SideBar(props) {
  const { selectedTab, classes } = props;
  // Will be use to make website more accessible by screen readers
  const links = useRef([]);
  const { user: loggedInUser } = useContext(AuthContext);

  const closeMobileDrawer = () => {};
  const menuItems = [
    // {
    //   link: "/user/dashboard",
    //   name: "Dashboard",
    //   onClick: closeMobileDrawer,
    //   icon: {
    //     desktop: (
    //       <DashboardIcon
    //         className={
    //           selectedTab === "Dashboard" ? classes.textPrimary : "text-white"
    //         }
    //         fontSize="small"
    //       />
    //     ),
    //     mobile: <DashboardIcon className="text-white" />
    //   }
    // },

    {
      link: "/admin/users",
      name: "Users",
      icon: {
        desktop: <Person className="text-white" fontSize="small" />,
        mobile: <Person className="text-white" />
      }
    },
    {
      link: "/admin/job_categories",
      name: "Job Categories",
      icon: {
        desktop: <Menu className="text-white" fontSize="small" />,
        mobile: <Menu className="text-white" />
      }
    },
    {
      link: "/logout",
      name: "Logout",
      icon: {
        desktop: (
          <PowerSettingsNewIcon className="text-white" fontSize="small" />
        ),
        mobile: <PowerSettingsNewIcon className="text-white" />
      }
    }
  ];

  return (
    <Fragment>
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        //open={false}
      >
        <List>
          {menuItems.map((element, index) => (
            <Link
              to={element.link}
              className={classes.menuLink}
              onClick={element.onClick}
              key={index}
              ref={(node) => {
                links.current[index] = node;
              }}
            >
              {/* <Tooltip
                title={element.name}
                placement="right"
                key={element.name}
              > */}
              <ListItem
                selected={selectedTab === element.name}
                button
                divider={index !== menuItems.length - 1}
                className={classes.permanentDrawerListItem}
                onClick={() => {
                  links.current[index].click();
                }}
                aria-label={
                  element.name === "Logout" ? "Logout" : `Go to ${element.name}`
                }
              >
                <ListItemIcon className={classes.justifyCenter}>
                  {element.icon.desktop}
                </ListItemIcon>
                <ListItemText>
                  <Typography style={{ color: "white" }}>
                    {element.name}
                  </Typography>
                </ListItemText>
              </ListItem>
              {/* </Tooltip> */}
            </Link>
          ))}
        </List>
      </Drawer>
    </Fragment>
  );
}

SideBar.propTypes = {
  width: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(SideBar));
