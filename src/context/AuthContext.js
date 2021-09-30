import Cookies from "js-cookie";
import { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import useUser from "../hooks/useUser";
import React from "react";

const AuthContext = React.createContext();

function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used with an AuthProvider");
  }

  return context;
}

function AuthProvider(props) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const userQuery = useUser();
  if (Cookies.get("loginToken")) {
    if (userQuery.isSuccess) {
      setLoggedInUser(userQuery.data);
    } else if (userQuery.isError) {
      console.log(userQuery.error);
    }
  }

  const value = useMemo(() => [loggedInUser, setLoggedInUser], [loggedInUser]);

  return <AuthContext.Provider value={value} {...props} />;
}

export { useAuth, AuthProvider };
