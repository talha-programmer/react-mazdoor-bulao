import React, { useCallback, useEffect, useState } from "react";
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
  Avatar
} from "@material-ui/core";
import format from "date-fns/format";
import { jobStatusStrings } from "../../../../config/enums/jobStatus";
import {
  bidStatusCodes,
  bidStatusStrings
} from "../../../../config/enums/bidStatus";
import { useHistory } from "react-router-dom";
import useStartOrder from "../../../../hooks/orders/useStartOrder";
import { useQueryClient } from "react-query";
import queryKeys from "../../../../config/queryKeys";
import useAddInChat from "../../../../hooks/chat/useAddInChat";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";
import alertSeverity from "../../../../config/alertSeverity";
import SnackAlert from "../../../../shared/components/SnackAlert";
import smoothScrollTop from "../../../../shared/functions/smoothScrollTop";
import useJobPosted from "../../../../hooks/jobs/useJobPosted";
import useGlobalClasses from "../../../../hooks/style/useGlobalClasses";
import ReactImageGallery from "react-image-gallery";
import { formatDistance, subDays } from "date-fns";
import { LocationOn } from "@material-ui/icons";

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
  categoryName: {
    borderRadius: 50,
    padding: "4px 10px 4px 10px",
    backgroundColor: "#f2f2f2",
    marginRight: 10
  }
});

function JobPostedSingle(props) {
  const { classes, jobId } = props;
  const {
    data: job,
    isLoading: isJobLoading,
    isError: isJobError
  } = useJobPosted(jobId);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState();
  const {
    mutate: mutateStartOrder,
    isSuccess: orderStarted,
    isError: orderError
  } = useStartOrder();

  let selectedBid = null;
  const history = useHistory();
  const globalClasses = useGlobalClasses();

  //const allowedChats = useQueryClient().getQueryData(queryKeys.chatUsers);
  const [chatUserId, setChatUserId] = useState();

  const {
    mutate: mutateAddInChat,
    isSuccess: isChatMtSuccess,
    isError: isChatMtError
  } = useAddInChat();

  useEffect(smoothScrollTop, [smoothScrollTop]);

  let images = [];

  job?.images?.forEach((image) => {
    const singleImage = {
      original: image.image_url,
      thumbnail: image.image_thumbnail_url
    };
    images.push(singleImage);
  });

  const startOrder = () => {
    const order = {
      job_bid_id: selectedBid.id,
      job_id: job.id
    };

    mutateStartOrder(order);
  };

  useEffect(() => {
    if (orderStarted) {
      setSnackMessage("Order has been started successfully!");
      setSnackSeverity(alertSeverity.success);
      setSnackOpen(true);
    } else if (orderError) {
      setSnackMessage(
        "An error occured while starting order! Please try again!"
      );
      setSnackSeverity(alertSeverity.error);
      setSnackOpen(true);
    }
  }, [orderError, orderStarted]);

  useEffect(() => {
    if (isChatMtSuccess) {
      history.push("/user/chat", {
        selectedUserId: chatUserId
      });
    }
  }, [history, isChatMtSuccess, chatUserId]);

  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {snackOpen && (
          <SnackAlert message={snackMessage} severity={snackSeverity} />
        )}
        {isJobLoading ? (
          <BoxCircularProgress />
        ) : isJobError ? (
          <span>
            An error occured while loading job. Please try reloading the page!
          </span>
        ) : (
          <>
            <Grid item xs={8}>
              {images.length > 0 && (
                <>
                  <ReactImageGallery items={images} />
                  <br />
                </>
              )}
              <Card className={classes.card}>
                <Typography variant="h5" className={globalClasses.mb_10}>
                  {job.title}
                </Typography>

                <Typography variant="subtitle1" className={globalClasses.mb_10}>
                  Est. Budget: RS {job.budget} - Posted:{" "}
                  {formatDistance(
                    subDays(new Date(job.created_at), 0),
                    new Date(),
                    { addSuffix: true }
                  )}
                  {" - Est. time: "} {job.deadline} days
                </Typography>

                <Typography variant="subtitle2" className={globalClasses.mb_10}>
                  Bids: {job?.no_of_bids}
                </Typography>

                <Typography variant="subtitle2" className={globalClasses.mb_10}>
                  <LocationOn />
                  {job.location}
                </Typography>

                <Typography variant="h6" className={globalClasses.mb_5}>
                  Details
                </Typography>
                <Typography variant="body1" className={globalClasses.mb_10}>
                  {job.details}
                </Typography>

                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="h6" className={globalClasses.mb_5}>
                      Skills Required
                    </Typography>
                    <Typography variant="body1" className={globalClasses.mb_20}>
                      {job?.categories?.map((category) => (
                        <span className={classes.categoryName}>
                          {category.name}
                        </span>
                      ))}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h2">Bids</Typography>
            </Grid>
            {job.bids?.map((bid) => (
              <Grid item xs={8}>
                <Card className={classes.card}>
                  <Typography variant="h5">
                    Posted By: {bid.offered_by?.name}
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(bid.created_at), "PPP", {
                      awareOfUnicodeTokens: true
                    })}
                  </Typography>
                  <Typography variant="body2">
                    Offered Amount: RS {bid.offered_amount}
                  </Typography>
                  <Typography variant="body2">
                    Completion Time: {bid.completion_time} days
                  </Typography>
                  <Typography variant="body2">
                    Bid Status: {bidStatusStrings[bid.status]}
                  </Typography>
                  <Typography variant="body2">{bid.details}</Typography>
                  <Button
                    onClick={() => {
                      let chatId = bid.offered_by.id;
                      setChatUserId(chatId);
                      mutateAddInChat(chatId);
                    }}
                  >
                    Open Chat
                  </Button>
                  <Button
                    onClick={() => {
                      selectedBid = bid;
                      startOrder();
                    }}
                    disabled={bid.status === bidStatusCodes.ACCEPTED}
                  >
                    {bid.status === bidStatusCodes.ACCEPTED
                      ? "Hired"
                      : "Hire This Person"}
                  </Button>
                </Card>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Box>
  );
}

JobPostedSingle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(JobPostedSingle)
);
