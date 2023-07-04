import { Flex, Heading, Stack, Text, WrapItem, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

type SearchResult = {
  account: any;
  text: string | number | boolean | null | undefined;
  transfer: string | number | boolean | null | undefined;
};

type SearchResultCompProps = {
  searchResult: SearchResult[];
};

const SearchResultComp: React.FC<SearchResultCompProps> = ({ searchResult }) => {
  return (
    <Flex align={'center'} flexDirection={'column'} width={'100%'} gap={4}>
      <Heading size={'sm'}>Search result</Heading>
      {searchResult.map((result, i) => (
        <WrapItem key={i} justifyContent={'center'} width={'100%'}>
          <Stack
            bg={useColorModeValue('white', '#1c1c1c')}
            boxShadow={'sm'}
            px={5}
            py={3}
            rounded={'md'}
            borderBlock={'HighlightText'}
            borderWidth={'thin'}
            borderColor={useColorModeValue('navy', 'lime')}
            _hover={{
              shadow: 'lg',
              bg: useColorModeValue('white', 'gray.800'),
              color: useColorModeValue('black', 'white'),
              borderWidth: 1,
              borderBlockColor: useColorModeValue('black', 'white'),
            }}
            align={'center'}
            pos={'relative'}
            width={'75%'}
            key={i + 1}
          >
            <Link href={`/account/${result.account}`}>
              <Flex
                flexDirection={{ base: 'column', md: 'row' }}
                gap={3}
                alignItems={'center'}
                justifyContent={'space-evenly'}
              >
                <Text as={'h3'} fontSize={'md'} textAlign="center">
                  Text: {result.text}
                </Text>
                <Text
                  textAlign={'center'}
                  color={useColorModeValue('gray.600', 'gray.400')}
                  fontSize={'sm'}
                >
                  Tranfer: {result.transfer}
                </Text>
              </Flex>
            </Link>
          </Stack>
        </WrapItem>
      ))}
    </Flex>
  );
};

export default SearchResultComp;
