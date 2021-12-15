import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Box,
  withWidth,
  withStyles,
  TextField,
  Button
} from "@material-ui/core";

import alertSeverity from "../../../config/alertSeverity";
import SnackAlert from "../../../shared/components/SnackAlert";
import useSaveUserProfile from "../../../hooks/user/useSaveUserProfile";
import ReactImageUploadComponent from "react-images-upload";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const styles = (theme) => ({
  card: {
    boxShadow: theme.shadows[2],
    padding: 20
  }
});

function CreateUserProfile(props) {
  //const { classes } = props;
  const [profilePicture, setProfilePicture] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const location = useRef();

  const { user, reloadUser } = useContext(AuthContext);
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

    if (profilePicture) {
      profile.append("profile_picture", ...profilePicture);
    }

    mutate(profile);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile saved successfully!");
      reloadUser();
    } else if (isError) {
      toast.error(
        "An error occured while saving the profile! Please try again!"
      );
    }
  }, [isError, isSuccess]);

  return (
    <Box display="flex" justifyContent="center">
      {/* {isLoading ? (
        <BoxCircularProgress />
      ) : ( */}
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={6}>
          <ReactImageUploadComponent
            withIcon={true}
            withPreview={true}
            buttonText="Choose image"
            onChange={(pictureFile, pictureDataURLs) => {
              setProfilePicture(pictureFile);
            }}
            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
            maxFileSize={5242880} // 5mb
            singleImage={true}
          />

          <PhoneInput
            country={"pk"}
            onlyCountries={["pk"]}
            inputStyle={{ width: "100%", backgroundColor: "transparent" }}
            value={user.phone_number}
            // onChange={(phone) => {
            //   setPhoneNumber(phone);
            // }}
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

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Location"
            autoComplete="off"
            type="text"
            FormHelperTextProps={{ error: true }}
            inputRef={location}
            defaultValue={user?.location}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            disabled={isSaveProfileLoading}
            size="large"
            onClick={onSubmit}
            style={{
              marginTop: 20
            }}
          >
            Save
          </Button>
        </Grid>
      </Grid>
      {/* )} */}
    </Box>
  );
}

CreateUserProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(CreateUserProfile)
);
