import React, { Fragment, Suspense, lazy, useContext } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
import Pace from "./shared/components/Pace";
import axios from "axios";

import Echo from "laravel-echo";
import pusherJs from "pusher-js";
import { AuthContext } from "./context/AuthContext";
import { userTypesCodes } from "./config/enums/userTypes";

const LoggedInComponent = lazy(() => import("./logged_in/components/Main"));

const LoggedOutComponent = lazy(() => import("./logged_out/components/Main"));

const AdminComponent = lazy(() => import("./admin/components/Main"));

const Router = () => {
  const { token, user } = useContext(AuthContext);

  // It will send auth related cookies with every request
  axios.defaults.withCredentials = true;

  //const authToken = localStorage.getItem("loginToken");
  axios.defaults.headers.common = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json"
  };

  window.Pusher = pusherJs;

  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "2222",
    wsHost: "localhost",
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    //authEndPoint: "http://localhost:8000/broadcasting/auth"
    authorizer: (channel, options) => {
      return {
        authorize: (socketId, callback) => {
          axios
            .post("http://api.mazdoorbulao.ml/broadcasting/auth", {
              socket_id: socketId,
              channel_name: channel.name
            })
            .then((response) => {
              callback(false, response.data);
            })
            .catch((error) => {
              callback(true, error);
            });
        }
      };
    }
  });

  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Pace color={theme.palette.primary.light} />
        <Suspense fallback={<Fragment />}>
          <Switch>
            {user && (
              // Private routes which require login
              <Route path="/user">
                <LoggedInComponent />
              </Route>
            )}

            {user && user.user_type == userTypesCodes.ADMIN && (
              <Route path="/admin">
                <AdminComponent />
              </Route>
            )}
            <Route>
              <LoggedOutComponent />
            </Route>
          </Switch>
        </Suspense>
      </MuiThemeProvider>
    </BrowserRouter>
  );
};

export default Router;
