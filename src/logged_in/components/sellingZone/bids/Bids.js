import React, { useEffect, useState } from "react";
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
import useBids from "../../../../hooks/bids/useBids";
import { bidStatusStrings } from "../../../../config/enums/bidStatus";

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

function Bids(props) {
  const { classes, selectBids } = props;
  const bidsQuery = useBids();
  //const [openBidDialog, setOpenBidDialog] = useState(false);
  const [bids, setBids] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(selectBids, [selectBids]);

  useEffect(() => {
    if (bidsQuery.isFetched) {
      setBids(bidsQuery.data);
      setLoading(false);
    }
  }, [bidsQuery.data, bidsQuery.isFetched]);

  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {loading ? (
          <span>Loading...</span>
        ) : (
          bids.map((bid) => (
            <Grid item xs={8}>
              <Card className={classes.card}>
                <Typography variant="h5">Job Title: {bid.job.title}</Typography>
                <Typography variant="body2">
                  {format(new Date(bid.created_at), "PPP", {
                    awareOfUnicodeTokens: true
                  })}
                </Typography>
                <Typography variant="body2">
                  Offered Amount: RS {bid.offered_amount}
                </Typography>
                <Typography variant="body2">
                  Completion Time {bid.completion_time} days
                </Typography>
                <Typography variant="body2">
                  Bid Status: {bidStatusStrings[bid.status]}
                </Typography>
                <Typography variant="body2">{bid.details}</Typography>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

Bids.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(Bids));
