import { TextField } from "@material-ui/core";
import axios from "axios";
import api from "../../../config/api";
import { withRouter } from "react-router-dom";

function Logout(props) {
  const { history } = props;
  console.log("reached");
  localStorage.removeItem("loginToken");
  axios
    .post(api.logout)
    .catch((error) => console.log(error))
    .finally(() => history.push("/"));
  return (
    <div>
      <TextField>Logout Successful</TextField>
    </div>
  );
}

export default withRouter(Logout);
