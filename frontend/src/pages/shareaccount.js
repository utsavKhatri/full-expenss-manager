import React, { useEffect, useState } from "react";
import SidebarWithHeader from "./components/navbar";
import { Flex, Select, Stack } from "@chakra-ui/react";
import MainTemplate from "./components/maintemplate";
import axios from "axios";
import Loader from "./components/Loader";

const shareaccount = () => {
  const [shareList, setShareList] = useState();
  const [loading, setLoading] = useState(true);

  const fetchShareUserData = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "GET",
      url: "http://localhost:1337/share",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        setShareList(response.data);
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

  useEffect(() => {
    fetchShareUserData();
  }, []);

  return loading == true ? (
    <Loader/>
  ) : (
    <MainTemplate>
      <Flex>
        <h1>Share Account</h1>
        <Stack spacing={3}>
          <Select placeholder="select user to share account" size="md">
            {shareList.users.map((user) => (
              <option value={user.id}>{user.name}</option>
            ))}
          </Select>
        </Stack>
      </Flex>
    </MainTemplate>
  );
};

export default shareaccount;
