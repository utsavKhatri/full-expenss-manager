import { currencyFormat } from '@/utils';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Text,
  WrapItem,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';

type AccountCardProps = {
  account: {
    id: string;
    name: string;
    balance: any | number;
  };
  handleDeleteAcc: (id: string) => void;
};

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  handleDeleteAcc,
}) => {
  const textColor: string = useColorModeValue('black', 'white');
  const bgColor: string = useColorModeValue('gray.50', '#1a1a1a');
  const cardBgColor: string = useColorModeValue('gray.400', '#636363');
  const cardInfoColor: string = useColorModeValue('gray.700', 'gray.200');
  const hoverBgColor: string = useColorModeValue('gray.200', 'gray.800');

  return (
    <WrapItem justifyContent="center">
      <Box
        width="100%"
        maxWidth="400px"
        height="auto"
        bg={bgColor}
        boxShadow="md"
        borderRadius="lg"
        overflow="hidden"
        _hover={{
          boxShadow: 'lg',
        }}
      >
        <Link
          href={`/account/${account.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Box width="100%" height="40px" bg={cardBgColor} />
          <Box p={4}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={cardInfoColor}
              textTransform="uppercase"
            >
              CARD NUMBER
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              mt={1}
              letterSpacing="0.01em"
              textTransform="uppercase"
              color={textColor}
            >
              **** **** **** {account.id.slice(-4)}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={cardInfoColor}
              textTransform="uppercase"
              mt={4}
            >
              ACCOUNT NAME
            </Text>
            <Text
              fontSize="xs"
              fontWeight="bold"
              mt={1}
              textTransform="uppercase"
              color={textColor}
            >
              {account.name}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={cardInfoColor}
              textTransform="uppercase"
              mt={4}
            >
              BALANCE
            </Text>
            <Text
              fontSize="xs"
              fontWeight="bold"
              mt={1}
              textTransform="uppercase"
              color={textColor}
            >
              {currencyFormat(account.balance.toFixed(2))}
            </Text>
          </Box>
        </Link>

        <Box
          width="100%"
          height="40px"
          px={4}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          opacity={0}
          transition="opacity 0.2s ease-in-out"
          _hover={{
            opacity: 1,
            bg: hoverBgColor,
          }}
        >
          <IconButton
            icon={<DeleteIcon />}
            color="red"
            background="none"
            aria-label="Delete account"
            onClick={() => handleDeleteAcc(account.id)}
          />
        </Box>
      </Box>
    </WrapItem>
  );
};

export default AccountCard;
