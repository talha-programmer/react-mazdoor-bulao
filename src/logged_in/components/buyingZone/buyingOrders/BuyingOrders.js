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
import { useHistory } from "react-router";
import useBuyingOrders from "../../../../hooks/orders/useBuyingOrders";
import useCompleteBuyingOrder from "../../../../hooks/orders/useCompleteBuyingOrder";
import { orderStatusStrings } from "../../../../config/enums/orderStatus";
import OrderConfirmDialog from "./OrderConfirmDialog";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";

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

function BuyingOrders(props) {
  const { classes, selectBuyingOrders } = props;
  const { data: buyingOrders, isLoading, isError } = useBuyingOrders();
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    mutate: mutateCompleteOrder,
    isLoading: loadingCompleteOrder,
    isError: errorCompleteOrder
  } = useCompleteBuyingOrder();

  useEffect(selectBuyingOrders, [selectBuyingOrders]);

  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {isLoading ? (
          <BoxCircularProgress />
        ) : (
          buyingOrders.map((order) => (
            <Grid item xs={8}>
              <Card className={classes.card}>
                <Typography variant="h5">
                  Worker: {order.worker?.name}
                </Typography>
                <Typography variant="body2">
                  Order Status: {orderStatusStrings[order.status]}
                </Typography>
                <Typography variant="body2">
                  Starting Time:{" "}
                  {format(new Date(order.starting_time), "PPP", {
                    awareOfUnicodeTokens: true
                  })}
                </Typography>
                {order.ending_time && (
                  <Typography variant="body2">
                    Ending Time:{" "}
                    {format(new Date(order.ending_time), "PPP", {
                      awareOfUnicodeTokens: true
                    })}
                  </Typography>
                )}
                <Typography variant="body2">
                  Bid: {order.bid.details}
                </Typography>
                <Typography variant="body2"></Typography>
                <Typography variant="body2">
                  Job: {order.job.details}
                </Typography>

                {/* <Button
                  onClick={() => {
                    // const orderToSend = {
                    //   order_id: order.id
                    // };
                    // mutateCompleteOrder(orderToSend);
                    setSelectedOrder(order);
                    setDialogOpen(true);
                  }}
                  disabled={order.status === orderStatusCodes.COMPLETED}
                >
                  Mark as Complete
                </Button> */}

                <Button
                  onClick={() => {
                    history.push("/user/buying_orders/single_order", {
                      orderId: order.id
                    });
                  }}
                >
                  Details
                </Button>
              </Card>
            </Grid>
          ))
        )}
        {/* {dialogOpen && (
          <OrderConfirmDialog
            order={selectedOrder}
            open={dialogOpen}
            setOpen={setDialogOpen}
          />
        )} */}
      </Grid>
    </Box>
  );
}

BuyingOrders.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(BuyingOrders)
);
