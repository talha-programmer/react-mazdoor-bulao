import { TextField } from "@material-ui/core";
import axios from "axios";
import api from "../../../config/api";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { useQueryClient } from "react-query";
import queryKeys from "../../../config/queryKeys";

function Logout(props) {
  const { history } = props;
  const queryClinet = useQueryClient();
  Cookies.remove("loginToken");
  axios
    .post(api.logout)
    .catch((error) => console.log(error))
    .finally(() => {
      queryClinet.invalidateQueries(queryKeys.user);
      history.push("/");
    });
  return (
    <div>
      <TextField>Logout Successful</TextField>
    </div>
  );
}

export default withRouter(Logout);
