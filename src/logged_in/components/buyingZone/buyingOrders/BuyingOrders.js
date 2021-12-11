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
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  MenuItem,
  Container
} from "@material-ui/core";
import format from "date-fns/format";
import { useHistory } from "react-router";
import useBuyingOrders from "../../../../hooks/orders/useBuyingOrders";
import useCompleteBuyingOrder from "../../../../hooks/orders/useCompleteBuyingOrder";
import {
  orderStatusCodes,
  orderStatusStrings
} from "../../../../config/enums/orderStatus";
import OrderConfirmDialog from "./OrderConfirmDialog";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";
import { Link } from "react-router-dom";
import DetailsIcon from "@material-ui/icons/OpenInNew";
import EditIcon from "@material-ui/icons/Edit";
import shortenString from "../../../../shared/functions/shortenString";

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
  const { data, isLoading, isError, isFetched } = useBuyingOrders();
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    mutate: mutateCompleteOrder,
    isLoading: loadingCompleteOrder,
    isError: errorCompleteOrder
  } = useCompleteBuyingOrder();

  useEffect(selectBuyingOrders, [selectBuyingOrders]);

  const [buyingOrders, setBuyingOrders] = useState();

  const [selectedOrderStatus, setSelectedOrderStatus] = useState(-1);
  let allOrderStatusOptions = [];

  useEffect(() => {
    if (isFetched) {
      setBuyingOrders(data);
    }
  }, [data, isFetched]);

  Object.keys(orderStatusStrings).forEach((key) => {
    const option = {
      value: key,
      label: orderStatusStrings[key]
    };
    allOrderStatusOptions.push(option);
  });

  useEffect(() => {
    if (selectedOrderStatus == -1) {
      setBuyingOrders(data);
    } else {
      let orders = data.filter((order) => {
        return order.status == selectedOrderStatus;
      });
      setBuyingOrders(orders);
    }
  }, [data, selectedOrderStatus]);

  function DisplayTable() {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Job</TableCell>
              <TableCell>Bid</TableCell>
              <TableCell>Worker</TableCell>
              <TableCell>Date Started</TableCell>
              <TableCell>Date Ended</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buyingOrders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell component="th" scope="row">
                  <Link
                    to={`/user/jobs_posted/${order.job.url}`}
                    style={{ textDecoration: "none" }}
                  >
                    {shortenString(order.job.title, 40)}
                  </Link>
                </TableCell>
                <TableCell>{shortenString(order.bid.details, 40)}</TableCell>
                <TableCell>{order.worker.name}</TableCell>

                <TableCell>
                  {format(new Date(order.starting_time), "do MMM, yyyy", {
                    awareOfUnicodeTokens: true
                  })}
                </TableCell>
                <TableCell>
                  {order.ending_time &&
                    format(new Date(order.ending_time), "do MMM, yyyy", {
                      awareOfUnicodeTokens: true
                    })}
                </TableCell>
                <TableCell>{orderStatusStrings[order.status]}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="View Details"
                    onClick={() => {
                      history.push("/user/buying_orders/single_order", {
                        orderId: order.id
                      });
                    }}
                  >
                    <DetailsIcon color="action" />
                  </IconButton>

                  {/* <IconButton
                    aria-label="Edit Order"
                    disabled={job.status === orderStatusCodes.JOB_COMPLETED}
                    onClick={() => {
                      history.push(`/user/jobs_posted/single_job/edit`, {
                        job: job
                      });
                    }}
                  >
                    <EditIcon color="secondary" />
                  </IconButton> */}

                  {/* <IconButton aria-label="Delete Job" onClick={() => {}}>
                    <DeleteIcon color="error" />
                  </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

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
            <Typography variant="h4">Buying Orders</Typography>
          </Grid>

          <Grid item xs={4}>
            <TextField
              select
              variant="outlined"
              fullWidth
              margin="normal"
              defaultValue={-1}
              onChange={(event) => {
                setSelectedOrderStatus(event.target.value);
              }}
            >
              <MenuItem key={-1} value={-1}>
                All Orders
              </MenuItem>
              {allOrderStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {isLoading ? (
            <BoxCircularProgress />
          ) : (
            <>
              <DisplayTable />
            </>
          )}
          {/* {dialogOpen && (
          <OrderConfirmDialog
            order={selectedOrder}
            open={dialogOpen}
            setOpen={setDialogOpen}
          />
        )} */}
        </Grid>
      </Container>
    </Box>
  );
}

BuyingOrders.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(BuyingOrders)
);
