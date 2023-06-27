import React, { useState } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  useColorMode,
  useToast,
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';
import {
  FiHome,
  FiCompass,
  FiBox,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiSearch,
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { dataState } from '../../context';
import axios from 'axios';
import Link from 'next/link';
import { InfoOutlineIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import Cookies from 'js-cookie';

const LinkItems = [
  { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
  { name: 'Accounts', icon: FiBox, href: '/homepage' },
  { name: 'Shared account', icon: FiCompass, href: '/sharedacc' },
  { name: 'Profile', icon: InfoOutlineIcon, href: '/profile' },
];

export default function SidebarWithHeader({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      minH="100vh"
      color={useColorModeValue('black', 'white')}
      bg={useColorModeValue('gray.100', 'gray.900')}
    >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} href={link.href} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, href, ...rest }) => {
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const { user, setUser, searchResult, setSearchResult } = dataState();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const router = useRouter();
  const handleLogout = () => {
    const { token } = JSON.parse(Cookies.get('userInfo'));
    console.log(token);
    const options = {
      method: 'GET',
      url: 'http://localhost:1337/logout',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        // console.log(response);
        setUser(null);
        toast({
          title: 'Logged out successfully',
          status: 'success',
          duration: 1000,
        });
        return router.push('/');
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: `Something went wrong ${error.response.data.message}`,
          status: 'error',
          duration: 1000,
        });
      });
  };
  const handleSearch = (searchData) => {
    if (searchData === '') {
      return setSearchResult(null);
    }
    const { token } = JSON.parse(Cookies.get('userInfo'));
    // console.log(token);
    const options = {
      method: 'POST',
      url: 'http://localhost:1337/searchTransaction',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        searchTerm: searchData,
      },
    };
    axios
      .request(options)
      .then((response) => {
        setSearchResult(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: `Something went wrong ${error.response.data.message}`,
          status: 'error',
          duration: 1000,
        });
      });
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <HStack spacing={{ base: '3', md: '6' }}>
        <FormControl>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<FiSearch />} />
            <Input
              placeholder="Search"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              _placeholder={{
                color: 'gray.400',
              }}
            />
          </InputGroup>
        </FormControl>
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar size={'sm'} src="https://bit.ly/broken-link" />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user && user.user.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {user && user.user.email}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <Link href="/profile">
                <MenuItem>Profile</MenuItem>
              </Link>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
