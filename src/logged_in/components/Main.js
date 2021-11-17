import React, { memo, useCallback, useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core";
import Routing from "./Routing";
import NavBar from "./navigation/NavBar";
import ConsecutiveSnackbarMessages from "../../shared/components/ConsecutiveSnackbarMessages";
import smoothScrollTop from "../../shared/functions/smoothScrollTop";
import persons from "../dummy_data/persons";
import LazyLoadAddBalanceDialog from "./subscription/LazyLoadAddBalanceDialog";

const styles = (theme) => ({
  main: {
    marginLeft: theme.spacing(9),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    }
  }
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function Main(props) {
  const { classes } = props;
  const [selectedTab, setSelectedTab] = useState(null);
  const [CardChart, setCardChart] = useState(null);
  const [hasFetchedCardChart, setHasFetchedCardChart] = useState(false);
  const [statistics, setStatistics] = useState({ views: [], profit: [] });
  const [targets, setTargets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAccountActivated, setIsAccountActivated] = useState(false);
  const [isAddBalanceDialogOpen, setIsAddBalanceDialogOpen] = useState(false);
  const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);

  const openAddBalanceDialog = useCallback(() => {
    setIsAddBalanceDialogOpen(true);
  }, [setIsAddBalanceDialogOpen]);

  const closeAddBalanceDialog = useCallback(() => {
    setIsAddBalanceDialogOpen(false);
  }, [setIsAddBalanceDialogOpen]);

  const onPaymentSuccess = useCallback(() => {
    pushMessageToSnackbar({
      text: "Your balance has been updated."
    });
    setIsAddBalanceDialogOpen(false);
  }, [pushMessageToSnackbar, setIsAddBalanceDialogOpen]);

  const fetchRandomStatistics = useCallback(() => {
    const statistics = { profit: [], views: [] };
    const iterations = 300;
    const oneYearSeconds = 60 * 60 * 24 * 365;
    let curProfit = Math.round(3000 + Math.random() * 1000);
    let curViews = Math.round(3000 + Math.random() * 1000);
    let curUnix = Math.round(new Date().getTime() / 1000) - oneYearSeconds;
    for (let i = 0; i < iterations; i += 1) {
      curUnix += Math.round(oneYearSeconds / iterations);
      curProfit += Math.round((Math.random() * 2 - 1) * 10);
      curViews += Math.round((Math.random() * 2 - 1) * 10);
      statistics.profit.push({
        value: curProfit,
        timestamp: curUnix
      });
      statistics.views.push({
        value: curViews,
        timestamp: curUnix
      });
    }
    setStatistics(statistics);
  }, [setStatistics]);

  const fetchRandomMessages = useCallback(() => {
    shuffle(persons);
    const messages = [];
    const iterations = persons.length;
    const oneDaySeconds = 60 * 60 * 24;
    let curUnix = Math.round(
      new Date().getTime() / 1000 - iterations * oneDaySeconds
    );
    for (let i = 0; i < iterations; i += 1) {
      const person = persons[i];
      const message = {
        id: i,
        src: person.src,
        date: curUnix,
        text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr sed."
      };
      curUnix += oneDaySeconds;
      messages.push(message);
    }
    messages.reverse();
    setMessages(messages);
  }, [setMessages]);

  const toggleAccountActivation = useCallback(() => {
    if (pushMessageToSnackbar) {
      if (isAccountActivated) {
        pushMessageToSnackbar({
          text: "Your account is now deactivated."
        });
      } else {
        pushMessageToSnackbar({
          text: "Your account is now activated."
        });
      }
    }
    setIsAccountActivated(!isAccountActivated);
  }, [pushMessageToSnackbar, isAccountActivated, setIsAccountActivated]);

  const selectDashboard = useCallback(() => {
    smoothScrollTop();
    document.title = "WaVer - Dashboard";
    setSelectedTab("Dashboard");
    if (!hasFetchedCardChart) {
      setHasFetchedCardChart(true);
      import("../../shared/components/CardChart").then((Component) => {
        setCardChart(Component.default);
      });
    }
  }, [
    setSelectedTab,
    setCardChart,
    hasFetchedCardChart,
    setHasFetchedCardChart
  ]);

  const selectJobsPosted = useCallback(() => {
    smoothScrollTop();
    document.title = "WaVer - Jobs Posted";
    setSelectedTab("JobsPosted");
  }, [setSelectedTab]);

  const selectBids = useCallback(() => {
    smoothScrollTop();
    document.title = "WaVer - Bids";
    setSelectedTab("Bids");
  }, [setSelectedTab]);

  const selectBuyingOrders = useCallback(() => {
    smoothScrollTop();
    document.title = "WaVer - Buying Orders";
    setSelectedTab("BuyingOrders");
  }, [setSelectedTab]);

  const selectSellingOrders = useCallback(() => {
    smoothScrollTop();
    document.title = "WaVer - Selling Orders";
    setSelectedTab("SellingOrders");
  }, [setSelectedTab]);

  const selectChat = useCallback(() => {
    smoothScrollTop();
    document.title = "WaVer - Chat";
    setSelectedTab("Chat");
  }, [setSelectedTab]);

  const selectWorkerProfile = useCallback(() => {
    smoothScrollTop();
    document.title = "WaVer - Worker Profile";
    setSelectedTab("WorkerProfile");
  }, [setSelectedTab]);

  const getPushMessageFromChild = useCallback(
    (pushMessage) => {
      setPushMessageToSnackbar(() => pushMessage);
    },
    [setPushMessageToSnackbar]
  );

  useEffect(() => {
    fetchRandomStatistics();
    fetchRandomMessages();
  }, [fetchRandomStatistics, fetchRandomMessages]);
  return (
    <Fragment>
      <LazyLoadAddBalanceDialog
        open={isAddBalanceDialogOpen}
        onClose={closeAddBalanceDialog}
        onSuccess={onPaymentSuccess}
      />
      <NavBar
        selectedTab={selectedTab}
        messages={messages}
        openAddBalanceDialog={openAddBalanceDialog}
      />
      <ConsecutiveSnackbarMessages
        getPushMessageFromChild={getPushMessageFromChild}
      />
      <main className={classNames(classes.main)}>
        <Routing
          isAccountActivated={isAccountActivated}
          CardChart={CardChart}
          toggleAccountActivation={toggleAccountActivation}
          pushMessageToSnackbar={pushMessageToSnackbar}
          statistics={statistics}
          targets={targets}
          selectDashboard={selectDashboard}
          selectBids={selectBids}
          selectJobsPosted={selectJobsPosted}
          selectBuyingOrders={selectBuyingOrders}
          selectSellingOrders={selectSellingOrders}
          selectChat={selectChat}
          selectWorkerProfile={selectWorkerProfile}
          openAddBalanceDialog={openAddBalanceDialog}
          setTargets={setTargets}
        />
      </main>
    </Fragment>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(memo(Main));
