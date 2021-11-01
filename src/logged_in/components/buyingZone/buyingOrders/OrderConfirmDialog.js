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

  const {
    mutate: mutateSendReview,
    isSuccess: isSuccessReview,
    isError: isErrorReview
  } = useSendReview();

  const [rating, setRating] = useState(null);
  const reviewText = useRef();

  //const orderId = order.id;

  const onSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      const review = {
        rating: rating,
        review_text: reviewText.current.value,
        order_id: order.id,
        review_type: reviewTypesCodes.FROM_BUYER_TO_WORKER,
        given_to: order.worker_id
      };
      mutateSendReview(review);
    }

    const orderToSend = {
      order_id: order.id
    };
    mutateCompleteOrder(orderToSend);
  };

  useEffect(() => {
    console.log("called");
    if (isSuccessOrder) {
      console.log("reached");
      setOpen(false);
    }
  }, [isSuccessOrder, setOpen]);

  return (
    <FormDialog
      open={open}
      onClose={() => setOpen(false)}
      onFormSubmit={onSubmit}
      headline="Complete Order"
      content={
        <>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            This action will mark the current order as complete.
          </Typography>

          <Typography variant="body2">Rate this order</Typography>

          <Rating
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            multiline
            maxRows={5}
            fullWidth
            label="Write a Review"
            autoComplete="off"
            type="text"
            // FormHelperTextProps={{ error: true }}
            inputRef={reviewText}
            // defaultValue={workerProfile?.description}
          />

          {/* <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Details"
            autoFocus
            multiline
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
              endAdornment: <InputAdornment position="end">days</InputAdornment>
            }}
          /> */}
        </>
      }
      actions={
        <Fragment>
          <Grid container justifyContent="space-between" direction="row">
            <Button
              //type="submit"
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Confirm Order
            </Button>
          </Grid>
        </Fragment>
      }
    />
  );
}

OrderConfirmDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(OrderConfirmDialog)
);
