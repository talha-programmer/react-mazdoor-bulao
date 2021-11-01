import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Box,
  withWidth,
  withStyles,
  TextField,
  Button,
  InputAdornment
} from "@material-ui/core";

import Checkbox from "@material-ui/icons/CheckBox";

import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Autocomplete } from "@material-ui/lab";

import ButtonCircularProgress from "../../../../shared/components/ButtonCircularProgress";
import useSaveJob from "../../../../hooks/jobs/useSaveJob";
import useJobCategories from "../../../../hooks/jobs/useJobCategories";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function CreateJob(props) {
  //const { classes } = props;
  const job = props.location?.state?.job;
  const title = useRef();
  const details = useRef();
  const budget = useRef();
  const deadline = useRef();
  const location = useRef();
  const [selectedCategories, setSelectedCategories] = useState(
    job?.categories.map((category) => category.id).toString()
  );
  const { mutate, isSuccess, isError } = useSaveJob();
  const { data: jobCategories, isLoading } = useJobCategories();

  const onSubmit = (e) => {
    e.preventDefault();

    const newJob = {
      title: title.current.value,
      details: details.current.value,
      budget: budget.current.value,
      deadline: deadline.current.value,
      location: location.current.value,
      categories: selectedCategories,
      job_id: job?.id
    };

    mutate(newJob);
  };

  return (
    <Box display="flex" justifyContent="center">
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={9}>
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

            <TextField
              variant="outlined"
              margin="normal"
              multiline
              maxRows={5}
              required
              fullWidth
              label="Details"
              autoComplete="off"
              type="text"
              FormHelperTextProps={{ error: true }}
              inputRef={details}
              defaultValue={job?.details}
            />

            <Autocomplete
              multiple
              options={jobCategories}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              renderOption={(option, props) => {
                return (
                  <li {...props}>
                    {/* <Checkbox
                      //icon={<CheckBoxIcon fontSize="small" />}
                      //checkedIcon={<CheckBoxIcon fontSize="small" />}
                      style={{ marginRight: 8 }}
                      checked={props.selected}
                    /> */}
                    {option.name}
                  </li>
                );
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
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  label="Location"
                  autoComplete="off"
                  type="text"
                  FormHelperTextProps={{ error: true }}
                  inputRef={location}
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
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

CreateJob.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(CreateJob));
