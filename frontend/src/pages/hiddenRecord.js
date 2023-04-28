import { Button, Container, Flex, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

const hiddenRecord = () => {
  const [accId, setAccId] = useState("");
  const [qnty, setQnty] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleCreateTrans = () => {
    setLoading(true);
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "POST",
      url: `http://localhost:1337/largeDataInsert/${accId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        qnty: qnty,
      },
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status == 201) {
          setLoading(false);
          setQnty("");
          return toast({
            title: "Transactions created successfully",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "something went wrong",
          status: "error",
          duration: 1000,
        });
        return setLoading(false);
      });
  };

  return (
    <Container my={"auto"}>
      <Flex justifyContent={"center"} alignItems={"center"} flexDirection={"column"} gap={4}>
        <FormControl isRequired>
          <FormLabel>Account Id</FormLabel>
          <Input
            required
            placeholder="enter transaction account id"
            onChange={(e) => setAccId(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Trans qauntity</FormLabel>
          <Input
            required
            placeholder="enter transaction Qnty"
            onChange={(e) => setQnty(e.target.value)}
          />
        </FormControl>
        <Button onClick={handleCreateTrans} isLoading={loading}>
          create
        </Button>
      </Flex>
    </Container>
  );
};

export default hiddenRecord;
