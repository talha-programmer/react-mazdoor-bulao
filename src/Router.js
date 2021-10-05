import React, { Fragment, Suspense, lazy, useState, useEffect } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
import Pace from "./shared/components/Pace";
import useUser from "./hooks/user/useUser";
const LoggedInComponent = lazy(() => import("./logged_in/components/Main"));

const LoggedOutComponent = lazy(() => import("./logged_out/components/Main"));
const Router = () => {
  const userQuery = useUser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userQuery.isSuccess) {
      setUser(userQuery.data);
    } else if (userQuery.isError) {
      console.log(userQuery.error);
    }
  }, [userQuery.data, userQuery.error, userQuery.isError, userQuery.isSuccess]);

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
