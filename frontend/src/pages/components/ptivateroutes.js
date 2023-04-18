import React, { useEffect, useState } from "react";
import Login from "../login";

const Privateroutes = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("userInfo")));
  }, []);

  if (user) {
    return <>{children}</>;
  } else {
    return <Login />;
  }
};

export default Privateroutes;
