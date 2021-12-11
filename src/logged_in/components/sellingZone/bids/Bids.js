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
  Button,
  Divider,
  Container
} from "@material-ui/core";
import format from "date-fns/format";
import useBids from "../../../../hooks/bids/useBids";
import {
  bidStatusCodes,
  bidStatusStrings
} from "../../../../config/enums/bidStatus";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";
import ReadMoreReact from "read-more-react";
import { useHistory } from "react-router-dom";

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
  },
  bidDetails: {
    "& > *": {
      marginTop: 5,
      marginBottom: 5
    }
  }
});

function Bids(props) {
  const { classes, selectBids } = props;
  const bidsQuery = useBids();
  //const [openBidDialog, setOpenBidDialog] = useState(false);
  const [bids, setBids] = useState();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(selectBids, [selectBids]);

  useEffect(() => {
    if (bidsQuery.isFetched) {
      setBids(bidsQuery.data);
      setLoading(false);
    }
  }, [bidsQuery.data, bidsQuery.isFetched]);

  return (
    <Box display="flex" justifyContent="center">
      <Container maxWidth="md">
        <Typography style={{ marginBottom: 30 }} variant="h4">
          Bids Created by You
        </Typography>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {loading ? (
            <BoxCircularProgress />
          ) : (
            <Grid item xs={12}>
              <Grid container justifyContent="center" spacing={3}>
                {bids.map((bid) => (
                  <>
                    <Grid item xs={6}>
                      <Card
                        className={[classes.card, classes.bidDetails].join(" ")}
                      >
                        <Typography
                          variant="subtitle2"
                          style={{
                            fontSize: "1.2em",
                            lineHeight: 1.2,
                            marginBottom: 10
                          }}
                        >
                          <ReadMoreReact
                            className={classes.readMore}
                            text={bid.details}
                            readMoreText={"more"}
                          />
                        </Typography>
                        <Divider />
                        <Typography variant="body1">
                          <i>Offered On: </i>
                          <span style={{ float: "right" }}>
                            {format(new Date(bid.created_at), "PPP", {
                              awareOfUnicodeTokens: true
                            })}
                          </span>
                        </Typography>
                        <Divider />
                        <Typography variant="body1">
                          <i>Offered Amount:</i>{" "}
                          <span style={{ float: "right" }}>
                            RS {bid.offered_amount}
                          </span>
                        </Typography>
                        <Divider />
                        <Typography variant="body1">
                          <i>Completion Time:</i>{" "}
                          <span style={{ float: "right" }}>
                            {bid.completion_time} days
                          </span>
                        </Typography>
                        <Divider />

                        <Typography variant="body1">
                          <i>Bid Status:</i>{" "}
                          <span style={{ float: "right" }}>
                            {bidStatusStrings[bid.status]}
                          </span>
                        </Typography>
                        <Divider />
                        <Button
                          variant="contained"
                          onClick={() => {
                            //let chatId = bid.offered_by.id;
                            history.push("/jobs/single_job", {
                              jobId: bid.job.id
                            });
                          }}
                        >
                          Job Details
                        </Button>

                        <Button
                          color="secondary"
                          variant="contained"
                          style={{ float: "right" }}
                          onClick={() => {
                            history.push("/user/selling_orders/single_order", {
                              orderId: bid?.order.id
                            });
                          }}
                          disabled={!bid.order}
                        >
                          Order Details
                        </Button>
                      </Card>
                    </Grid>
                  </>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

Bids.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(Bids));
