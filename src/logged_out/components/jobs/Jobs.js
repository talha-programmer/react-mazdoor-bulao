import React from "react";
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
import useJobs from "../../../hooks/useJobs";
import format from "date-fns/format";

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
  // },
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function Jobs(props) {
  const { classes } = props;
  const jobsQuery = useJobs();

  return (
    <Box
      display="flex"
      justifyContent="center"
      className={classNames("lg-p-top")}
    >
      <div className={classes.blogContentWrapper}>
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
                  <Typography variant="body2">{job.details}</Typography>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </div>
    </Box>
  );
}

Jobs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(Jobs));
