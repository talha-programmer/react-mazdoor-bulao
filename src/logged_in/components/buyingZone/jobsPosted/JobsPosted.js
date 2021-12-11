import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Grid,
  Box,
  withWidth,
  withStyles,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  MenuItem,
  Container,
  Typography
} from "@material-ui/core";
import format from "date-fns/format";
import usePostedJobs from "../../../../hooks/user/usePostedJobs";
import {
  jobStatusCodes,
  jobStatusStrings
} from "../../../../config/enums/jobStatus";
import { useHistory } from "react-router-dom";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DetailsIcon from "@material-ui/icons/OpenInNew";
import { Link } from "react-router-dom";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function JobsPosted(props) {
  const { classes, selectJobsPosted } = props;
  const { data, isLoading, isError, isFetched } = usePostedJobs();
  const history = useHistory();
  const [postedJobs, setPostedJobs] = useState();

  const [selectedJobStatus, setSelectedJobStatus] = useState(-1);
  let allJobStatusOptions = [];

  useEffect(() => {
    if (isFetched) {
      setPostedJobs(data);
    }
  }, [data, isFetched]);

  Object.keys(jobStatusStrings).forEach((key) => {
    const option = {
      value: key,
      label: jobStatusStrings[key]
    };
    allJobStatusOptions.push(option);
  });

  useEffect(selectJobsPosted, [selectJobsPosted]);

  useEffect(() => {
    if (selectedJobStatus == -1) {
      setPostedJobs(data);
    } else {
      let jobs = data.filter((job) => {
        return job.status == selectedJobStatus;
      });
      setPostedJobs(jobs);
    }
  }, [data, selectedJobStatus]);

  function DisplayTable() {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Date Posted</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Estimated Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postedJobs?.map((job) => (
              <TableRow key={job.id}>
                <TableCell component="th" scope="row">
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      history.push("jobs_posted/single_job", {
                        jobId: job.id
                      });
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {format(new Date(job.created_at), "do MMM, yyyy", {
                    awareOfUnicodeTokens: true
                  })}
                </TableCell>
                <TableCell>RS {job.budget}</TableCell>
                <TableCell>{job.deadline} days</TableCell>
                <TableCell>{jobStatusStrings[job.status]}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="View Details"
                    onClick={() => {
                      history.push("jobs_posted/single_job", {
                        jobId: job.id
                      });
                    }}
                  >
                    <DetailsIcon color="action" />
                  </IconButton>

                  <IconButton
                    aria-label="Edit Job"
                    disabled={job.status === jobStatusCodes.JOB_COMPLETED}
                    onClick={() => {
                      history.push(`/user/jobs_posted/single_job/edit`, {
                        job: job
                      });
                    }}
                  >
                    <EditIcon color="secondary" />
                  </IconButton>

                  {/* <IconButton aria-label="Delete Job" onClick={() => {}}>
                    <DeleteIcon color="error" />
                  </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Box display="flex" justifyContent="center">
      <Container maxWidth="md">
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          style={{ marginBottom: 30 }}
        >
          <Grid item xs={6}>
            <Typography variant="h4">Jobs Posted</Typography>
          </Grid>

          <Grid item xs={4}>
            <TextField
              select
              variant="outlined"
              fullWidth
              margin="normal"
              defaultValue={-1}
              onChange={(event) => {
                setSelectedJobStatus(event.target.value);
              }}
            >
              <MenuItem key={-1} value={-1}>
                All Jobs
              </MenuItem>
              {allJobStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {isLoading ? (
            <BoxCircularProgress />
          ) : (
            <Grid item xs={12}>
              <DisplayTable />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

JobsPosted.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(JobsPosted));
