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
  Button
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
import OrderConfirmDialog from "../buyingOrders/OrderConfirmDialog";
import { Rating } from "@material-ui/lab";
import { reviewTypesStrings } from "../../../../config/enums/reviewTypes";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";
import smoothScrollTop from "../../../../shared/functions/smoothScrollTop";
import ReviewDialog from "../buyingOrders/ReviewDialog";

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

function BuyingOrderSingle(props) {
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

  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {isLoading ? (
          <BoxCircularProgress />
        ) : (
          <>
            <Grid item xs={8}>
              <Card className={classes.card}>
                <Typography variant="h5">Order Details</Typography>
                <Typography variant="body1">
                  Worker: {order.worker.name}
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

                <Button
                  onClick={() => {
                    setDialogOpen(true);
                  }}
                  disabled={order.status === orderStatusCodes.COMPLETED}
                >
                  Mark as Complete
                </Button>
                <Button
                  onClick={() => {
                    setReviewDialogOpen(true);
                  }}
                  disabled={order.buyer_reviewed}
                >
                  Rate this Order
                </Button>
              </Card>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="h2">Reviews</Typography>
            </Grid>

            {!isReviewsLoading &&
              orderReviews.map((review) => (
                <Grid item xs={8}>
                  <Card className={classes.card}>
                    <Typography variant="body2">
                      Given By: {review?.given_by?.name}
                    </Typography>
                    <Typography variant="body2">
                      {review?.review_text}
                    </Typography>
                    <Typography variant="body2">
                      Review Type: {reviewTypesStrings[review?.review_type]}
                    </Typography>
                    <Rating value={review.rating} disabled={true} />
                  </Card>
                </Grid>
              ))}
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
    </Box>
  );
}

BuyingOrderSingle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(BuyingOrderSingle)
);
