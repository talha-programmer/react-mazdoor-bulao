import React, { memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import PropsRoute from "../../shared/components/PropsRoute";
import Home from "./home/Home";
//import useLocationBlocker from "../../shared/functions/useLocationBlocker";
import Logout from "../../logged_in/components/logout/Logout";
import Jobs from "../../mixed/components/jobs/Jobs";
import useJobs from "../../hooks/jobs/useJobs";
import SingleJob from "../../mixed/components/singleJob/SingleJob";

function Routing(props) {
  const { selectHome, selectJobs } = props;
  const { data: jobs, isLoading } = useJobs();
  return (
    <Switch>
      {!isLoading &&
        Array.isArray(jobs) &&
        jobs.map((job) => (
          <PropsRoute
            path={`/jobs/${job.url}`}
            component={SingleJob}
            jobId={job.id}
            title={job.title}
            key={job.url}
          />
        ))}
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
