import React, { memo, useCallback, useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core";
import Routing from "./Routing";
import smoothScrollTop from "../../shared/functions/smoothScrollTop";
import NavBar from "../../logged_out/components/navigation/NavBar";
import SideBar from "./navigation/SideBar";

const styles = (theme) => ({
  main: {
    marginTop: theme.spacing(12),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    },
    marginLeft: theme.spacing(28)
  }
});

function Main(props) {
  const { classes } = props;
  const [hasFetchedCardChart, setHasFetchedCardChart] = useState(false);

  // const selectDashboard = useCallback(() => {
  //   smoothScrollTop();
  //   document.title = "MazdoorBulao - Dashboard";
  //   setSelectedTab("Dashboard");
  //   if (!hasFetchedCardChart) {
  //     setHasFetchedCardChart(true);
  //     import("../../shared/components/CardChart").then((Component) => {
  //       setCardChart(Component.default);
  //     });
  //   }
  // }, [
  //   setSelectedTab,
  //   setCardChart,
  //   hasFetchedCardChart,
  //   setHasFetchedCardChart
  // ]);

  // const selectJobsPosted = useCallback(() => {
  //   smoothScrollTop();
  //   document.title = "MazdoorBulao - Jobs Posted";
  //   setSelectedTab("JobsPosted");
  // }, [setSelectedTab]);

  return (
    <Fragment>
      <NavBar />
      <SideBar />
      <main className={classNames(classes.main)}>
        <Routing />
      </main>
    </Fragment>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(memo(Main));
