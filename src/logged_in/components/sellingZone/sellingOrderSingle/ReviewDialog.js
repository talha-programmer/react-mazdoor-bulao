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

function ReviewDialog(props) {
  const { order, open, setOpen } = props;

  const {
    mutate: mutateSendReview,
    isSuccess: isSuccessReview,
    isError: isErrorReview
  } = useSendReview();

  const [rating, setRating] = useState(null);
  const reviewText = useRef();

  useEffect(() => {
    if (isSuccessReview) {
      setOpen(false);
    }
  }, [isSuccessReview, setOpen]);

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
  };

  return (
    <>
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        onFormSubmit={onSubmit}
        headline="Rate Order"
        content={
          <>
            <Typography variant="h6">Rate this order</Typography>

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
              maxRows={3}
              fullWidth
              label="Write a Review"
              autoComplete="off"
              type="text"
              inputRef={reviewText}
            />
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

ReviewDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(ReviewDialog)
);
