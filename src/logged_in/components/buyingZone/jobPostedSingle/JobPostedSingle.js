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
  Avatar,
  Divider,
  Container
} from "@material-ui/core";
import format from "date-fns/format";
import {
  jobStatusCodes,
  jobStatusStrings
} from "../../../../config/enums/jobStatus";
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
import ChangeStatusDialog from "./ChangeStatusDialog";
import ReadMoreReact from "read-more-react";
import { toast } from "react-toastify";

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
  // }import { toast } from 'react-toastify';

  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  },
  categoryName: {
    borderRadius: 50,
    padding: "4px 10px 4px 10px",
    backgroundColor: "#f2f2f2",
    marginRight: 10
  },
  bidDetails: {
    "& > *": {
      marginTop: 5,
      marginBottom: 5
    }
  }
});

function JobPostedSingle(props) {
  const { classes } = props;
  const jobId = props.location?.state?.jobId;
  console.log("reached");
  const {
    data: job,
    isLoading: isJobLoading,
    isError: isJobError
  } = useJobPosted(jobId);

  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const {
    mutate: mutateStartOrder,
    isSuccess: orderStarted,
    isError: orderError
  } = useStartOrder();

  let selectedBid = null;
  const history = useHistory();
  const globalClasses = useGlobalClasses();

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
      toast.success("Order has been started successfully!");
    } else if (orderError) {
      toast.error("An error occured while starting order! Please try again!");
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
      <Container maxWidth="md">
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          style={{ marginBottom: 30 }}
        >
          <Grid item xs={6}>
            <Typography variant="h4">Job Details</Typography>
          </Grid>

          <Grid item xs={6}>
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
                    history.push(`/user/jobs_posted/single_job/edit`, {
                      job: job
                    });
                  }}
                  disabled={job?.status == jobStatusCodes.JOB_COMPLETED}
                >
                  Edit this Job
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="Secondary"
                  onClick={() => {
                    setOpenStatusDialog(true);
                  }}
                  disabled={job?.status === jobStatusCodes.JOB_COMPLETED}
                >
                  Change Status
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {isJobLoading ? (
            <BoxCircularProgress />
          ) : isJobError ? (
            <span>
              An error occured while loading job. Please try reloading the page!
            </span>
          ) : (
            <>
              <Grid item xs={12}>
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

                  <Typography
                    variant="subtitle1"
                    className={globalClasses.mb_10}
                  >
                    Est. Budget: RS {job.budget} - Posted:{" "}
                    {formatDistance(
                      subDays(new Date(job.created_at), 0),
                      new Date(),
                      { addSuffix: true }
                    )}
                    {" - Est. time: "} {job.deadline} days
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    className={globalClasses.mb_10}
                  >
                    Bids: {job?.no_of_bids}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className={globalClasses.mb_10}
                  >
                    Job Status: {jobStatusStrings[job?.status]}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    className={globalClasses.mb_10}
                  >
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
                      <Typography
                        variant="body1"
                        className={globalClasses.mb_20}
                      >
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
              {job?.bids.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h3">Bids</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={3}>
                  {job.bids?.map((bid) => (
                    <>
                      <Grid item xs={6}>
                        <Card
                          className={[classes.card, classes.bidDetails].join(
                            " "
                          )}
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
                            <i>Posted By:</i>{" "}
                            <span style={{ float: "right" }}>
                              {bid.offered_by?.name}
                            </span>
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
                              let chatId = bid.offered_by.id;
                              setChatUserId(chatId);
                              mutateAddInChat(chatId);
                            }}
                          >
                            Open Chat
                          </Button>
                          {!bid.status == bidStatusCodes.ACCEPTED && (
                            <Button
                              color="secondary"
                              variant="contained"
                              style={{ float: "right" }}
                              onClick={() => {
                                selectedBid = bid;
                                startOrder();
                              }}
                              disabled={
                                job.status == jobStatusCodes.JOB_COMPLETED
                              }
                            >
                              Hire This Person
                            </Button>
                          )}
                          {bid?.order && (
                            <Button
                              color="secondary"
                              variant="contained"
                              style={{ float: "right" }}
                              onClick={() => {
                                history.push(
                                  "/user/buying_orders/single_order",
                                  {
                                    orderId: bid.order.id
                                  }
                                );
                              }}
                            >
                              Order Details
                            </Button>
                          )}
                        </Card>
                      </Grid>
                    </>
                  ))}
                </Grid>
              </Grid>
            </>
          )}
          {openStatusDialog && (
            <ChangeStatusDialog
              open={openStatusDialog}
              setOpen={setOpenStatusDialog}
              job={job}
            />
          )}
        </Grid>
      </Container>
    </Box>
  );
}

JobPostedSingle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(JobPostedSingle)
);
