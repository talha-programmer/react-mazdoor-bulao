import React, { Fragment, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Grid,
  Box,
  withWidth,
  withStyles,
  Typography,
  Card,
  TextField,
  FormControlLabel,
  Button,
  InputAdornment
} from "@material-ui/core";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import AuthController from "../../../controllers/AuthController";
import useSaveJob from "../../../hooks/jobs/useSaveJob";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function CreateJob(props) {
  const { classes } = props;

  const title = useRef();
  const details = useRef();
  const budget = useRef();
  const deadline = useRef();
  const location = useRef();
  const { mutate, isSuccess, isError } = useSaveJob();

  const onSubmit = (e) => {
    e.preventDefault();

    const job = {
      title: title.current.value,
      details: details.current.value,
      budget: budget.current.value,
      deadline: deadline.current.value,
      location: location.current.value
    };

    mutate(job);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      className={classNames("lg-p-top")}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={6}>
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
            {/* {isLoading && <ButtonCircularProgress />} */}
          </Button>

          {/* <FormControlLabel
              className={classes.formControlLabel}
              control={<Checkbox color="primary" />}
              label={<Typography variant="body1">Remember me</Typography>}
            /> */}
        </Grid>
      </Grid>
    </Box>
  );
}

CreateJob.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(CreateJob));
