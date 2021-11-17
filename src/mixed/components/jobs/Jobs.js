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
import { useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";
import queryKeys from "../../../config/queryKeys";
import { subDays, formatDistance } from "date-fns";
import { LocationOn } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import shortenString from "../../../shared/functions/shortenString";
import useGlobalClasses from "../../../hooks/style/useGlobalClasses";

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
    padding: 20,

    "&:hover": {
      backgroundColor: theme.colors.background,
      cursor: "pointer",
      color: theme.colors.darkBlack
    }
  },
  categoryName: {
    borderRadius: 50,
    padding: "4px 10px 4px 10px",
    backgroundColor: "#f2f2f2",
    marginRight: 10
  }
});

function Jobs(props) {
  const { classes, selectJobs } = props;
  const history = useHistory();
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const globalClasses = useGlobalClasses();

  // We have fetched jobs already in Routing. That's why accessing
  // them with queryClient
  let jobs = queryClient.getQueryData(queryKeys.jobs);

  useEffect(selectJobs, [selectJobs]);

  const openJobDetails = (job) => {
    history.push(`/jobs/${job.url}`);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      className={classNames("lg-p-top")}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {!Array.isArray(jobs) || jobs.length === 0 ? (
          <span>No jobs to display</span>
        ) : (
          jobs.map((job) => (
            <Grid item xs={8}>
              <Card
                className={classes.card}
                onClick={() => openJobDetails(job)}
              >
                <Typography variant="h5" className={globalClasses.mb_10}>
                  {job.title}
                </Typography>
                <Typography variant="subtitle1" className={globalClasses.mb_10}>
                  Est. Budget: RS {job.budget} - Posted:{" "}
                  {formatDistance(
                    subDays(new Date(job.created_at), 0),
                    currentDate,
                    { addSuffix: true }
                  )}
                  {" - Est. time: "} {job.deadline} days
                </Typography>

                <Typography variant="body1" className={globalClasses.mb_5}>
                  {shortenString(job.details)}
                </Typography>

                <Typography variant="body1" className={globalClasses.mb_10}>
                  {job?.categories?.map((category) => (
                    <span className={classes.categoryName}>
                      {category.name}
                    </span>
                  ))}
                </Typography>

                <Typography variant="body2">
                  Posted By: {job.posted_by.name}{" "}
                  <LocationOn style={{ fontSize: 18 }} />
                  {job.location}
                </Typography>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

Jobs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(Jobs));
