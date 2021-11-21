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
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from "@material-ui/core";
import format from "date-fns/format";
import usePostedJobs from "../../../../hooks/user/usePostedJobs";
import { jobStatusStrings } from "../../../../config/enums/jobStatus";
import { useHistory } from "react-router";
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
  const { data: postedJobs, isLoading, isError } = usePostedJobs();
  const history = useHistory();

  useEffect(selectJobsPosted, [selectJobsPosted]);

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
            {postedJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell component="th" scope="row">
                  <Link
                    to={`/user/jobs_posted/${job.url}`}
                    style={{ textDecoration: "none" }}
                  >
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {format(new Date(job.created_at), "PPP", {
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
                      history.push(`/user/jobs_posted/${job.url}`);
                    }}
                  >
                    <DetailsIcon color="action" />
                  </IconButton>

                  <IconButton
                    aria-label="Edit Job"
                    onClick={() => {
                      history.push(`/user/jobs_posted/${job.url}/edit`, {
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
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {isLoading ? (
          <BoxCircularProgress />
        ) : (
          <Grid item xs={10}>
            <DisplayTable />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

JobsPosted.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(JobsPosted));
