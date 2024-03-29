import { useState } from "react";

import React, { useEffect } from "react";
import Cookies from "js-cookie";
import useUser from "../hooks/user/useUser";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  let tokenLocal;
  try {
    tokenLocal = Cookies.get("loginToken");
  } catch (err) {
    tokenLocal = null;
  }

  const [token, setToken] = useState(tokenLocal);
  const [user, setUser] = useState(null);
  const { data: userReceived, isError, isSuccess, refetch } = useUser();

  useEffect(() => {
    if (isSuccess) {
      setUser(userReceived);
    }
  }, [isSuccess, setUser, userReceived]);

  const reloadUser = () => {
    refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        reloadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
