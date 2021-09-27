import React, { memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import PropsRoute from "../../shared/components/PropsRoute";
import Home from "./home/Home";
import useLocationBlocker from "../../shared/functions/useLocationBlocker";
import Logout from "../../logged_in/components/logout/Logout";
import Jobs from "../../mixed/components/jobs/Jobs";
import CreateJob from "../../logged_in/components/createJob/CreateJob";

function Routing(props) {
  const { selectHome } = props;
  useLocationBlocker();
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
      <PropsRoute
        exact
        path="/jobs"
        component={Jobs}
        //selectBlog={selectBlog}
        //blogPosts={blogPosts}
      />
      <PropsRoute exact path="/jobs/create" component={CreateJob} />
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
