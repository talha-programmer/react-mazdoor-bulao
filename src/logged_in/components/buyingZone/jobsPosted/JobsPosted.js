import React, { useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Grid,
  Box,
  withWidth,
  withStyles,
  Typography,
  Card,
  Button
} from "@material-ui/core";
import format from "date-fns/format";
import usePostedJobs from "../../../../hooks/user/usePostedJobs";
import { jobStatusStrings } from "../../../../config/enums/jobStatus";
import { useHistory } from "react-router";

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
  const { classes, selectJobsPosted } = props;
  const { data: postedJobs, isLoading, isError } = usePostedJobs();
  const history = useHistory();

  useEffect(selectJobsPosted, [selectJobsPosted]);

  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {isLoading ? (
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
                <Typography variant="body2">
                  Job Status: {jobStatusStrings[job.status]}
                </Typography>
                <Typography variant="body2">{job.details}</Typography>
                <Button
                  onClick={() => {
                    history.push(`/user/jobs_posted/${job.url}`);
                  }}
                >
                  Job Details
                </Button>
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
