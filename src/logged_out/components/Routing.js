import React, { memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import PropsRoute from "../../shared/components/PropsRoute";
import Home from "./home/Home";
//import useLocationBlocker from "../../shared/functions/useLocationBlocker";
import Logout from "../../logged_in/components/logout/Logout";
import Jobs from "../../mixed/components/jobs/Jobs";
import SingleJob from "../../mixed/components/singleJob/SingleJob";

function Routing(props) {
  const { selectHome, selectJobs } = props;
  return (
    <Switch>
      <PropsRoute path={`/jobs/single_job`} component={SingleJob} />
      <PropsRoute exact path="/jobs" component={Jobs} selectJobs={selectJobs} />
      <PropsRoute path="/logout" component={Logout} />
      <PropsRoute path="/" component={Home} selectHome={selectHome} />
    </Switch>
  );
}

Routing.propTypes = {
  blogposts: PropTypes.arrayOf(PropTypes.object),
  selectHome: PropTypes.func.isRequired,
  selectJobs: PropTypes.func.isRequired
};

export default memo(Routing);
