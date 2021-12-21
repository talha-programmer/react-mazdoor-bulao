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
import { toast } from "react-toastify";
import useSaveCategory from "../../../hooks/jobs/useSaveCategory";
import FormDialog from "../../../shared/components/FormDialog";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function CategoryDialog(props) {
  const { category, open: dialogOpen, setOpen: setDialogOpen } = props;
  const name = useRef();

  const { mutate, isSuccess, isError } = useSaveCategory();

  const onSubmit = (e) => {
    e.preventDefault();
    const category = {
      name: name.current.value
    };

    mutate(category);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Category saved successfully!");

      setDialogOpen(false); //close the dialog
    } else if (isError) {
      toast.error("Error occured while saving category! Please try again");
    }
  }, [isError, isSuccess, setDialogOpen]);

  return (
    <>
      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onFormSubmit={onSubmit}
        headline="Category"
        content={
          <>
            <Typography variant="h6">New Category</Typography>

            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              label="Category Name"
              autoComplete="off"
              type="text"
              inputRef={name}
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
              Save Category
            </Button>
          </Fragment>
        }
      />
    </>
  );
}

CategoryDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(CategoryDialog)
);
