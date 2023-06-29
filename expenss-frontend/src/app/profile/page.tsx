'use client';
import Loader from '@/components/Loader';
import SidebarWithHeader from '@/components/Navbar';
import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { Suspense, useEffect, useState } from 'react';

const page = () => {
  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    setUserData(JSON.parse(Cookies.get('userInfo') as any));
  }, []);

  return (
    <SidebarWithHeader>
      <Suspense fallback={<Loader />}>
        <Flex
          justifyContent="center"
          gap={4}
          flexDirection={'column'}
          alignItems={'center'}
        >
          {userData ? (
            <Box p={4}>
              <Flex alignItems="center" mb={8}>
                <Avatar
                  size="xl"
                  name={userData.user.name}
                  src="/profile-picture.jpg"
                  mr={4}
                />
                <Box>
                  <Heading as="h1" size="lg" textTransform={'capitalize'}>
                    {userData.user.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    Web Developer
                  </Text>
                </Box>
              </Flex>
              <Flex
                gap={{ base: 4, md: 2 }}
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ base: 'flex-start', md: 'center' }}
                mb={4}
              >
                <Box>
                  <Text fontSize="md">Email</Text>
                  <Text fontSize="sm">{userData.user.email}</Text>
                </Box>
                <Box>
                  <Text fontSize="md">Location</Text>
                  <Text fontSize="sm">New York, USA</Text>
                </Box>
                <Box>
                  <Text fontSize="md">Website</Text>
                  <Text fontSize="sm">{userData.user.email}</Text>
                </Box>
              </Flex>
              <Box>
                <Heading as="h2" size="md" mb={4}>
                  About Me
                </Heading>
                <Text fontSize="sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Integer nec odio. Praesent libero. Sed cursus ante dapibus
                  diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
                  Duis sagittis ipsum. Praesent mauris.
                </Text>
              </Box>
            </Box>
          ) : (
            <Loader />
          )}
        </Flex>
      </Suspense>
    </SidebarWithHeader>
  );
};

export default page;
