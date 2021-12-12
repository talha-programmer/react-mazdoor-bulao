import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Box,
  withWidth,
  withStyles,
  TextField,
  Button,
  Typography,
  Container,
  Divider,
  CardActions,
  Avatar,
  Card,
  CardContent,
  CardHeader
} from "@material-ui/core";

import alertSeverity from "../../../config/alertSeverity";
import SnackAlert from "../../../shared/components/SnackAlert";
import useSaveUserProfile from "../../../hooks/user/useSaveUserProfile";
import ReactImageUploadComponent from "react-images-upload";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { AuthContext } from "../../../context/AuthContext";
import useUserProfile from "../../../hooks/user/useUserProfile";
import { Rating } from "@material-ui/lab";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function UserProfile(props) {
  //const { classes } = props;
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState();
  const [snackMessage, setSnackMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const location = useRef();
  const name = useRef();
  const [imageKey, setImageKey] = useState("key");

  const { user, reloadUser } = useContext(AuthContext);
  const { data: userProfile } = useUserProfile();

  const {
    mutate,
    isSuccess,
    isError,
    isLoading: isSaveProfileLoading
  } = useSaveUserProfile();

  const onSubmit = (e) => {
    e.preventDefault();
    const profile = new FormData();
    profile.append("phone_number", phoneNumber || "");
    profile.append("location", location?.current?.value);
    profile.append("name", name.current.value);

    if (profilePicture) {
      profile.append("profile_picture", ...profilePicture);
    }

    mutate(profile);
  };

  useEffect(() => {
    if (isSuccess) {
      setSnackMessage("Profile saved successfully!");
      setSnackSeverity(alertSeverity.success);
      setSnackOpen(true);
      setImageKey(imageKey + "x");
      reloadUser();
    } else if (isError) {
      setSnackMessage(
        "An error occured while saving the profile! Please try again!"
      );
      setSnackSeverity(alertSeverity.error);
      setSnackOpen(true);
    }
  }, [isError, isSuccess]); // Important: don't change

  return (
    <Box
      component="main"
      // sx={{
      //   flexGrow: 1,
      //   py: 8
      // }}
    >
      {snackOpen && (
        <SnackAlert
          message={snackMessage}
          severity={snackSeverity}
          handleClose={() => {
            setSnackOpen(false);
          }}
        />
      )}
      <Container maxWidth="md">
        <Typography style={{ marginBottom: 30 }} variant="h4">
          Your Profile
        </Typography>
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
                  <Typography color="textPrimary" gutterBottom variant="h5">
                    {user.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {`${user.email}`}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {user?.location != "null" && user.location}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card style={{ marginTop: 30 }}>
              <CardHeader title="Usage History" />
              <Divider />
              <CardContent>
                <Box
                  sx={{
                    //alignItems: "center",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <Typography color="textPrimary" variant="h6">
                    As Buyer
                  </Typography>
                  <Typography variant="body1">
                    Jobs Posted: {`${userProfile?.buyer_profile.jobs_posted}`}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Total Reviews:{" "}
                    {`${userProfile?.buyer_profile.total_reviews}`}
                  </Typography>
                  <Typography variant="body1">
                    <Rating
                      value={userProfile.buyer_profile?.rating}
                      disabled={true}
                    />
                  </Typography>

                  <Typography
                    color="textPrimary"
                    style={{ marginTop: 10 }}
                    variant="h6"
                  >
                    As Worker
                  </Typography>
                  <Typography variant="body1">
                    Orders Completed:{" "}
                    {`${userProfile?.worker_profile.orders_completed}`}
                  </Typography>

                  <Typography variant="body1">
                    Total Reviews:{" "}
                    {`${userProfile?.worker_profile.total_reviews}`}
                  </Typography>
                  <Typography variant="body1">
                    <Rating
                      value={userProfile.worker_profile?.rating}
                      disabled={true}
                    />
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={8} md={6} xs={12}>
            <form autoComplete="off">
              <Card>
                <CardHeader
                  subheader="The information can be edited"
                  title="Profile"
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <ReactImageUploadComponent
                        key={imageKey}
                        withIcon={true}
                        withPreview={true}
                        buttonText="Upload Profile Picture"
                        onChange={(pictureFile, pictureDataURLs) => {
                          setProfilePicture(pictureFile);
                        }}
                        imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                        maxFileSize={5242880} // 5mb
                        singleImage={true}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        required
                        defaultValue={user.name}
                        variant="outlined"
                        inputRef={name}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        required
                        value={user.username}
                        disabled={true}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        required
                        disabled={true}
                        value={user.email}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <PhoneInput
                        country={"pk"}
                        onlyCountries={["pk"]}
                        inputStyle={{
                          width: "100%",
                          backgroundColor: "transparent"
                        }}
                        value={user?.phone_number}
                        required
                        placeholder="+92 312-1234567"
                        isValid={(value, country) => {
                          if (value.match(/92[0-9]{10}/)) {
                            setPhoneNumber(value);
                            return true;
                          } else {
                            return "Please enter correct phone number";
                          }
                        }}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        required
                        defaultValue={user?.location}
                        variant="outlined"
                        inputRef={location}
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
      </Container>
    </Box>

    // <Box display="flex" justifyContent="center">
    //   {/* {isLoading ? (
    //     <BoxCircularProgress />
    //   ) : ( */}
    //   <Grid container spacing={3} justifyContent="center" alignItems="center">
    //
    //     <Grid item xs={6}>
    //       <ReactImageUploadComponent
    //         withIcon={true}
    //         withPreview={true}
    //         buttonText="Choose image"
    //         onChange={(pictureFile, pictureDataURLs) => {
    //           setProfilePicture(pictureFile);
    //         }}
    //         imgExtension={[".jpg", ".gif", ".png", ".gif"]}
    //         maxFileSize={5242880} // 5mb
    //         singleImage={true}
    //       />

    //

    //       <TextField
    //         variant="outlined"
    //         margin="normal"
    //         fullWidth
    //         label="Location"
    //         autoComplete="off"
    //         type="text"
    //         FormHelperTextProps={{ error: true }}
    //         inputRef={location}
    //         defaultValue={user?.location}
    //       />

    //       <Button
    //         type="submit"
    //         fullWidth
    //         variant="contained"
    //         color="secondary"
    //         disabled={isSaveProfileLoading}
    //         size="large"
    //         onClick={onSubmit}
    //         style={{
    //           marginTop: 20
    //         }}
    //       >
    //         Save
    //       </Button>
    //     </Grid>
    //   </Grid>
    //   {/* )} */}
    // </Box>
  );
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(UserProfile)
);
