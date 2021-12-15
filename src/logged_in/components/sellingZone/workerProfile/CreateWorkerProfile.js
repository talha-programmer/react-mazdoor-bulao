import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Box,
  withWidth,
  withStyles,
  TextField,
  Button
} from "@material-ui/core";

import { Autocomplete } from "@material-ui/lab";

import useSaveWorkerProfile from "../../../../hooks/workerProfile/useSaveWorkerProfile";
import useJobCategories from "../../../../hooks/jobs/useJobCategories";
import useWorkerProfile from "../../../../hooks/workerProfile/useWorkerProfile";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";
import alertSeverity from "../../../../config/alertSeverity";
import SnackAlert from "../../../../shared/components/SnackAlert";
import { toast } from "react-toastify";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function CreateWorkerProfile(props) {
  //const { classes } = props;
  const { data: workerProfile } = useWorkerProfile();
  const description = useRef();

  const [selectedSkills, setselectedSkills] = useState(
    workerProfile?.skills.map((skill) => skill.id).toString()
  );

  const {
    mutate,
    isSuccess,
    isError,
    isLoading: isSaveProfileLoading
  } = useSaveWorkerProfile();

  // Job categories are used here as worker skills
  const { data: workerSkills, isLoading } = useJobCategories();

  const onSubmit = (e) => {
    e.preventDefault();

    const newJob = {
      description: description.current.value,
      skills: selectedSkills,
      worker_profile_id: workerProfile?.id
    };

    mutate(newJob);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile saved successfully!");
    } else if (isError) {
      toast.error(
        "An error occured while saving the profile! Please try again!"
      );
    }
  }, [isError, isSuccess]);

  return (
    <Box display="flex" justifyContent="center">
      {isLoading ? (
        <BoxCircularProgress />
      ) : (
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={9}>
            <TextField
              variant="outlined"
              margin="normal"
              multiline
              maxRows={5}
              required
              fullWidth
              label="Description"
              autoComplete="off"
              type="text"
              FormHelperTextProps={{ error: true }}
              inputRef={description}
              defaultValue={workerProfile?.description}
            />

            <Autocomplete
              multiple
              options={workerSkills}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              renderOption={(option, props) => {
                return <li {...props}>{option.name}</li>;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  placeholder="Skills"
                  variant="outlined"
                />
              )}
              onChange={(event, newValue) => {
                // Get only ids of selected categories
                setselectedSkills(newValue.map((skill) => skill.id).toString());
              }}
              defaultValue={workerProfile?.skills}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={isSaveProfileLoading}
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

CreateWorkerProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(CreateWorkerProfile)
);
