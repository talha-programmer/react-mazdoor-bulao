import React, { useEffect, useState } from "react";
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
  Container,
  TextField
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
import { Autocomplete } from "@material-ui/lab";
import useJobCategories from "../../../hooks/jobs/useJobCategories";
import useJobs from "../../../hooks/jobs/useJobs";
import useCities from "../../../hooks/jobs/useCities";

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
  const { data: jobCategories } = useJobCategories();
  const [selectedCategories, setSelectedCategories] = useState();

  const { mutate, data, isError, isLoading } = useJobs();
  const [jobs, setJobs] = useState();
  const { data: cities } = useCities();
  const [selectedCity, setSelectedCity] = useState();

  useEffect(selectJobs, [selectJobs]);

  useEffect(() => {
    const filters = new FormData();
    if (selectedCategories) {
      filters.append("categories", selectedCategories);
    }
    if (selectedCity) {
      filters.append("city", selectedCity);
    }
    mutate(filters);
  }, [mutate, selectedCategories, selectedCity]);

  useEffect(() => {
    setJobs(data);
  }, [data]);

  const openJobDetails = (job) => {
    history.push(`/jobs/single_job`, { jobId: job.id });
  };

  return (
    <Box display="flex" justifyContent="center" className="lg-p-top bg-light">
      <Container maxWidth="md">
        <Grid
          container
          justifyContent="space-between"
          style={{ marginBottom: 30 }}
        >
          <Grid item xs={4}>
            <Typography variant="h4">Jobs</Typography>
          </Grid>

          <Grid item xs={4}>
            <Autocomplete
              multiple
              options={jobCategories || []}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              renderOption={(option, props) => {
                return <li {...props}>{option.name}</li>;
              }}
              renderInput={(params) => (
                <TextField {...params} label="Categories" variant="outlined" />
              )}
              onChange={(event, newValue) => {
                // Get only ids of selected categories
                setSelectedCategories(
                  newValue.map((category) => category.id).toString()
                );
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={cities || []}
              disableCloseOnSelect
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderOption={(option, props) => {
                return <li {...props}>{option}</li>;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  //placeholder="Categories"
                  variant="outlined"
                />
              )}
              onChange={(event, newValue) => {
                setSelectedCity(newValue);
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {!Array.isArray(jobs) || jobs?.length === 0 ? (
            <span>No jobs to display</span>
          ) : (
            jobs.map((job) => (
              <Grid item xs={12}>
                <Card
                  className={classes.card}
                  onClick={() => openJobDetails(job)}
                >
                  <Typography variant="h5" className={globalClasses.mb_10}>
                    {job.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className={globalClasses.mb_10}
                  >
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
      </Container>
    </Box>
  );
}

Jobs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(Jobs));
