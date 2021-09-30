import React, { useState, useCallback, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import {
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
import Cookies from "js-cookie";
import { useQueryClient } from "react-query";
import queryKeys from "../../../config/queryKeys";

const styles = (theme) => ({
  forgotPassword: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    cursor: "pointer",
    "&:enabled:hover": {
      color: theme.palette.primary.dark
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark
    }
  },
  disabledText: {
    cursor: "auto",
    color: theme.palette.text.disabled
  },
  formControlLabel: {
    marginRight: 0
  }
});

function LoginDialog(props) {
  const {
    setStatus,
    history,
    classes,
    onClose,
    openChangePasswordDialog,
    status
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginUsername = useRef();
  const loginPassword = useRef();
  const queryClient = useQueryClient();

  const login = useCallback(() => {
    setIsLoading(true);
    setStatus("");

    const username = loginUsername.current.value;
    const password = loginPassword.current.value;

    axios
      .post(api.login, { username, password })
      .then((result) => {
        const data = result.data;
        if (data.user) {
          setTimeout(() => {
            Cookies.set("loginToken", data.login_token, { expires: 1 }); // expires in 1 day

            queryClient.invalidateQueries(queryKeys.user);
            history.push("/user/dashboard");
          }, 150);
        }
      })
      .catch((error) => {
        const errors = error.response.data;

        let errorStatus = "";
        if (errors.invalidUsername) {
          errorStatus += "|invalidUsername";
        }
        if (errors.invalidPassword) {
          errorStatus += "|invalidPassword";
        }
        setStatus(status + errorStatus);
      })
      .finally(() => setIsLoading(false));
  }, [setStatus, queryClient, history, status]);

  return (
    <Fragment>
      <FormDialog
        open
        onClose={onClose}
        loading={isLoading}
        onFormSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        hideBackdrop
        headline="Login"
        content={
          <Fragment>
            <TextField
              variant="outlined"
              margin="normal"
              error={status.includes("invalidUsername")}
              required
              fullWidth
              label="Username"
              inputRef={loginUsername}
              autoFocus
              autoComplete="off"
              type="text"
              onChange={() => {
                if (status.includes("invalidUsername")) {
                  setStatus(status.replace(/invalidUsername/g, ""));
                }
              }}
              helperText={
                status.includes("invalidUsername") &&
                "This username isn't associated with an account."
              }
              FormHelperTextProps={{ error: true }}
            />
            <VisibilityPasswordTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={status.includes("invalidPassword")}
              label="Password"
              inputRef={loginPassword}
              autoComplete="off"
              onChange={() => {
                if (status.includes("invalidPassword")) {
                  setStatus(status.replace(/invalidPassword/g, ""));
                }
              }}
              helperText={
                status.includes("invalidPassword") ? (
                  <span>
                    Incorrect password. Try again, or click on{" "}
                    <b>&quot;Forgot Password?&quot;</b> to reset it.
                  </span>
                ) : (
                  ""
                )
              }
              FormHelperTextProps={{ error: true }}
              onVisibilityChange={setIsPasswordVisible}
              isVisible={isPasswordVisible}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={<Checkbox color="primary" />}
              label={<Typography variant="body1">Remember me</Typography>}
            />
            {status.includes("verificationEmailSend") && (
              <HighlightedInformation>
                We have send instructions on how to reset your password to your
                email address
              </HighlightedInformation>
            )}
          </Fragment>
        }
        actions={
          <Fragment>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={isLoading}
              size="large"
            >
              Login
              {isLoading && <ButtonCircularProgress />}
            </Button>
            <Typography
              align="center"
              className={classNames(
                classes.forgotPassword,
                isLoading ? classes.disabledText : null
              )}
              color="primary"
              onClick={isLoading ? null : openChangePasswordDialog}
              tabIndex={0}
              role="button"
              onKeyDown={(event) => {
                // For screenreaders listen to space and enter events
                if (
                  (!isLoading && event.keyCode === 13) ||
                  event.keyCode === 32
                ) {
                  openChangePasswordDialog();
                }
              }}
            >
              Forgot Password?
            </Typography>
          </Fragment>
        }
      />
    </Fragment>
  );
}

LoginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  openChangePasswordDialog: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.string
};

export default withRouter(withStyles(styles)(LoginDialog));
