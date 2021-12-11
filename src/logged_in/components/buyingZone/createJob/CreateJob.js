import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Box,
  withWidth,
  withStyles,
  TextField,
  Button,
  InputAdornment,
  Container,
  Typography
} from "@material-ui/core";

import { Autocomplete } from "@material-ui/lab";

import useSaveJob from "../../../../hooks/jobs/useSaveJob";
import useJobCategories from "../../../../hooks/jobs/useJobCategories";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";
import SnackAlert from "../../../../shared/components/SnackAlert";
import alertSeverity from "../../../../config/alertSeverity";
import ReactImageUploadComponent from "react-images-upload";
import { useHistory } from "react-router";
import AutocompletePlaces from "react-google-autocomplete";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    borderRadius: 10
  }
});

function CreateJob(props) {
  const job = props.location?.state?.job;
  const { classes } = props;
  const formRef = useRef();
  const title = useRef();
  const details = useRef();
  const budget = useRef();
  const deadline = useRef();
  const [selectedCategories, setSelectedCategories] = useState(
    job?.categories?.map((category) => category.id).toString()
  );
  const history = useHistory();

  // Used it to reload the form. Every react component reloads
  // when its key changes
  const [formKey, setFormKey] = useState("form-key");

  const {
    mutate,
    isSuccess: isJobSaved,
    isError: isJobSaveFailed
  } = useSaveJob();

  const { data: jobCategories, isLoading } = useJobCategories();
  const [snackMessage, setSnackMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState();
  const [images, setImages] = useState();

  const [city, setCity] = useState();
  const [area, setArea] = useState();

  let defaultImages = [];

  if (job?.id) {
    job?.images?.forEach((image) => {
      defaultImages.push(image.image_url);
    });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (formRef.current.reportValidity()) {
      const newJob = new FormData();
      newJob.append("title", title.current.value);
      newJob.append("details", details.current.value);
      newJob.append("budget", budget.current.value);
      newJob.append("deadline", deadline.current.value);
      newJob.append("categories", selectedCategories);
      newJob.append("city", city);

      if (area) {
        newJob.append("area", area);
      }

      if (job?.id) {
        newJob.append("job_id", job.id);
      }

      if (images) {
        let counter = 0;
        images.forEach((image) => {
          newJob.append(`image:${counter}`, image);
          counter++;
        });
        newJob.append("no_of_images", images.length);
      }

      mutate(newJob);
    }
  };

  const clearForm = () => {
    // Just need to change, value doesn't matter. It will reload the form
    setFormKey(formKey + "x");
    history.push("/user/jobs_posted");
  };

  useEffect(() => {
    if (isJobSaved) {
      setSnackMessage("Job saved successfully!");
      setSnackSeverity(alertSeverity.success);
      setSnackOpen(true);
      clearForm();
    } else if (isJobSaveFailed) {
      setSnackMessage(
        "An error occured while saving the job! Please try again!"
      );
      setSnackSeverity(alertSeverity.error);
      setSnackOpen(true);
    }
  }, [isJobSaveFailed, isJobSaved]);

  function setLocation(placeSelected) {
    let locality,
      sublocality = null;
    let place = placeSelected.address_components.filter((item) => {
      return (
        item.types.includes("sublocality") || item.types.includes("locality")
      );
    });

    place.forEach((item) => {
      if (item.types.includes("sublocality")) {
        sublocality = item.long_name;
      } else if (item.types.includes("locality")) {
        locality = item.long_name;
      }
    });

    setCity(locality);
    setArea(sublocality);
  }

  return (
    <Box display="flex" justifyContent="center">
      {isLoading ? (
        <BoxCircularProgress />
      ) : (
        <Container maxWidth="md">
          <Typography style={{ marginBottom: 30 }} variant="h4">
            {job ? "Edit" : "Create"} Job
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {snackOpen && (
              <SnackAlert
                message={snackMessage}
                severity={snackSeverity}
                handleClose={() => {
                  setSnackOpen(false);
                }}
              />
            )}
            <Grid
              item
              xs={12}
              style={{ backgroundColor: "white", padding: 30 }}
              className={classes.card}
            >
              <form ref={formRef} key={formKey}>
                <ReactImageUploadComponent
                  withIcon={true}
                  withPreview={true}
                  buttonText="Choose images"
                  onChange={(pictureFiles, pictureDataURLs) => {
                    setImages(pictureFiles);
                  }}
                  imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                  maxFileSize={5242880} // 5mb
                  //defaultImages={defaultImages} // TODO Unable to change these images
                />

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Title"
                  autoFocus
                  autoComplete="off"
                  type="text"
                  FormHelperTextProps={{ error: true }}
                  inputRef={title}
                  defaultValue={job?.title}
                />

                <Autocomplete
                  multiple
                  required
                  options={jobCategories}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.name}
                  filterSelectedOptions
                  renderOption={(option, props) => {
                    return <li {...props}>{option.name}</li>;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Categories"
                      placeholder="Categories"
                      variant="outlined"
                    />
                  )}
                  onChange={(event, newValue) => {
                    // Get only ids of selected categories
                    setSelectedCategories(
                      newValue.map((category) => category.id).toString()
                    );
                  }}
                  defaultValue={job?.categories}
                />

                <TextField
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  maxRows={5}
                  required
                  fullWidth
                  label="Details"
                  placeholder="Describe in detail about the job and your expectations from the worker"
                  autoComplete="off"
                  type="text"
                  FormHelperTextProps={{ error: true }}
                  inputRef={details}
                  defaultValue={job?.details}
                />

                <Grid
                  container
                  direction="row"
                  spacing={3}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      style={{
                        width: "20ch"
                      }}
                      required
                      label="Budget"
                      autoComplete="off"
                      type="number"
                      FormHelperTextProps={{ error: true }}
                      inputRef={budget}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">RS</InputAdornment>
                        )
                      }}
                      defaultValue={job?.budget}
                    />
                  </Grid>

                  <Grid item>
                    <AutocompletePlaces
                      apiKey={process.env.REACT_APP_PLACES_API_KEY}
                      style={{
                        width: "100%",
                        height: "55px",
                        fontSize: 14,
                        paddingLeft: 5
                      }}
                      onPlaceSelected={(place) => {
                        setLocation(place);
                      }}
                      options={{
                        types: ["(regions)"],
                        componentRestrictions: { country: "pk" }
                      }}
                      defaultValue={job?.location}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      width="auto"
                      required
                      style={{
                        width: "20ch"
                      }}
                      label="Deadline"
                      autoComplete="off"
                      type="number"
                      FormHelperTextProps={{ error: true }}
                      inputRef={deadline}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">days</InputAdornment>
                        )
                      }}
                      defaultValue={job?.deadline}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  // disabled={isLoading}
                  size="large"
                  onClick={onSubmit}
                  style={{
                    marginTop: 20
                  }}
                >
                  Save
                </Button>
              </form>
            </Grid>
          </Grid>
        </Container>
      )}
    </Box>
  );
}

CreateJob.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(CreateJob));
