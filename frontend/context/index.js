import React, { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../utils";
import axios from "axios";
import { useDisclosure, useToast } from "@chakra-ui/react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState();
  const [accountId, setId] = useState()
  const [data, setData] = useState();
  const [user, setUser] = useLocalStorage("userInfo", "");
  const [refresh, setRefresh] = useState(false);
  const [accname, setAccname] = useState("");
  const toast = useToast()
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
        toast({
          title: error.response.data.message,
          variant: "left-accent",
          status: "error",
          duration: 2000,
        })
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
          toast({
            title: "Account created successfully",
            variant: "left-accent",
            status: "success",
            duration: 3000,
          })
        } else {
          toast({
            title: "Something went wrong",
            variant: "left-accent",
            status: "error",
            duration: 2000,
          })
        }
      })
      .catch((error) => {
        toast({
          title: error.response.data.message,
          variant: "left-accent",
          status: "error",
          duration: 2000,
        })
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
          setRefresh(!refresh);
          toast({
            title: "Account deleted successfully",
            variant: "left-accent",
            status: "success",
            duration: 3000,
          })
        } else {
          toast({
            title: "Something went wrong",
            variant: "left-accent",
            status: "error",
            duration: 2000,
          })
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          variant: "left-accent",
          status: "error",
          duration: 2000,
        })
      });
  };
  return (
    <AuthContext.Provider
      value={{
        setUser,
        user,setRefresh,
        loading,accname, setAccname,
        setLoading,
        fetchHomepageData,
        data,
        setData,handleDeleteAcc,handleCreateAccount,
        refresh,
        setRefresh,searchResult, setSearchResult,accountId, setId
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
