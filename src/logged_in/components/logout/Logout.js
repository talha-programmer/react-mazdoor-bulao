import { TextField } from "@material-ui/core";
import axios from "axios";
import api from "../../../config/api";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { useQueryClient } from "react-query";
import queryKeys from "../../../config/queryKeys";
import { AuthContext } from "../../../context/AuthContext";
import { React, useContext } from "react";

function Logout(props) {
  const { history } = props;
  const { setToken } = useContext(AuthContext);
  const queryClinet = useQueryClient();
  Cookies.remove("loginToken");
  setToken(null);
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
