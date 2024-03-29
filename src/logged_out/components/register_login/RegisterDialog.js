import React, {
  useState,
  useCallback,
  useRef,
  Fragment,
  useContext
} from "react";
import PropTypes from "prop-types";
import {
  FormHelperText,
  TextField,
  Button,
  Checkbox,
  Typography,
  FormControlLabel,
  withStyles
} from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField";
import axios from "axios";
import api from "../../../config/api";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../../../context/AuthContext";
import { QueryClient, useQueryClient } from "react-query";
import queryKeys from "../../../config/queryKeys";
import { userTypesCodes } from "../../../config/enums/userTypes";

const styles = (theme) => ({
  link: {
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut
    }),
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:enabled:hover": {
      color: theme.palette.primary.dark
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark
    }
  }
});

function RegisterDialog(props) {
  const {
    setStatus,
    history,
    theme,
    onClose,
    //openTermsDialog,
    status,
    classes
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  //const [hasTermsOfServiceError, setHasTermsOfServiceError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  //const registerTermsCheckbox = useRef();
  const registerPassword = useRef();
  const registerPasswordRepeat = useRef();
  const registerFullName = useRef();
  const registerUsername = useRef();
  const registerEmail = useRef();
  const { setToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const register = useCallback(() => {
    // if (!registerTermsCheckbox.current.checked) {
    //   setHasTermsOfServiceError(true);
    //   return;
    // }
    if (
      registerPassword.current.value !== registerPasswordRepeat.current.value
    ) {
      setStatus(status + "|passwordsDontMatch");
      return;
    }
    if (!registerUsername.current.value.match(/^[a-zA-Z0-9_.-]+$/)) {
      setStatus(status + "|invalidUsername");
      return;
    }

    const data = {
      name: registerFullName.current.value,
      username: registerUsername.current.value,
      email: registerEmail.current.value,
      password: registerPassword.current.value,
      password_confirmation: registerPasswordRepeat.current.value
    };

    axios
      .post(api.register, data)
      .then((result) => {
        if (result.data.user) {
          Cookies.set("loginToken", result.data.login_token, { expires: 1 });
          setToken(result.data.login_token);
          queryClient.invalidateQueries(queryKeys.user);
          const userType = result.data.user.user_type;
          if (userType == userTypesCodes.ADMIN) {
            history.push("/admin/users");
          } else {
            history.push("/");
          }
          onClose();
        }
      })
      .catch((error) => {
        const errors = error?.response?.data.errors;

        let errorStatus = "";
        if (errors.email) {
          errorStatus += "|invalidEmail";
        }
        if (errors.username) {
          errorStatus += "|usedUsername";
        }

        setStatus(status + errorStatus);
      })
      .finally(() => setIsLoading(false));

    setStatus("");
    setIsLoading(true);
  }, [setStatus, status, setToken, history, onClose]);

  return (
    <FormDialog
      loading={isLoading}
      onClose={onClose}
      open
      headline="Register"
      onFormSubmit={(e) => {
        e.preventDefault();
        register();
      }}
      hideBackdrop
      hasCloseIcon
      content={
        <Fragment>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={status.includes("invalidName")}
            label="Full Name"
            autoFocus
            autoComplete="off"
            type="text"
            onChange={() => {
              if (status.includes("invalidName")) {
                setStatus(status.replace(/invalidName/g, ""));
              }
            }}
            inputRef={registerFullName}
            FormHelperTextProps={{ error: true }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={
              status.includes("usedUsername") ||
              status.includes("invalidUsername")
            }
            label="Username"
            autoComplete="off"
            type="username"
            onChange={() => {
              if (
                status.includes("usedUsername") ||
                status.includes("invalidUsername")
              ) {
                setStatus(
                  status
                    .replace(/usedUsername/g, "")
                    .replace(/invalidUsername/g, "")
                );
              }
            }}
            inputRef={registerUsername}
            helperText={(() => {
              if (status.includes("usedUsername")) {
                return "This username is already used. Please try another one!";
              }
              if (status.includes("invalidUsername")) {
                return "Invalid Username. Only alphabets, digits, underscore(_), dash(-) and dot(.) are allowed in username with no white spaces!";
              }
              return null;
            })()}
            FormHelperTextProps={{ error: true }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={status.includes("invalidEmail")}
            label="Email Address"
            autoComplete="off"
            type="email"
            onChange={() => {
              if (status.includes("invalidEmail")) {
                setStatus(status.replace(/invalidEmail/g, ""));
              }
            }}
            inputRef={registerEmail}
            helperText={(() => {
              if (status.includes("invalidEmail")) {
                return "This email is already registered. Please use another one!";
              }
              return null;
            })()}
            FormHelperTextProps={{ error: true }}
          />
          <VisibilityPasswordTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={
              status.includes("passwordTooShort") ||
              status.includes("passwordsDontMatch")
            }
            label="Password"
            inputRef={registerPassword}
            autoComplete="off"
            onChange={() => {
              if (
                status.includes("passwordTooShort") ||
                status.includes("passwordsDontMatch")
              ) {
                setStatus(
                  status
                    .replace("passwordTooShort", "")
                    .replace("passwordsDontMatch", "")
                );
              }
            }}
            helperText={(() => {
              if (status.includes("passwordTooShort")) {
                return "Create a password at least 6 characters long.";
              }
              if (status.includes("passwordsDontMatch")) {
                return "Your passwords dont match.";
              }
              return null;
            })()}
            FormHelperTextProps={{ error: true }}
            isVisible={isPasswordVisible}
            onVisibilityChange={setIsPasswordVisible}
          />
          <VisibilityPasswordTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={
              status.includes("passwordTooShort") ||
              status.includes("passwordsDontMatch")
            }
            label="Repeat Password"
            inputRef={registerPasswordRepeat}
            autoComplete="off"
            onChange={() => {
              if (
                status.includes("passwordTooShort") ||
                status.includes("passwordsDontMatch")
              ) {
                setStatus(
                  status
                    .replace("passwordTooShort", "")
                    .replace("passwordsDontMatch", "")
                );
              }
            }}
            helperText={(() => {
              if (status.includes("passwordTooShort")) {
                return "Create a password at least 6 characters long.";
              }
              if (status.includes("passwordsDontMatch")) {
                return "Your passwords dont match.";
              }
            })()}
            FormHelperTextProps={{ error: true }}
            isVisible={isPasswordVisible}
            onVisibilityChange={setIsPasswordVisible}
          />
          {/* <FormControlLabel
            style={{ marginRight: 0 }}
            control={
              <Checkbox
                color="primary"
                inputRef={registerTermsCheckbox}
                onChange={() => {
                  setHasTermsOfServiceError(false);
                }}
              />
            }
            label={
              <Typography variant="body1">
                I agree to the
                <span
                  className={classes.link}
                  onClick={isLoading ? null : openTermsDialog}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(event) => {
                    // For screenreaders listen to space and enter events
                    if (
                      (!isLoading && event.keyCode === 13) ||
                      event.keyCode === 32
                    ) {
                      openTermsDialog();
                    }
                  }}
                >
                  {" "}
                  terms of service
                </span>
              </Typography>
            }
          />
          {hasTermsOfServiceError && (
            <FormHelperText
              error
              style={{
                display: "block",
                marginTop: theme.spacing(-1)
              }}
            >
              In order to create an account, you have to accept our terms of
              service.
            </FormHelperText>
          )} */}
          {status.includes("accountCreated") && (
            <HighlightedInformation>
              We have created your account. Please click on the link in the
              email we have sent to you before logging in.
            </HighlightedInformation>
          )}
        </Fragment>
      }
      actions={
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          color="secondary"
          disabled={isLoading}
        >
          Register
          {isLoading && <ButtonCircularProgress />}
        </Button>
      }
    />
  );
}

RegisterDialog.propTypes = {
  theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  openTermsDialog: PropTypes.func.isRequired,
  status: PropTypes.string,
  setStatus: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withRouter(
  withStyles(styles, { withTheme: true })(RegisterDialog)
);
