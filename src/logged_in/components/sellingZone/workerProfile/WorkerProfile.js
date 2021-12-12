import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  TextField,
  withStyles,
  withWidth
} from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import classNames from "classnames";
import useWorkerProfile from "../../../../hooks/workerProfile/useWorkerProfile";
import { useHistory } from "react-router-dom";
import { Autocomplete, Rating } from "@material-ui/lab";
import { reviewTypesStrings } from "../../../../config/enums/reviewTypes";
import BoxCircularProgress from "../../../../shared/components/BoxCircularProgress";
import useSaveWorkerProfile from "../../../../hooks/workerProfile/useSaveWorkerProfile";
import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import useJobCategories from "../../../../hooks/jobs/useJobCategories";
import alertSeverity from "../../../../config/alertSeverity";
import SnackAlert from "../../../../shared/components/SnackAlert";

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
  const { user } = useContext(AuthContext);

  const description = useRef();

  const [selectedSkills, setselectedSkills] = useState(
    workerProfile?.skills.map((skill) => skill.id).toString()
  );

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState();
  const [snackMessage, setSnackMessage] = useState("");
  const {
    mutate,
    isSuccess,
    isLoading: isSaveProfileLoading
  } = useSaveWorkerProfile();

  // Job categories are used here as worker skills
  const { data: workerSkills, isLoading: categoriesLoading } =
    useJobCategories();

  const onSubmit = (e) => {
    e.preventDefault();

    const profile = {
      description: description.current.value,
      skills: selectedSkills,
      worker_profile_id: workerProfile?.id
    };

    mutate(profile);
  };

  useEffect(() => {
    if (isSuccess) {
      setSnackMessage("Profile saved successfully!");
      setSnackSeverity(alertSeverity.success);
      setSnackOpen(true);
    } else if (isError) {
      setSnackMessage(
        "An error occured while saving the profile! Please try again!"
      );
      setSnackSeverity(alertSeverity.error);
      setSnackOpen(true);
    }
  }, [isError, isSuccess]);
  return (
    <Box
      display="flex"
      justifyContent="center"
      //className={classNames("lg-p-top")}
    >
      <Container maxWidth="md">
        {snackOpen && (
          <SnackAlert
            message={snackMessage}
            severity={snackSeverity}
            handleClose={() => {
              setSnackOpen(false);
            }}
          />
        )}
        <Typography style={{ marginBottom: 30 }} variant="h4">
          Worker Profile
        </Typography>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {isLoading || categoriesLoading ? (
            <BoxCircularProgress />
          ) : isError ? (
            <span>Error Occurred</span>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid item lg={4} md={6} xs={12}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        <Avatar
                          src={user.profile_image?.image_thumbnail_url}
                          style={{
                            height: 100,
                            marginBottom: 2,
                            width: 100
                          }}
                        />
                        <Typography
                          color="textPrimary"
                          gutterBottom
                          variant="h5"
                        >
                          {user.name}
                        </Typography>

                        <Typography color="textSecondary" variant="body2">
                          {`${user.email}`}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          {user.location != "null" && user.location}
                        </Typography>
                        <Rating
                          value={workerProfile.rating}
                          disabled={true}
                          precision={0.5}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item lg={8} md={6} xs={12}>
                  <form autoComplete="off">
                    <Card>
                      <CardHeader
                        subheader="The information can be edited"
                        title="Worker Profile"
                      />
                      <Divider />
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item md={12} xs={12}>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              multiline
                              minRows={4}
                              maxRows={5}
                              fullWidth
                              label="Description"
                              placeholder="Briefly describe about your skills and working qualities"
                              autoComplete="off"
                              type="text"
                              FormHelperTextProps={{ error: true }}
                              inputRef={description}
                              defaultValue={workerProfile?.description}
                            />
                          </Grid>
                          <Grid item md={12}>
                            <Autocomplete
                              multiple
                              options={workerSkills}
                              disableCloseOnSelect
                              getOptionLabel={(option) => option.name}
                              filterSelectedOptions
                              renderOption={(option, props) => {
                                return <li {...props}>{option.name}</li>;
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Skills"
                                  placeholder="Skills"
                                  variant="outlined"
                                />
                              )}
                              onChange={(event, newValue) => {
                                // Get only ids of selected categories
                                setselectedSkills(
                                  newValue.map((skill) => skill.id).toString()
                                );
                              }}
                              defaultValue={workerProfile?.skills}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          p: 2
                        }}
                      >
                        <Button
                          color="secondary"
                          type="submit"
                          onClick={onSubmit}
                          variant="contained"
                        >
                          Save details
                        </Button>
                      </Box>
                    </Card>
                  </form>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h4">Reviews</Typography>
              </Grid>

              {workerProfile?.reviews.map((review) => (
                <Grid item xs={4}>
                  <Card className={classes.card}>
                    <Typography variant="h6">
                      By: {review?.given_by?.name}
                    </Typography>
                    <Rating value={review.rating} disabled={true} />
                    <Typography variant="body2">
                      {review?.review_text}
                    </Typography>
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
      </Container>
    </Box>
  );
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(WorkerProfile)
);
