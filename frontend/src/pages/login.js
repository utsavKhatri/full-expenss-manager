import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useLocalStorage from "../../utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useLocalStorage("userInfo", {});
  const toast = useToast()

  const route = useRouter();

  const handleLogin = () => {
    console.log("email, pass", email, password);
    const config = {
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:1337/login", config)
      .then((response) => {
        console.log(response);
        setUser(response.data.data);
        route.push("/homepage");
        toast({
          title: 'login sucess',
          variant: "left-accent",
          status: 'success',
          isClosable: true,
        })
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          variant: "left-accent",
          status: 'error',
          isClosable: true,
        })
      });
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool{" "}
            <Link href="/" color={"blue.400"}>
              features
            </Link>{" "}
            ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={"blue.400"} href="/signup">
                  Signup
                </Link>
              </Stack>
              <Button
                bg={"blue.400"}
                color={"white"}
                onClick={handleLogin}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
