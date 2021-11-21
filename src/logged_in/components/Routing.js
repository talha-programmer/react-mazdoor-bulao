import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import { withStyles } from "@material-ui/core";
import Dashboard from "./dashboard/Dashboard";
import PropsRoute from "../../shared/components/PropsRoute";
import useLocationBlocker from "../../shared/functions/useLocationBlocker";
import CreateJob from "./buyingZone/createJob/CreateJob";
import Bids from "./sellingZone/bids/Bids";
import JobsPosted from "./buyingZone/jobsPosted/JobsPosted";
import usePostedJobs from "../../hooks/user/usePostedJobs";
import JobPostedSingle from "./buyingZone/jobPostedSingle/JobPostedSingle";
import BuyingOrders from "./buyingZone/buyingOrders/BuyingOrders";
import SellingOrders from "./sellingZone/sellingOrders/SellingOrders";
import useBuyingOrders from "../../hooks/orders/useBuyingOrders";
import BuyingOrderSingle from "./buyingZone/buyingOrderSingle/BuyingOrderSingle";
import Chat from "./chat/Chat";
import CreateWorkerProfile from "./sellingZone/workerProfile/CreateWorkerProfile";
import WorkerProfile from "./sellingZone/workerProfile/WorkerProfile";
import BoxCircularProgress from "../../shared/components/BoxCircularProgress";
import CreateUserProfile from "./userProfile/CreateUserProfile";
const styles = (theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    width: "auto",
    [theme.breakpoints.up("xs")]: {
      width: "95%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto"
    },
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto"
    },
    [theme.breakpoints.up("lg")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "90%",
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
});

function Routing(props) {
  const {
    classes,
    pushMessageToSnackbar,
    toggleAccountActivation,
    CardChart,
    statistics,
    targets,
    setTargets,
    isAccountActivated,
    selectDashboard,
    selectJobsPosted,
    selectBids,
    selectBuyingOrders,
    selectSellingOrders,
    selectChat,
    selectWorkerProfile
  } = props;
  useLocationBlocker();

  const [loading, setLoading] = useState(true);

  const {
    data: jobsPosted,
    isLoading: isJobsLoading,
    isError: isJobsError
  } = usePostedJobs();

  const {
    data: buyingOrders,
    isLoading: isOrdersLoading,
    isError: isOrdersError
  } = useBuyingOrders();

  useEffect(() => {
    if (!isJobsLoading && !isOrdersLoading) {
      setLoading(false);
    }
  }, [isJobsLoading, isOrdersLoading]);

  return (
    <div className={classes.wrapper}>
      <Switch>
        {!isOrdersLoading &&
          buyingOrders.map((order) => {
            return (
              <PropsRoute
                path={`/user/buying_orders/${order.url}`}
                component={BuyingOrderSingle}
                key={`${order.url}-buying-order`} // Changed key to became unique
              />
            );
          })}

        <PropsRoute
          path="/user/buying_orders/single_order"
          component={BuyingOrderSingle}
        />

        <PropsRoute
          path="/user/buying_orders"
          component={BuyingOrders}
          selectBuyingOrders={selectBuyingOrders}
        />
        <PropsRoute
          path="/user/selling_orders"
          component={SellingOrders}
          selectSellingOrders={selectSellingOrders}
        />

        {!isJobsLoading &&
          jobsPosted.map((job) => {
            return (
              <PropsRoute
                path={`/user/jobs_posted/${job.url}/edit`}
                component={CreateJob}
                key={`${job.url}-job-edit`} // Changed key to became unique
              />
            );
          })}
        {!isJobsLoading &&
          jobsPosted.map((job) => {
            return (
              <PropsRoute
                path={`/user/jobs_posted/${job.url}`}
                component={JobPostedSingle}
                jobId={job.id}
                title={job.title}
                key={`${job.url}-job-posted`}
              />
            );
          })}

        <PropsRoute path="/user/jobs_posted/create" component={CreateJob} />
        <PropsRoute
          path="/user/jobs_posted"
          component={JobsPosted}
          selectJobsPosted={selectJobsPosted}
        />
        <PropsRoute
          path="/user/bids"
          component={Bids}
          selectBids={selectBids}
        />

        <PropsRoute
          path="/user/chat"
          component={Chat}
          selectChat={selectChat}
        />

        <PropsRoute
          path="/user/create_user_profile"
          component={CreateUserProfile}
        />

        <PropsRoute path="/user/worker_profile" component={WorkerProfile} />
        <PropsRoute
          path="/user/create_worker_profile"
          component={CreateWorkerProfile}
          selectWorkerProfile={selectWorkerProfile}
        />

        <PropsRoute
          path=""
          component={Dashboard}
          toggleAccountActivation={toggleAccountActivation}
          pushMessageToSnackbar={pushMessageToSnackbar}
          CardChart={CardChart}
          statistics={statistics}
          targets={targets}
          setTargets={setTargets}
          isAccountActivated={isAccountActivated}
          selectDashboard={selectDashboard}
        />
      </Switch>
    </div>
  );
}

Routing.propTypes = {
  classes: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  setTargets: PropTypes.func.isRequired,
  toggleAccountActivation: PropTypes.func,
  CardChart: PropTypes.elementType,
  statistics: PropTypes.object.isRequired,
  targets: PropTypes.arrayOf(PropTypes.object).isRequired,
  isAccountActivated: PropTypes.bool.isRequired,
  selectDashboard: PropTypes.func.isRequired,
  selectJobsPosted: PropTypes.func.isRequired,
  selectBids: PropTypes.func.isRequired,
  selectBuyingOrders: PropTypes.func.isRequired,
  selectSellingOrders: PropTypes.func.isRequired,
  selectChat: PropTypes.func.isRequired,
  selectWorkerProfile: PropTypes.func.isRequired,
  openAddBalanceDialog: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(memo(Routing));
