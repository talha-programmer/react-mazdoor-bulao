import React from "react";
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
import useBuyingOrders from "../../../../hooks/orders/useBuyingOrders";

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

function BuyingOrders(props) {
  const { classes } = props;
  const { data: buyingOrders, isLoading, isError } = useBuyingOrders();
  const history = useHistory();

  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          buyingOrders.map((order) => (
            <Grid item xs={8}>
              <Card className={classes.card}>
                <Typography variant="h5">
                  Worker: {order.worker.name}
                </Typography>
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

BuyingOrders.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(BuyingOrders)
);
