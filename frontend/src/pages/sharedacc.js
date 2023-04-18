import React from "react";
import { Flex, Heading, Stack } from "@chakra-ui/react";
import MainTemplate from "./components/maintemplate";
import { dataState } from "../../context";
import {
  Testimonial,
  TestimonialContent,
  TestimonialHeading,
  TestimonialText,
} from "./homepage";
import Link from "next/link";
import Loader from "./components/Loader";

const sharedacc = () => {
  const { data, loading } = dataState();

  return loading == true ? (
    <Loader/>
  ) : (
    <MainTemplate>
      <Flex gap={2} direction={"column"}>
        <Heading size={"lg"} my={4}>
          welcome to shared acc list
        </Heading>
        <Stack>
          {data.sharedAccounts.length > 0 ? (
            data.sharedAccounts.map((v, i) => {
              return (
                <Testimonial key={i}>
                  <TestimonialContent key={i + 1}>
                    <Link href={`/account/${v.id}`}>
                      <TestimonialHeading textAlign="center">
                        {v.name}
                      </TestimonialHeading>
                      <TestimonialText>Owner: {v.owner.name}</TestimonialText>
                    </Link>
                  </TestimonialContent>
                </Testimonial>
              );
            })
          ) : (
            <Heading size={"md"}>No sahred account</Heading>
          )}
        </Stack>
      </Flex>
    </MainTemplate>
  );
};

export default sharedacc;
