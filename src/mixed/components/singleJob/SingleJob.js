import React, { useState } from "react";
import useJob from "../../../hooks/jobs/useJob";
import { Box, Card, withStyles, withWidth } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import format from "date-fns/format";
import { Button } from "@material-ui/core";
import CreateBid from "../../../logged_in/components/sellingZone/createBid/CreateBid";
import useAppliedJobs from "../../../hooks/user/useAppliedJobs";
import classNames from "classnames";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

const SingleJob = ({ jobId, classes }) => {
  const { data: job, isLoading, isError } = useJob(jobId);
  const { data: appliedJobs } = useAppliedJobs();
  const [openBidDialog, setOpenBidDialog] = useState(false);
  return (
    <Box
      display="flex"
      justifyContent="center"
      className={classNames("lg-p-top")}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {isLoading ? (
          <span>Loading...</span>
        ) : isError ? (
          <span>Error Occurred</span>
        ) : (
          <Grid item xs={8}>
            <Card className={classes.card}>
              <Typography variant="h5">{job.title}</Typography>
              <Typography variant="body2">
                {format(new Date(job.created_at), "PPP", {
                  awareOfUnicodeTokens: true
                })}
              </Typography>
              <Typography variant="body2">Location: {job.location}</Typography>
              <Typography variant="body2">Budget: RS {job.budget}</Typography>
              <Typography variant="body2">
                Deadline {job.deadline} days
              </Typography>
              <Typography variant="body2">{job.details}</Typography>

              {appliedJobs && !(job.id in appliedJobs) && (
                <Button
                  onClick={() => {
                    setOpenBidDialog(true);
                  }}
                >
                  Bid on this job
                </Button>
              )}
            </Card>
          </Grid>
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
};

export default withWidth()(withStyles(styles, { withTheme: true })(SingleJob));
