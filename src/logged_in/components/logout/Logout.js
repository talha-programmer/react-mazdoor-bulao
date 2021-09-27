import { TextField } from "@material-ui/core";
import axios from "axios";
import api from "../../../config/api";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import AuthController from "../../../controllers/AuthController";

function Logout(props) {
  const { history } = props;
  Cookies.remove("loginToken");
  axios
    .post(api.logout)
    .catch((error) => console.log(error))
    .finally(() => {
      AuthController.deleteLoggedInUser();
      history.push("/");
    });
  return (
    <div>
      <TextField>Logout Successful</TextField>
    </div>
  );
}

export default withRouter(Logout);
