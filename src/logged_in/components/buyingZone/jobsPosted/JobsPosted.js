import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Grid,
  Box,
  withWidth,
  withStyles,
  Typography,
  Card
} from "@material-ui/core";
import format from "date-fns/format";
import usePostedJobs from "../../../../hooks/user/usePostedJobs";

const styles = (theme) => ({
  // blogContentWrapper: {
  //   marginLeft: theme.spacing(1),
  //   marginRight: theme.spacing(1),
  //   [theme.breakpoints.up("sm")]: {
  //     marginLeft: theme.spacing(4),
  //     marginRight: theme.spacing(4)
  //   },
  //   maxWidth: 1280,
  //   width: "100%"
  // },
  // wrapper: {
  //   minHeight: "60vh"
  // },
  // noDecoration: {
  //   textDecoration: "none !important"
  // }import useAppliedJobs from '../../../hooks/user/useAppliedJobs';

  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function JobsPosted(props) {
  const { classes } = props;
  const postedJobsQuery = usePostedJobs();
  const [postedJobs, setpostedJobs] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postedJobsQuery.isFetched) {
      setpostedJobs(postedJobsQuery.data);
      setLoading(false);
    }
  }, [postedJobsQuery.data, postedJobsQuery.isFetched]);

  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {loading ? (
          <span>Loading...</span>
        ) : (
          postedJobs.map((job) => (
            <Grid item xs={8}>
              <Card className={classes.card}>
                <Typography variant="h5">{job.title}</Typography>
                <Typography variant="body2">
                  {format(new Date(job.created_at), "PPP", {
                    awareOfUnicodeTokens: true
                  })}
                </Typography>
                <Typography variant="body2">Budget: RS {job.budget}</Typography>
                <Typography variant="body2">
                  Deadline {job.deadline} days
                </Typography>
                <Typography variant="body2">Job Status {job.status}</Typography>
                <Typography variant="body2">{job.details}</Typography>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

JobsPosted.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(JobsPosted));
