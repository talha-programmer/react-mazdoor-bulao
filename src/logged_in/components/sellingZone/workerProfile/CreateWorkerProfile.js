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

import Checkbox from "@material-ui/icons/CheckBox";

import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Autocomplete } from "@material-ui/lab";

import ButtonCircularProgress from "../../../../shared/components/ButtonCircularProgress";
import useSaveWorkerProfile from "../../../../hooks/workerProfile/useSaveWorkerProfile";
import useJobCategories from "../../../../hooks/jobs/useJobCategories";
import useWorkerProfile from "../../../../hooks/workerProfile/useWorkerProfile";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function CreateWorkerProfile(props) {
  //const { classes } = props;
  const { data: workerProfile } = useWorkerProfile();
  const description = useRef();

  const [selectedSkills, setselectedSkills] = useState(
    workerProfile?.skills.map((skill) => skill.id).toString()
  );
  const { mutate, isSuccess, isError } = useSaveWorkerProfile();

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

CreateWorkerProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(CreateWorkerProfile)
);
