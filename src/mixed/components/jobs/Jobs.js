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
import useJobs from "../../../hooks/jobs/useJobs";
import format from "date-fns/format";
import CreateBid from "../../../logged_in/components/sellingZone/createBid/CreateBid";

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

function Jobs(props) {
  const { classes } = props;
  const jobsQuery = useJobs();
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const [job, setJob] = useState(null);

  return (
    <Box
      display="flex"
      justifyContent="center"
      className={classNames("lg-p-top")}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {jobsQuery.isLoading ? (
          <span>Loading...</span>
        ) : jobsQuery.isError ? (
          jobsQuery.error.message
        ) : (
          jobsQuery.data.map((job) => (
            <Grid item xs={8}>
              <Card className={classes.card}>
                <Typography variant="h5">{job.title}</Typography>
                <Typography variant="body2">
                  {format(new Date(job.created_at), "PPP", {
                    awareOfUnicodeTokens: true
                  })}
                </Typography>
                <Typography variant="body2">
                  Location: {job.location}
                </Typography>
                <Typography variant="body2">Budget: RS {job.budget}</Typography>
                <Typography variant="body2">
                  Deadline {job.deadline} days
                </Typography>
                <Typography variant="body2">{job.details}</Typography>
                <Button
                  onClick={() => {
                    setOpenBidDialog(true);
                    setJob(job);
                  }}
                >
                  Bid on this job
                </Button>
              </Card>
            </Grid>
          ))
        )}
        {openBidDialog && (
          <CreateBid
            job={job}
            open={openBidDialog}
            setOpen={setOpenBidDialog}
          />
        )}
      </Grid>
    </Box>
  );
}

Jobs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(Jobs));
