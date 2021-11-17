import React, { useState } from "react";
import { Box, Card, withStyles, withWidth } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import classNames from "classnames";
import useWorkerProfile from "../../../../hooks/workerProfile/useWorkerProfile";
import { useHistory } from "react-router-dom";
import { Rating } from "@material-ui/lab";
import { reviewTypesStrings } from "../../../../config/enums/reviewTypes";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

const WorkerProfile = ({ classes }) => {
  const { data: workerProfile, isLoading, isError } = useWorkerProfile();
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const history = useHistory();
  return (
    <Box
      display="flex"
      justifyContent="center"
      //className={classNames("lg-p-top")}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {isLoading ? (
          <BoxCircularProgress />
        ) : isError ? (
          <span>Error Occurred</span>
        ) : (
          <>
            <Grid item xs={8}>
              <Card className={classes.card}>
                <Button
                  onClick={() => {
                    history.push("/user/create_worker_profile");
                  }}
                >
                  {workerProfile ? "Edit Profile" : "Create Profile"}
                </Button>
                <Typography variant="h6">
                  {workerProfile?.description}
                </Typography>
                <Typography variant="body2">
                  {workerProfile?.skills.map((skill) => {
                    return skill.name + ", ";
                  })}
                </Typography>
                <Typography variant="h6">Overall Rating</Typography>

                <Rating
                  value={workerProfile?.rating}
                  precision={0.5}
                  disabled={true}
                />
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h2">Reviews</Typography>
            </Grid>

            {workerProfile?.reviews.map((review) => (
              <Grid item xs={8}>
                <Card className={classes.card}>
                  <Typography variant="body2">
                    Given By: {review?.given_by?.name}
                  </Typography>
                  <Typography variant="body2">{review?.review_text}</Typography>
                  <Typography variant="body2">
                    Review Type: {reviewTypesStrings[review?.review_type]}
                  </Typography>
                  <Rating value={review.rating} disabled={true} />
                </Card>
              </Grid>
            ))}
          </>
        )}
        {/* {openBidDialog && (
          <CreateBid
            job={job}
            open={openBidDialog}
            setOpen={setOpenBidDialog}
          />
        )} */}
      </Grid>
    </Box>
  );
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(WorkerProfile)
);
