import React, { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../utils";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [user, setUser] = useLocalStorage("userInfo", "");
  const [refresh, setRefresh] = useState(false);
  const [accname, setAccname] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();


  const fetchHomepageData = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);

    const options = {
      method: "GET",
      url: "http://localhost:1337/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreateAccount = async () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);

    const options = {
      method: "POST",
      url: "http://localhost:1337/addAccount",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: accname,
      },
    };
    await axios
      .request(options)
      .then((response) => {
        console.log(response);
        if (response.status == 201) {
          setRefresh(!refresh);
        } else {
          return console.log("error");
        }
      })
      .catch((error) => {
        return console.log(error);
      });
      return onClose();
  };

  const handleDeleteAcc = async (accID) => {
    console.log("acc id -->", accID);
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "DELETE",
      url: `http://localhost:1337/delAccount/${accID}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .request(options)
      .then((response) => {
        console.log(response.data.data);
        if (response.status == 200) {
          return setRefresh(!refresh);
        } else {
          return console.log("error");
        }
      })
      .catch((error) => {
        return console.log(error);
      });
  };
  return (
    <AuthContext.Provider
      value={{
        setUser,
        user,
        loading,accname, setAccname,
        setLoading,
        fetchHomepageData,
        data,
        setData,handleDeleteAcc,handleCreateAccount,
        refresh,
        setRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const dataState = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
