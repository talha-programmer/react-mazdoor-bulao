import React, { useEffect, useState } from "react";
import useJob from "../../../hooks/jobs/useJob";
import {
  Avatar,
  Box,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  withStyles,
  withWidth
} from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import format from "date-fns/format";
import { Button } from "@material-ui/core";
import CreateBid from "../../../logged_in/components/sellingZone/createBid/CreateBid";
import useAppliedJobs from "../../../hooks/user/useAppliedJobs";
import classNames from "classnames";
import "react-image-gallery/styles/css/image-gallery.css";
import ReactImageGallery from "react-image-gallery";
import BoxCircularProgress from "../../../shared/components/BoxCircularProgress";
import smoothScrollTop from "../../../shared/functions/smoothScrollTop";
import { LocationOn, Phone, PhoneAndroidRounded } from "@material-ui/icons";
import { formatDistance, subDays } from "date-fns";
import useGlobalClasses from "../../../hooks/style/useGlobalClasses";
import { Rating } from "@material-ui/lab";

const styles = (theme) => ({
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

const SingleJob = ({ jobId, classes }) => {
  const { data: job, isLoading, isError } = useJob(jobId);
  const { data: appliedJobs } = useAppliedJobs();
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const globalClasses = useGlobalClasses();

  let images = [];

  job?.images.forEach((image) => {
    const singleImage = {
      original: image.image_url,
      thumbnail: image.image_thumbnail_url
    };
    images.push(singleImage);
  });

  useEffect(smoothScrollTop, [smoothScrollTop]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      className={classNames("lg-p-top")}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {isLoading ? (
          <BoxCircularProgress />
        ) : isError ? (
          <span>Error Occurred</span>
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
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="h5" className={globalClasses.mb_10}>
                      {job.title}
                    </Typography>
                  </Grid>

                  <Grid item>
                    {appliedJobs && !(job.id in appliedJobs) && (
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => {
                          setOpenBidDialog(true);
                        }}
                      >
                        Bid on this job
                      </Button>
                    )}
                  </Grid>
                </Grid>

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

                  <Grid item>
                    <Typography variant="h6" className={globalClasses.mb_5}>
                      Posted By
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item>
                        <Avatar
                          style={{ height: 65, width: 65 }}
                          src={
                            job.posted_by?.profile_image?.image_thumbnail_url
                          }
                          alt={job.posted_by?.name}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="body1">
                          {job.posted_by.name} <br />
                          {job.posted_by.phone_number && (
                            <>
                              Ph. No: +{job?.posted_by?.phone_number} <br />
                            </>
                          )}
                          <Rating
                            value={job?.buyer_profile.rating}
                            precision={0.5}
                            disabled={true}
                          />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </>
        )}
        {openBidDialog && (
          <CreateBid
            job={job}
            open={openBidDialog}
            setOpen={setOpenBidDialog}
          />
        )}
      </Grid>
    </Box>
  );
};

export default withWidth()(withStyles(styles, { withTheme: true })(SingleJob));
