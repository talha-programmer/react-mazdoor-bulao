import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";

const SnackAlert = (props) => {
  const { message, severity } = props;
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    if ("handleClose" in props) {
      props.handleClose();
    } else {
      setOpen(false);
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackAlert;
