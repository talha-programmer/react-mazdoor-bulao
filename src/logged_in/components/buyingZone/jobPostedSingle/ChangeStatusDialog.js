import React, { Fragment, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  withWidth,
  withStyles,
  Typography,
  TextField,
  Button,
  InputAdornment,
  MenuItem
} from "@material-ui/core";
import FormDialog from "../../../../shared/components/FormDialog";
import alertSeverity from "../../../../config/alertSeverity";
import SnackAlert from "../../../../shared/components/SnackAlert";
import { jobStatusStrings } from "../../../../config/enums/jobStatus";
import useUpdateJobStatus from "../../../../hooks/jobs/useUpdateJobStatus";
import { toast } from "react-toastify";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function ChangeStatusDialog(props) {
  const { job, open: dialogOpen, setOpen: setDialogOpen } = props;
  const [selectedOption, setSelectedOption] = useState();
  const { mutate, isSuccess, isError } = useUpdateJobStatus();

  const jobId = job.id;
  const onSubmit = (e) => {
    e.preventDefault();
    const updatedJob = {
      job_id: jobId,
      job_status: parseInt(selectedOption)
    };

    mutate(updatedJob);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Job Status updated successfully!");
      setDialogOpen(false); //close the dialog
    } else if (isError) {
      toast.error("Error occured while updating job status! Please try again");
    }
  }, [isError, isSuccess, setDialogOpen]);

  let allJobStatusOptions = [];

  Object.keys(jobStatusStrings).forEach((key) => {
    const option = {
      value: key,
      label: jobStatusStrings[key]
    };
    allJobStatusOptions.push(option);
  });

  return (
    <>
      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onFormSubmit={onSubmit}
        headline="Change Job Status"
        content={
          <>
            <Typography variant="h6" style={{ width: "100%" }}>
              {job.title}
            </Typography>

            <TextField
              select
              variant="outlined"
              label="Job Status"
              margin="normal"
              fullWidth
              defaultValue={job.status}
              onChange={(event) => {
                setSelectedOption(event.target.value);
              }}
            >
              {allJobStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </>
        }
        actions={
          <Fragment>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
            >
              Update Job Status
            </Button>
          </Fragment>
        }
      />
    </>
  );
}

ChangeStatusDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(ChangeStatusDialog)
);
