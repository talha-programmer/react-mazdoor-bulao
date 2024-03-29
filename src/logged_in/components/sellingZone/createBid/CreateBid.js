import React, { Fragment, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  withWidth,
  withStyles,
  Typography,
  TextField,
  Button,
  InputAdornment
} from "@material-ui/core";
import FormDialog from "../../../../shared/components/FormDialog";
import useSaveBid from "../../../../hooks/bids/useSaveBid";
import alertSeverity from "../../../../config/alertSeverity";
import SnackAlert from "../../../../shared/components/SnackAlert";
import { toast } from "react-toastify";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function CreateBid(props) {
  const { job, open: dialogOpen, setOpen: setDialogOpen } = props;
  const details = useRef();
  const offeredAmount = useRef();
  const completionTime = useRef();
  const { mutate, isSuccess, isError } = useSaveBid();

  const jobId = job.id;
  const onSubmit = (e) => {
    e.preventDefault();
    const bid = {
      job_id: jobId,
      details: details.current.value,
      offered_amount: offeredAmount.current.value,
      completion_time: completionTime.current.value
    };

    mutate(bid);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Bid created successfully!");

      setDialogOpen(false); //close the dialog
    } else if (isError) {
      toast.error("Error occured while creating bid! Please try again");
    }
  }, [isError, isSuccess, setDialogOpen]);

  return (
    <>
      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onFormSubmit={onSubmit}
        headline="Bid on Job"
        content={
          <>
            <Typography variant="h6">{job.title}</Typography>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Details"
              autoFocus
              multiline
              rows={4}
              maxRows={4}
              autoComplete="off"
              type="text"
              FormHelperTextProps={{ error: true }}
              inputRef={details}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              label="Offered Amount"
              autoComplete="off"
              type="number"
              FormHelperTextProps={{ error: true }}
              inputRef={offeredAmount}
              InputProps={{
                endAdornment: <InputAdornment position="end">RS</InputAdornment>
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              label="Completion Time"
              autoComplete="off"
              type="number"
              FormHelperTextProps={{ error: true }}
              inputRef={completionTime}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">days</InputAdornment>
                )
              }}
            />
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
              Create Bid
            </Button>
          </Fragment>
        }
      />
    </>
  );
}

CreateBid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(CreateBid));
