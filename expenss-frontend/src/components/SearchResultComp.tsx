import {
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  WrapItem,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

type SearchResult = {
  account: any;
  text: string | number | boolean | null | undefined;
  transfer: string | number | boolean | null | undefined;
  amount: string | number;
};

type SearchResultCompProps = {
  searchResult: SearchResult[];
};

const SearchResultComp: React.FC<SearchResultCompProps> = ({
  searchResult,
}) => {
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

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
                <Text as={'h3'} fontSize={'lg'} textAlign="center">
                  Text: {result.text?.toString()}
                </Text>

                <Divider
                  orientation={!isLargerThan800 ? 'horizontal' : 'vertical'}
                  borderColor={useColorModeValue('gray.400', 'gray.600')}
                  height={5}
                />

                <Text textAlign={'center'} fontSize={'md'}>
                  Transfer: {result.transfer}
                </Text>

                <Divider
                  orientation={!isLargerThan800 ? 'horizontal' : 'vertical'}
                  borderColor={useColorModeValue('gray.400', 'gray.600')}
                  height={5}
                />

                <Text textAlign={'center'} fontSize={'md'}>
                  Amount:{' '}
                  <Text
                    as="span"
                    color={useColorModeValue('navy', 'lime')}
                    fontWeight="bold"
                  >
                    {result.amount}
                  </Text>
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
