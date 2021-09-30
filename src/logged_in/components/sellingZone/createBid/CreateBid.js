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
import ButtonCircularProgress from "../../../../shared/components/ButtonCircularProgress";
import FormDialog from "../../../../shared/components/FormDialog";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function CreateBid(props) {
  const { classes, job } = props;
  console.log("reached in bid");
  // const title = useRef();
  // const details = useRef();
  // const budget = useRef();
  // const deadline = useRef();
  // const location = useRef();
  //const { mutate, isSuccess, isError } = useSaveJob();

  // const onSubmit = (e) => {
  //   e.preventDefault();

  //   const bid = {
  //     title: title.current.value,
  //     details: details.current.value,
  //     budget: budget.current.value,
  //     deadline: deadline.current.value,
  //     location: location.current.value
  //   };

  //   mutate(bid);
  // };

  return (
    <FormDialog
      open
      //onClose={onClose}
      //loading={isLoading}
      // onFormSubmit={(e) => {
      //   e.preventDefault();
      //   login();
      // }}
      hideBackdrop
      headline="Bid on Job"
      content={
        <Fragment>
          <Typography variant="h6">{job.title}</Typography>

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
            //inputRef={title}
          />
        </Fragment>
      }
    />
  );
}

CreateBid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(CreateBid));
