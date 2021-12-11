import React, { Fragment, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  withWidth,
  withStyles,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Grid
} from "@material-ui/core";
import FormDialog from "../../../../shared/components/FormDialog";
import useCompleteBuyingOrder from "../../../../hooks/orders/useCompleteBuyingOrder";
import { Rating } from "@material-ui/lab";
import { reviewTypesCodes } from "../../../../config/enums/reviewTypes";
import useSendReview from "../../../../hooks/review/useSendReview";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function OrderConfirmDialog(props) {
  const { order, open, setOpen } = props;

  const {
    mutate: mutateCompleteOrder,
    isSuccess: isSuccessOrder,
    isError: isErrorOrder
  } = useCompleteBuyingOrder();

  const onSubmit = (e) => {
    e.preventDefault();

    const orderToSend = {
      order_id: order.id
    };
    mutateCompleteOrder(orderToSend);
  };

  useEffect(() => {
    if (isSuccessOrder) {
      setOpen(false);
    }
  }, [isSuccessOrder, setOpen]);

  return (
    <>
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        onFormSubmit={onSubmit}
        headline="Complete Order"
        content={
          <>
            <Typography variant="h6" style={{ marginBottom: 10 }}>
              This action will mark the current order as complete.
            </Typography>
          </>
        }
        actions={
          <Fragment>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  fullWidth
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="medium"
                  fullWidth
                >
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Fragment>
        }
      />
    </>
  );
}

OrderConfirmDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(OrderConfirmDialog)
);
