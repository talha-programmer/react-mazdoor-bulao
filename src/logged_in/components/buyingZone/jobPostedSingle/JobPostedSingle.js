import React, { useState } from "react";
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
import { jobStatusStrings } from "../../../../config/enums/jobStatus";
import useJob from "../../../../hooks/jobs/useJob";
import { bidStatusStrings } from "../../../../config/enums/bidStatus";
import { useHistory } from "react-router-dom";
import useStartOrder from "../../../../hooks/orders/useStartOrder";
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
  // }

  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function JobPostedSingle(props) {
  const { classes, jobId } = props;
  const { data: job, isLoading, isError } = useJob(jobId);
  const { mutate, isSuccess, isError: orderError } = useStartOrder();
  let selectedBid = null;
  const history = useHistory();

  const startOrder = () => {
    const order = {
      job_bid_id: selectedBid.id,
      job_id: job.id
    };

    mutate(order);
  };
  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <>
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
                    history.push(`/user/jobs_posted/${job.url}/edit`, {
                      job: job
                    });
                  }}
                >
                  Edit Job
                </Button>
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h2">Bids</Typography>
            </Grid>
            {job.bids?.map((bid) => (
              <Grid item xs={8}>
                <Card className={classes.card}>
                  <Typography variant="h5">
                    Posted By: {bid.offered_by?.name}
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(bid.created_at), "PPP", {
                      awareOfUnicodeTokens: true
                    })}
                  </Typography>
                  <Typography variant="body2">
                    Offered Amount: RS {bid.offered_amount}
                  </Typography>
                  <Typography variant="body2">
                    Completion Time: {bid.completion_time} days
                  </Typography>
                  <Typography variant="body2">
                    Bid Status: {bidStatusStrings[bid.status]}
                  </Typography>
                  <Typography variant="body2">{bid.details}</Typography>
                  <Button>Open Chat</Button>
                  <Button
                    onClick={() => {
                      selectedBid = bid;
                      startOrder();
                    }}
                  >
                    Hire This Person
                  </Button>
                </Card>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Box>
  );
}

JobPostedSingle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(JobPostedSingle)
);
