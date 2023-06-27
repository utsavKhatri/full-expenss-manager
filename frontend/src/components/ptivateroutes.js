import React, { useEffect, useState } from "react";
import Login from "../pages/login";
import Cookies from "js-cookie";

const Privateroutes = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(JSON.parse(Cookies.get("userInfo")));
  }, []);

  if (Cookies.get("userInfo")) {
    return <>{children}</>;
  } else {
    return <Login />;
  }
};

export default Privateroutes;
