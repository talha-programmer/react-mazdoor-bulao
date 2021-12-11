import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Grid,
  Box,
  withWidth,
  withStyles,
  Typography,
  Card,
  Button,
  Container
} from "@material-ui/core";
import format from "date-fns/format";
import { jobStatusStrings } from "../../../../config/enums/jobStatus";
import useJob from "../../../../hooks/jobs/useJob";
import {
  bidStatusCodes,
  bidStatusStrings
} from "../../../../config/enums/bidStatus";
import { useHistory } from "react-router-dom";
import useStartOrder from "../../../../hooks/orders/useStartOrder";
import useOrder from "../../../../hooks/orders/useOrder";
import {
  orderStatusCodes,
  orderStatusStrings
} from "../../../../config/enums/orderStatus";
import useOrderReviews from "../../../../hooks/review/useOrderReviews";
import OrderConfirmDialog from "./OrderConfirmDialog";
import { Rating } from "@material-ui/lab";
import {
  reviewTypesCodes,
  reviewTypesStrings
} from "../../../../config/enums/reviewTypes";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";
import smoothScrollTop from "../../../../shared/functions/smoothScrollTop";
import ReviewDialog from "./ReviewDialog";

const styles = (theme) => ({
  // blogContentWrapper: {
  //   marginLeft: theme.spacing(1),
  //   marginRight: theme.spacing(1),
  //   [theme.breakpoints.up("sm")]: {
  //     marginLeft: theme.spacing(4),
  //     marginRight: theme.spacing(4)
  //   },
  //   maxWidth: 1280,
  //   width: "100%"
  // },
  // wrapper: {
  //   minHeight: "60vh"
  // },
  // noDecoration: {
  //   textDecoration: "none !important"
  // }

  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function SellingOrderSingle(props) {
  const { classes } = props;
  const orderId = props.location?.state?.orderId;
  const { data: order, isLoading, isError } = useOrder(orderId);
  const history = useHistory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const {
    data: orderReviews,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    isFetched: reviewsFetched
  } = useOrderReviews(orderId);

  useEffect(smoothScrollTop, [smoothScrollTop]);

  const [buyerReview, setBuyerReview] = useState();
  const [workerReview, setWorkerReview] = useState();

  useEffect(() => {
    if (reviewsFetched) {
      let buyerReview = orderReviews.filter((review) => {
        return review.review_type == reviewTypesCodes.FROM_BUYER_TO_WORKER;
      });
      if (buyerReview.length > 0) {
        buyerReview = buyerReview[0];
        setBuyerReview(buyerReview);
      }
      let workerReview = orderReviews.filter((review) => {
        return review.review_type == reviewTypesCodes.FROM_WORKER_TO_BUYER;
      });
      if (buyerReview.length > 0) {
        workerReview = workerReview[0];
        setWorkerReview(workerReview);
      }
    }
  }, [orderReviews, reviewsFetched]);

  return (
    <Box display="flex" justifyContent="center">
      <Container maxWidth="md">
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          style={{ marginBottom: 30 }}
        >
          <Grid item xs={6}>
            <Typography variant="h4">Selling Order</Typography>
          </Grid>

          <Grid item xs={6}>
            {!isLoading && (
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                spacing={2}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="Secondary"
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                    disabled={order?.status === orderStatusCodes.COMPLETED}
                  >
                    Mark as Complete
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    color="Secondary"
                    onClick={() => {
                      setReviewDialogOpen(true);
                    }}
                    disabled={order?.buyer_reviewed}
                  >
                    Rate this Order
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {isLoading ? (
            <BoxCircularProgress />
          ) : (
            <>
              <Grid item xs={12}>
                <Card className={classes.card}>
                  <Typography variant="h5">Order Details</Typography>
                  <Typography variant="body1">
                    Buyer: {order.buyer.name}
                  </Typography>
                  <Typography variant="body1">
                    Order Status: {orderStatusStrings[order.status]}
                  </Typography>
                  <Typography variant="body1">
                    Starting Time:{" "}
                    {format(new Date(order.starting_time), "PPP", {
                      awareOfUnicodeTokens: true
                    })}
                  </Typography>
                  {order.ending_time && (
                    <Typography variant="body1">
                      Ending Time:{" "}
                      {format(new Date(order.ending_time), "PPP", {
                        awareOfUnicodeTokens: true
                      })}
                    </Typography>
                  )}
                  <Typography variant="h5">Bid Details</Typography>
                  <Typography variant="body1">{order.bid.details}</Typography>
                  <Typography variant="h5">Job Details</Typography>
                  <Typography variant="h6">{order.job.title}</Typography>
                  <Typography variant="body1">{order.job.details}</Typography>
                </Card>
              </Grid>

              {(buyerReview || workerReview) && (
                <Grid item xs={12}>
                  <Typography variant="h3">Reviews</Typography>
                </Grid>
              )}

              {buyerReview && (
                <Grid item xs={12}>
                  <Card className={classes.card}>
                    <Typography variant="h5">Buyer Review</Typography>

                    <Typography variant="body2">
                      {buyerReview?.review_text}
                    </Typography>

                    <Rating value={buyerReview.rating} disabled={true} />
                  </Card>
                </Grid>
              )}
              {workerReview && (
                <Grid item xs={12}>
                  <Card className={classes.card}>
                    <Typography variant="h5">Worker Review</Typography>

                    <Typography variant="body2">
                      {workerReview?.review_text}
                    </Typography>

                    <Rating value={workerReview.rating} disabled={true} />
                  </Card>
                </Grid>
              )}
            </>
          )}
          {dialogOpen && (
            <OrderConfirmDialog
              order={order}
              open={dialogOpen}
              setOpen={setDialogOpen}
            />
          )}
          {reviewDialogOpen && (
            <ReviewDialog
              order={order}
              open={reviewDialogOpen}
              setOpen={setReviewDialogOpen}
            />
          )}
        </Grid>
      </Container>
    </Box>
  );
}

SellingOrderSingle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(SellingOrderSingle)
);
