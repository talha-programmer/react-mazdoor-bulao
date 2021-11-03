import React, { useEffect } from "react";
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
import usePostedJobs from "../../../../hooks/user/usePostedJobs";
import { jobStatusStrings } from "../../../../config/enums/jobStatus";
import { useHistory } from "react-router";
import useSellingOrders from "../../../../hooks/orders/useSellingOrders";

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
  // }import useAppliedJobs from '../../../hooks/user/useAppliedJobs';

  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function SellingOrders(props) {
  const { classes, selectSellingOrders } = props;
  const { data: sellingOrders, isLoading, isError } = useSellingOrders();
  const history = useHistory();

  useEffect(selectSellingOrders, [selectSellingOrders]);

  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          sellingOrders.map((order) => (
            <Grid item xs={8}>
              <Card className={classes.card}>
                <Typography variant="h5">Buyer: {order.buyer.name}</Typography>
                <Typography variant="body2">
                  Starting Time:
                  {format(new Date(order.starting_time), "PPP", {
                    awareOfUnicodeTokens: true
                  })}
                </Typography>
                <Typography variant="body2">
                  Bid: {order.bid.details}
                </Typography>
                <Typography variant="body2"></Typography>
                <Typography variant="body2">
                  Job: {order.job.details}
                </Typography>

                {/* <Button
                  onClick={() => {
                    history.push(`/user/jobs_posted/${job.url}`);
                  }}
                >
                  Job Details
                </Button> */}
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

SellingOrders.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(SellingOrders)
);
