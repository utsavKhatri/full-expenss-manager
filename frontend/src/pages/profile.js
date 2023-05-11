import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import SidebarWithHeader from "./components/navbar";
import { dataState } from "../../context";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function UserProfileEdit() {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState();
  const toast = useToast();
  const router = useRouter();
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    axios
      .get("http://localhost:1337/editProfile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });



  }, [refresh]);
  const handleupdateProfile = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "PUT",
      url: `http://localhost:1337/editProfile`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: name,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        if (response.data.status == 200) {
          toast({
            title: "Profile Updated Successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setRefresh(!refresh);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <SidebarWithHeader>
      {profile == null ? (
        <Loader />
      ) : (
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.50", "gray.900")}
        >
          <Stack
            spacing={4}
            w={"full"}
            maxW={"md"}
            bg={useColorModeValue("white", "gray.700")}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={12}
          >
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
              User Profile Edit
            </Heading>
            <FormControl id="userName" isRequired>
              <FormLabel>User name</FormLabel>
              <Input
                placeholder="UserName"
                defaultValue={profile && profile.name}
                onChange={(e) => setName(e.target.value)}
                _placeholder={{ color: "gray.500" }}
                type="text"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                placeholder="your-email@example.com"
                defaultValue={profile && profile.email}
                _placeholder={{ color: "gray.500" }}
                type="email"
                disabled
              />
            </FormControl>
            <Stack spacing={6} direction={["column", "row"]}>
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
                onClick={() => setName("")}
              >
                Cancel
              </Button>
              <Button
                bg={"blue.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleupdateProfile}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Flex>
      )}
    </SidebarWithHeader>
  );
}
