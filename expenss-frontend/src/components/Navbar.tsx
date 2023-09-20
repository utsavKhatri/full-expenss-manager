'use client';
import React, { useEffect, useState } from 'react';
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
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';
import { FiMenu, FiChevronDown, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { dataState } from '@/context';
import Image from 'next/image';
import { BiSolidFileImport } from 'react-icons/bi';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { LuLayoutDashboard } from 'react-icons/lu';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const LinkItems = [
  { name: 'Dashboard', icon: LuLayoutDashboard, href: '/dashboard' },
  { name: 'Accounts', icon: MdAccountBalanceWallet, href: '/' },
  { name: 'Shared account', icon: AccountTreeIcon, href: '/shared' },
  { name: 'Profile', icon: AccountBoxIcon, href: '/profile' },
  { name: 'Import', icon: BiSolidFileImport, href: '/import/transactions' },
];

export default function SidebarWithHeader({
  isShow = false,
  children,
}: {
  isShow?: boolean;
  children: React.ReactNode;
}) {
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
      <MobileNav onOpen={onOpen} isShow={isShow} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }: any) => {
  return (
    <Box
      transition="2s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent={{ base: 'space-between', md: 'center' }}
      >
        <Image
          alt="logo"
          width={70}
          height={30}
          src="/android-chrome-512x512.png"
        />
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

const NavItem = ({ icon, children, href, ...rest }: any) => {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
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

const MobileNav = ({ isShow, onOpen, ...rest }: any) => {
  const { currentuserData, handleLogout, handleSearch } = dataState();
  const { colorMode, toggleColorMode } = useColorMode();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(searchTerm);
    }, 1500);

    // Cleanup the timeout on every input change
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value);
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
        {isShow && (
          <FormControl ml={2}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<FiSearch />} />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={handleInputChange}
                _placeholder={{
                  color: 'gray.400',
                }}
              />
            </InputGroup>
          </FormControl>
        )}
        <Button
          onClick={toggleColorMode}
          rounded={'full'}
          bg={'transparent'}
          fontSize={'2xl'}
          aria-label="toggle-color-mode"
        >
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
                <Avatar
                  size={'sm'}
                  src={currentuserData?.user.profile}
                  aria-label="User profile"
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">
                    {currentuserData && currentuserData.user.name}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {currentuserData && currentuserData.user.email}
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
              <MenuItem
                as={Link}
                href={'/profile'}
                bg={useColorModeValue('white', 'gray.900')}
                _hover={{
                  color: '#67aaff',
                }}
              >
                Profile
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={handleLogout}
                bg={useColorModeValue('white', 'gray.900')}
                _hover={{
                  color: '#67aaff',
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
