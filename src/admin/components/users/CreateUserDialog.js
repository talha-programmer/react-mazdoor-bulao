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
  withStyles,
  MenuItem
} from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField";
import axios from "axios";
import api from "../../../config/api";
import { withRouter } from "react-router-dom";
import { QueryClient, useQueryClient } from "react-query";
import queryKeys from "../../../config/queryKeys";
import { toast } from "react-toastify";
import {
  userTypesArray,
  userTypesCodes,
  userTypesStrings
} from "../../../config/enums/userTypes";

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

function CreateUserDialog(props) {
  console.log("reached");
  const { history, theme, classes, open, setOpen } = props;

  const [status, setStatus] = useState("");
  //const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const registerPassword = useRef();
  const registerPasswordRepeat = useRef();
  const registerFullName = useRef();
  const registerUsername = useRef();
  const registerEmail = useRef();
  const queryClient = useQueryClient();
  const [userType, setUserType] = useState();

  const onClose = () => {
    setOpen(false);
  };

  const register = useCallback(() => {
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
    console.log(userType);

    const data = {
      name: registerFullName.current.value,
      username: registerUsername.current.value,
      email: registerEmail.current.value,
      password: registerPassword.current.value,
      password_confirmation: registerPasswordRepeat.current.value,
      user_type: userType
    };

    axios
      .post(api.saveUser, data)
      .then((result) => {
        if (result.data.user) {
          queryClient.invalidateQueries(queryKeys.users);
          toast.success("User saved successfully");
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
  }, [setStatus, status, queryClient]);

  return (
    <FormDialog
      loading={isLoading}
      onClose={onClose}
      open={open}
      headline="Create User"
      onFormSubmit={(e) => {
        e.preventDefault();
        register();
      }}
      hideBackdrop
      hasCloseIcon
      content={
        <Fragment>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            select
            autoFocus
            label="User Type"
            required
            //value={currency}
            onChange={(event) => {
              console.log(event.target.value);
              setUserType(event.target.value);
            }}
          >
            {userTypesArray.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={status.includes("invalidName")}
            label="Full Name"
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
          Save
          {isLoading && <ButtonCircularProgress />}
        </Button>
      }
    />
  );
}

CreateUserDialog.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withRouter(
  withStyles(styles, { withTheme: true })(CreateUserDialog)
);
