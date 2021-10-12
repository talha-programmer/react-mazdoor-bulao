import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import PropsRoute from "../../shared/components/PropsRoute";
import Home from "./home/Home";
import useLocationBlocker from "../../shared/functions/useLocationBlocker";
import Logout from "../../logged_in/components/logout/Logout";
import Jobs from "../../mixed/components/jobs/Jobs";
import useJobs from "../../hooks/jobs/useJobs";
import SingleJob from "../../mixed/components/singleJob/SingleJob";

function Routing(props) {
  const { selectHome } = props;
  const { data: jobs, isLoading } = useJobs();

  return (
    <Switch>
      {/* {blogPosts.map((post) => (
        <PropsRoute
          path={post.url}
          component={BlogPost}
          title={post.title}
          key={post.title}
          src={post.src}
          date={post.date}
          content={post.content}
          otherArticles={blogPosts.filter(
            (blogPost) => blogPost.id !== post.id
          )}
        />
      ))}
       */}

      {!isLoading &&
        jobs.map((job) => (
          <PropsRoute
            path={`/jobs/${job.url}`}
            component={SingleJob}
            jobId={job.id}
            title={job.title}
            key={job.url}
          />
        ))}
      <PropsRoute
        exact
        path="/jobs"
        component={Jobs}
        //selectBlog={selectBlog}
        //blogPosts={blogPosts}
      />
      <PropsRoute path="/logout" component={Logout} />
      <PropsRoute path="/" component={Home} selectHome={selectHome} />
    </Switch>
  );
}

Routing.propTypes = {
  blogposts: PropTypes.arrayOf(PropTypes.object),
  selectHome: PropTypes.func.isRequired,
  selectBlog: PropTypes.func.isRequired
};

export default memo(Routing);
